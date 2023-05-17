import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";

import X from "@/components/Icons/X";
import ButtonUpload from "@/components/ButtonUpload";
import ButtonSettings from "@/components/ButtonSettings";
import Select from "@/components/Select";
import RadioBoxGroup from "@/components/RadioBoxGroup";

import { FILE_TYPE, IMAGE_SIZE } from "@/libs/constants";

import { IImage } from "@/interfaces/IGallery";

const TextAreaInput = dynamic(() => import("@/components/TextAreaInput"), {
  ssr: false,
});

type Props = {
  image: IImage | null;
  isVisible: boolean;
  setVisible: Function;
  addImage: Function;
  updateImage: Function;
};

const ImageAddModal = ({
  image,
  isVisible,
  setVisible,
  addImage,
  updateImage,
}: Props) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUploaded, setImageFileUploaded] = useState<string>("");
  const [imageFileCompressed, setImageFileCompressed] = useState<File | null>(
    null
  );
  const [imageFileCompressedUploaded, setImageFileCompressedUploaded] =
    useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFileUploaded, setVideoFileUploaded] = useState<string>("");
  const [videoFileCompressed, setVideoFileCompressed] = useState<File | null>(
    null
  );
  const [videoFileCompressedUploaded, setVideoFileCompressedUploaded] =
    useState<string>("");
  const [imageSize, setImageSize] = useState<IMAGE_SIZE>(
    image ? image.size : IMAGE_SIZE.SQUARE
  );
  const [description, setDescription] = useState<string>(
    image ? image.description : ""
  );
  const [galleryImageType, setGalleryImageType] = useState<FILE_TYPE>(
    image ? image.type : FILE_TYPE.IMAGE
  );

  const handleGalleryImageOptionChanged = (value: FILE_TYPE) => {
    setGalleryImageType(value);
  };

  const radioBoxOptions = [
    { label: "Image", value: FILE_TYPE.IMAGE },
    { label: "Video", value: FILE_TYPE.VIDEO },
  ];

  useEffect(() => {
    if (isVisible) {
      setImageFile(null);
      setImageSize(image ? image.size : IMAGE_SIZE.SQUARE);
      setDescription(image ? image.description : "");
      setGalleryImageType(image ? image.type : FILE_TYPE.IMAGE);
      if (image) {
        setImageFileUploaded(image.image);
        setImageFileCompressedUploaded(image.imageCompressed);
        setVideoFileUploaded(image.video);
        setVideoFileCompressedUploaded(image.videoCompressed);
      }
    }
  }, [isVisible, image]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed left-0 top-0 w-screen h-screen p-5 bg-[#000000aa] flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-full md:w-[540px] max-h-full px-5 md:px-10 pt-10 pb-5 md:pb-10 bg-background rounded-lg overflow-x-hidden overflow-y-auto pr-5">
            <div className="absolute top-5 right-5 text-primary cursor-pointer">
              <X
                width={24}
                height={24}
                onClick={() => {
                  setVisible(false);
                }}
              />
            </div>
            <div className="mt-5 flex flex-col justify-center items-center">
              <RadioBoxGroup
                options={radioBoxOptions}
                name="myRadioGroup"
                selectedValue={galleryImageType}
                onChange={(value) =>
                  handleGalleryImageOptionChanged(value as FILE_TYPE)
                }
              />
              {galleryImageType == FILE_TYPE.IMAGE ? (
                <div className="w-full justify-center items-center">
                  <ButtonUpload
                    id="upload_high_quality_image"
                    label="Upload High Quality Image"
                    file={imageFile}
                    setFile={setImageFile}
                    fileType={FILE_TYPE.IMAGE}
                    uploaded={imageFileUploaded}
                  />
                  <ButtonUpload
                    id="upload_low_quality_image"
                    label="Upload low Quality Image"
                    file={imageFileCompressed}
                    setFile={setImageFileCompressed}
                    fileType={FILE_TYPE.IMAGE}
                    uploaded={imageFileCompressedUploaded}
                  />
                </div>
              ) : (
                <div className="w-full justify-center items-center">
                  <ButtonUpload
                    id="upload_high_quality_video"
                    label="Upload High Quality Video"
                    file={videoFile}
                    setFile={setVideoFile}
                    fileType={FILE_TYPE.VIDEO}
                    uploaded={videoFileUploaded}
                  />
                  <ButtonUpload
                    id="upload_low_quality_video"
                    label="Upload Low Quality Video"
                    file={videoFileCompressed}
                    setFile={setVideoFileCompressed}
                    fileType={FILE_TYPE.VIDEO}
                    uploaded={videoFileCompressedUploaded}
                  />
                </div>
              )}

              <Select
                defaultValue={IMAGE_SIZE.SQUARE}
                defaultLabel={IMAGE_SIZE.SQUARE}
                label="Size"
                value={imageSize}
                options={[
                  {
                    label: IMAGE_SIZE.WIDE,
                    value: IMAGE_SIZE.WIDE,
                  },
                  {
                    label: IMAGE_SIZE.TALL,
                    value: IMAGE_SIZE.TALL,
                  },
                  {
                    label: IMAGE_SIZE.WIDEANDTALL,
                    value: IMAGE_SIZE.WIDEANDTALL,
                  },
                ]}
                setValue={(value: string) => {
                  setImageSize(value as IMAGE_SIZE);
                }}
              />
              <div className="w-full">
                <TextAreaInput
                  id="description"
                  sname="Description"
                  placeholder="Enter description"
                  value={description}
                  setValue={setDescription}
                />
              </div>
              <div className="w-1/2">
                <ButtonSettings
                  label={image ? "Update" : "Add"}
                  bgColor="cyan"
                  onClick={() => {
                    if (image) {
                      updateImage(
                        image.id,
                        galleryImageType,
                        imageFile,
                        imageFileCompressed,
                        videoFile,
                        videoFileCompressed,
                        imageSize,
                        description
                      );
                      setImageFile(null);
                    } else {
                      if (galleryImageType == FILE_TYPE.IMAGE) {
                        if (!imageFile) {
                          toast.warn("Please select new image.");
                          return;
                        }
                      } else if (galleryImageType == FILE_TYPE.VIDEO) {
                        if (!videoFile) {
                          toast.warn("Please select new video.");
                          return;
                        }
                      }
                      addImage(
                        galleryImageType,
                        imageFile,
                        imageFileCompressed,
                        videoFile,
                        videoFileCompressed,
                        imageSize,
                        description
                      );
                      setImageFile(null);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageAddModal;
