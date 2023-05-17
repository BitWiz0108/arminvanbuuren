import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import GalleryItem from "@/components/GalleryItem";
import PlusCircleDotted from "@/components/Icons/PlusCircleDotted";
import ImageAddModal from "@/components/ImageAddModal";

import useGallery from "@/hooks/useGallery";

import { DEFAULT_GALLERY, IImage } from "@/interfaces/IGallery";
import { FILE_TYPE, IMAGE_SIZE } from "@/libs/constants";
import { useAuthValues } from "@/contexts/contextAuth";
import RadialProgress from "../RadialProgress";

const GalleryView = () => {
  const { isSignedIn } = useAuthValues();
  const {
    isLoading,
    loadingProgress,
    fetchImages,
    addImage,
    updateImage,
    deleteImage,
  } = useGallery();

  const [image, setImage] = useState<IImage | null>(null);
  const [images, setImages] = useState<Array<IImage>>(DEFAULT_GALLERY.images);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isSignedIn) {
      fetchImages().then((data) => {
        if (data) {
          setImages(data.images);
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  return (
    <div className="relative w-full max-h-full flex flex-col justify-start items-center overflow-x-hidden overflow-y-auto">
      <div className="w-full grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2 p-2">
        {images?.map((image, index) => {
          return (
            <div className="col-span-1" key={index}>
              <GalleryItem
                index={index}
                image={image}
                onDelete={() => {
                  deleteImage(image.id).then((value) => {
                    if (value) {
                      fetchImages().then((data) => {
                        if (data) {
                          setImages(data.images);
                        }
                      });

                      toast.success("Successfully deleted!");
                    }
                  });
                }}
                onEdit={() => {
                  setImage(image);
                  setIsAddModalVisible(true);
                }}
              />
            </div>
          );
        })}
        <div
          className="col-span-1 w-full h-[280px] min-h-[280px] max-h-[280px] flex flex-row justify-center items-center outline-dashed outline-2 hover:outline-blueSecondary hover:text-blueSecondary transition-all duration-300 cursor-pointer rounded-md"
          onClick={() => {
            setImage(null);
            setIsAddModalVisible(true);
          }}
        >
          <PlusCircleDotted width={48} height={48} />
        </div>
      </div>
      <ImageAddModal
        image={image}
        isVisible={isAddModalVisible}
        setVisible={setIsAddModalVisible}
        addImage={(
          galleryImageType: FILE_TYPE,
          imageFile: File | null,
          imageFileCompressed: File | null,
          videoFile: File | null,
          videoFileCompressed: File | null,
          size: IMAGE_SIZE,
          description: string
        ) => {
          console.log(
            galleryImageType,
            imageFile,
            imageFileCompressed,
            videoFile,
            videoFileCompressed,
            size,
            description
          );
          addImage(
            galleryImageType,
            imageFile,
            imageFileCompressed,
            videoFile,
            videoFileCompressed,
            size,
            description
          ).then((data) => {
            if (data) {
              fetchImages().then((value) => {
                if (value) {
                  setImages(value.images);
                }
              });

              toast.success("Successfully added!");
              setIsAddModalVisible(false);
            }
          });
        }}
        updateImage={(
          id: number,
          galleryImageType: FILE_TYPE,
          imageFile: File | null,
          imageFileCompressed: File | null,
          videoFile: File | null,
          videoFileCompressed: File | null,
          size: IMAGE_SIZE,
          description: string
        ) => {
          updateImage(
            id,
            galleryImageType,
            imageFile,
            imageFileCompressed,
            videoFile,
            videoFileCompressed,
            size,
            description
          ).then((data) => {
            if (data) {
              fetchImages().then((value) => {
                if (value) {
                  setImages(value.images);
                }
              });

              toast.success("Successfully updated!");
              setIsAddModalVisible(false);
            }
          });
        }}
      />
      {isLoading && (
        <div className="loading w-[50px] h-[50px]">
          {loadingProgress > 0 ? (
            <div className="w-20 h-20">
              <CircularProgressbar
                styles={buildStyles({
                  pathColor: "#0052e4",
                  textColor: "#ffffff",
                  trailColor: "#888888",
                })}
                value={loadingProgress}
                maxValue={100}
                text={`${loadingProgress}%`}
              />
            </div>
          ) : (
            <RadialProgress width={50} height={50} />
          )}
        </div>
      )}{" "}
    </div>
  );
};

export default GalleryView;
