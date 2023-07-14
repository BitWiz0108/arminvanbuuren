import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  GridContextProvider,
  GridDropZone,
  GridItem,
  swap,
} from "react-grid-dnd";

import GalleryItem from "@/components/GalleryItem";
import PlusCircleDotted from "@/components/Icons/PlusCircleDotted";
import ImageAddModal from "@/components/ImageAddModal";
import RadialProgress from "@/components/RadialProgress";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

import { useAuthValues } from "@/contexts/contextAuth";
import { useSizeValues } from "@/contexts/contextSize";

import useGallery from "@/hooks/useGallery";

import { DEFAULT_GALLERY, IImage } from "@/interfaces/IGallery";
import { FILE_TYPE, IMAGE_SIZE } from "@/libs/constants";

const GalleryView = () => {
  const { isSignedIn } = useAuthValues();
  const { width } = useSizeValues();
  const {
    isLoading,
    loadingProgress,
    fetchImages,
    addImage,
    updateImage,
    deleteImage,
    reArrangeImage,
  } = useGallery();

  const [image, setImage] = useState<IImage | null>(null);
  const [images, setImages] = useState<Array<IImage>>(DEFAULT_GALLERY.images);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [cols, setCols] = useState<number>(4);
  const [
    isDeleteConfirmationModalVisible,
    setIsDeleteConfirmationModalVisible,
  ] = useState<boolean>(false);

  const [deleteGalleryImageId, setDeleteGalleryImageId] = useState<
    number | null
  >(null);

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

  useEffect(() => {
    if (width > 1536) {
      setCols(6);
    } else if (width > 1280) {
      setCols(4);
    } else if (width > 768) {
      setCols(3);
    } else {
      setCols(2);
    }
  }, [width]);

  const handleImageReorder = (
    sourceId: string,
    sourceIndex: number,
    targetIndex: number,
    targetId?: string
  ) => {
    if (sourceIndex == targetIndex) return;
    setImages((prevState) => swap(prevState, sourceIndex, targetIndex));

    reArrangeImage(images[sourceIndex].orderId, images[targetIndex].orderId);
  };

  const onDrop = () => {
    const newImageOrder = images.map((image) => image.id);

    // TODO: Update the image order on the server
  };

  return (
    <div className="relative w-full h-[1700px] flex flex-col justify-start items-center">
      <div className="w-full h-[1600px]">
        <div className="w-full h-16 p-2">
          <div className="w-full h-12 flex flex-row justify-center items-center outline-dashed outline-2 hover:outline-blueSecondary hover:text-blueSecondary transition-all duration-300 cursor-pointer rounded-md">
            <PlusCircleDotted
              width={32}
              height={32}
              onClick={() => {
                setImage(null);
                setIsAddModalVisible(true);
              }}
            />
          </div>
        </div>

        <GridContextProvider onChange={handleImageReorder}>
          <GridDropZone
            id="gallery"
            boxesPerRow={cols}
            rowHeight={200}
            style={{ height: "100%" }}
            onDrop={onDrop}
          >
            {images.map((image, index) => (
              <GridItem key={image.id}>
                <GalleryItem
                  index={index}
                  image={image}
                  onDelete={() => {
                    setIsDeleteConfirmationModalVisible(true);
                    setDeleteGalleryImageId(image.id);
                  }}
                  onEdit={() => {
                    setImage(image);
                    setIsAddModalVisible(true);
                  }}
                />
              </GridItem>
            ))}
          </GridDropZone>
        </GridContextProvider>
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
      )}
      {isDeleteConfirmationModalVisible && (
        <DeleteConfirmationModal
          visible={isDeleteConfirmationModalVisible}
          setDelete={() => {
            deleteImage(deleteGalleryImageId).then((value) => {
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
          setVisible={setIsDeleteConfirmationModalVisible}
        />
      )}
    </div>
  );
};

export default GalleryView;
