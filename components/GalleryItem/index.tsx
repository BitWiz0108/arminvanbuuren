import { useState } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "framer-motion";

import { useSizeValues } from "@/contexts/contextSize";

import { IMAGE_MD_BLUR_DATA_URL } from "@/libs/constants";
import Delete from "../Icons/Delete";
import Edit from "../Icons/Edit";

type Props = {
  index: number;
  image: { image: string; compressedImage: string };
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
      className="relative w-full h-[280px] max-h-[280px] overflow-hidden rounded-md"
      onMouseEnter={() => onHover()}
      onMouseLeave={() => onOut()}
    >
      <Image
        className={twMerge(
          "w-full h-[280px] max-h-[280px] object-cover transition-all duration-300",
          hovered ? "scale-110" : "scale-100"
        )}
        src={image.compressedImage}
        width={500}
        height={500}
        alt=""
        placeholder="blur"
        blurDataURL={IMAGE_MD_BLUR_DATA_URL}
      />

      <AnimatePresence>
        {(hovered || isMobile) && (
          <motion.div
            className="absolute left-0 top-0 w-full h-full bg-transparent md:bg-[#000000aa] flex justify-end items-start p-2 text-primary space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Edit width={24} height={24} onClick={() => onEdit(index)} />
            <Delete width={24} height={24} onClick={() => onDelete(index)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryItem;
