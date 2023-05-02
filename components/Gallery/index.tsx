import { useEffect, useState } from "react";

import GalleryItem from "@/components/GalleryItem";
import PlusCircleDotted from "@/components/Icons/PlusCircleDotted";
import ImageAddModal from "@/components/ImageAddModal";

import { DEFAULT_GALLERY } from "@/interfaces/IGallery";
import useGallery from "@/hooks/useGallery";
import { toast } from "react-toastify";

const GalleryView = () => {
  const { isLoading, fetchImages, addImage, deleteImage } = useGallery();

  const [images, setImages] = useState<
    Array<{
      id: number | null;
      image: string;
      compressedImage: string;
    }>
  >(DEFAULT_GALLERY.images);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchImages().then((data) => {
      if (data) {
        setImages(data.images);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full max-h-full flex flex-col justify-start items-center overflow-x-hidden overflow-y-auto">
      <div className="w-full grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2 p-2">
        {images?.map((image, index) => {
          return (
            <div className="col-span-1" key={index}>
              <GalleryItem
                index={index}
                image={image}
                onClick={() => {
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
              />
            </div>
          );
        })}
        <div
          className="col-span-1 w-full h-full min-h-[200px] flex flex-row justify-center items-center outline-dashed outline-2 hover:outline-blueSecondary hover:text-blueSecondary transition-all duration-300 cursor-pointer rounded-md"
          onClick={() => {
            setIsAddModalVisible(true);
          }}
        >
          <PlusCircleDotted width={48} height={48} />
        </div>
      </div>

      <ImageAddModal
        isVisible={isAddModalVisible}
        setVisible={setIsAddModalVisible}
        addImage={(imageFile: File) => {
          addImage(imageFile).then((data) => {
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
      />

      {isLoading && <div className="loading"></div>}
    </div>
  );
};

export default GalleryView;
