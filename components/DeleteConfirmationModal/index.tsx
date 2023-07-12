import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";

import X from "@/components/Icons/X";
import TextInput from "@/components/TextInput";
import ButtonSettings from "@/components/ButtonSettings";

import useArtist from "@/hooks/useArtist";

type Props = {
  visible: boolean;
  setVisible: Function;
  setDelete: Function;
};

const DeleteConfirmationModal = ({ visible, setVisible, setDelete }: Props) => {
  const { isLoading } = useArtist();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed left-0 top-0 w-screen h-screen px-5 pt-5 pb-36 bg-[#000000aa] flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-full md:w-[540px] max-h-full px-5 md:px-10 pt-20 pb-5 md:pb-10 bg-background rounded-lg overflow-x-hidden overflow-y-auto pr-5">
            <h1 className="absolute w-full top-12 left-1/2 -translate-x-1/2 text-xl text-center text-primary font-semibold">
              Are you sure you want to delete this?
            </h1>

            <div className="absolute top-5 right-5 text-primary cursor-pointer">
              <X width={24} height={24} onClick={() => setVisible(false)} />
            </div>

            <div className="relative w-full top-5 h-fit flex flex-col justify-start items-center">
              <div className="w-full flex flex-row justify-center items-center space-x-2">
                <div className="w-full flex flex-col justify-start items-start space-y-5">
                  <div className="w-full flex flex-row justify-center items-center space-x-10">
                    <ButtonSettings
                      label="No"
                      bgColor={"1"}
                      onClick={() => setVisible(false)}
                    />

                    <ButtonSettings
                      label="Yes"
                      bgColor={"1"}
                      onClick={() => {
                        setDelete();
                        setVisible(false);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isLoading && <div className="loading"></div>}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
