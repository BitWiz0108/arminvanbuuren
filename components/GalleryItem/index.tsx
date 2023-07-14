import { useState } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "framer-motion";

import Delete from "@/components/Icons/Delete";
import Edit from "@/components/Icons/Edit";

import { useSizeValues } from "@/contexts/contextSize";

import {
  DEFAULT_BANNER_IMAGE,
  FILE_TYPE,
  IMAGE_MD_BLUR_DATA_URL,
} from "@/libs/constants";

import { IImage } from "@/interfaces/IGallery";

type Props = {
  index: number;
  image: IImage;
  onDelete: Function;
  onEdit: Function;
};

const GalleryItem = ({ index, image, onDelete, onEdit }: Props) => {
  const { isMobile } = useSizeValues();

  const [hovered, setHovered] = useState<boolean>(false);

  const onHover = () => {
    if (hovered) return;
    setHovered(true);
  };

  const onOut = () => {
    if (!hovered) return;
    setHovered(false);
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-md"
      onMouseEnter={() => onHover()}
      onMouseLeave={() => onOut()}
    >
      {image.type == FILE_TYPE.IMAGE ? (
        <Image
          className={twMerge(
            "w-full h-full object-cover transition-all duration-300",
            hovered ? "scale-110" : "scale-100"
          )}
          src={image.imageCompressed ?? DEFAULT_BANNER_IMAGE}
          width={500}
          height={500}
          alt=""
          placeholder="blur"
          blurDataURL={IMAGE_MD_BLUR_DATA_URL}
          priority
        />
      ) : (
        <video
          loop
          muted
          autoPlay
          playsInline
          className={twMerge(
            "w-full h-full object-cover transition-all duration-300",
            hovered ? "scale-110" : "scale-100"
          )}
          src={image.videoCompressed}
        />
      )}

      <AnimatePresence>
        {(hovered || isMobile) && (
          <motion.div
            className="absolute left-0 top-0 w-full h-full bg-transparent md:bg-[#000000aa] flex justify-end items-start p-2 text-primary space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Edit
              width={24}
              height={24}
              onClick={() => onEdit(index)}
              className="text-primary hover:text-blueSecondary cursor-pointer"
            />
            <Delete
              width={24}
              height={24}
              onClick={() => onDelete(index)}
              className="text-primary hover:text-red-500 cursor-pointer"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryItem;
