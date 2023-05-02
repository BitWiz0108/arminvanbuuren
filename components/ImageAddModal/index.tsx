import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import X from "@/components/Icons/X";
import ButtonUpload from "@/components/ButtonUpload";
import ButtonSettings from "@/components/ButtonSettings";
import { toast } from "react-toastify";

type Props = {
  isVisible: boolean;
  setVisible: Function;
  addImage: Function
}

const ImageAddModal = ({ isVisible, setVisible, addImage }: Props) => {
  const [imageFile, setImageFile] = useState<File | null>(null);

  return (
    <AnimatePresence>
      {isVisible && (<motion.div
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
              onClick={() => { setVisible(false) }}
            />
          </div>
          <div className="mt-5 flex flex-col justify-center items-center">
            <div className="w-full px-2">
              <ButtonUpload
                sname="Upload Image"
                label=""
                setValue={setImageFile}
                placeholder="Upload Image"
                accept_file="image/*"
              />
            </div>
            <div className="w-1/2">
              <ButtonSettings
                label="Add"
                bgColor="cyan"
                onClick={() => {
                  if (!imageFile) {
                    toast.warn("Please select new image.");
                    return;
                  }
                  addImage(imageFile);
                  setImageFile(null);
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
