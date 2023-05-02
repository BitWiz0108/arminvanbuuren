import { useState } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "framer-motion";

import { useSizeValues } from "@/contexts/contextSize";

import { IMAGE_MD_BLUR_DATA_URL } from "@/libs/constants";
import Delete from "../Icons/Delete";

type Props = {
  index: number;
  image: { image: string; compressedImage: string };
  onClick: Function;
};

const GalleryItem = ({ index, image, onClick }: Props) => {
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
      className="relative w-full h-full overflow-hidden cursor-pointer rounded-md"
      onMouseEnter={() => onHover()}
      onMouseLeave={() => onOut()}
    >
      <Image
        className={twMerge(
          "w-full h-full object-cover transition-all duration-300",
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
            className="absolute left-0 top-0 w-full h-full bg-transparent md:bg-[#000000aa] flex justify-end items-start p-2 text-red-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Delete width={30} height={30} onClick={() => onClick(index)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryItem;
