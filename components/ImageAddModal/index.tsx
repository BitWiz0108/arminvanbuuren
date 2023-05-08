import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";

import X from "@/components/Icons/X";
import ButtonUpload from "@/components/ButtonUpload";
import ButtonSettings from "@/components/ButtonSettings";
import Select from "@/components/Select";

import { IMAGE_SIZE } from "@/libs/constants";

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
  const [imageSize, setImageSize] = useState<IMAGE_SIZE>(
    image ? image.size : IMAGE_SIZE.SQUARE
  );
  const [description, setDescription] = useState<string>(
    image ? image.description : ""
  );

  useEffect(() => {
    if (isVisible) {
      setImageFile(null);
      setImageSize(image ? image.size : IMAGE_SIZE.SQUARE);
      setDescription(image ? image.description : "");
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
              <ButtonUpload
                sname="Upload Image"
                label=""
                setValue={setImageFile}
                placeholder="Upload Image"
                accept_file="image/*"
              />
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
                      updateImage(image.id, imageFile, imageSize, description);
                      setImageFile(null);
                    } else {
                      if (!imageFile) {
                        toast.warn("Please select new image.");
                        return;
                      }
                      addImage(imageFile, imageSize, description);
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
