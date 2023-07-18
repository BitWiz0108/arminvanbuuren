import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useEffect } from "react";

import X from "@/components/Icons/X";
import ButtonSettings from "@/components/ButtonSettings";
import MultiSelect from "@/components/MultiSelect";

import useArtist from "@/hooks/useArtist";
import { IPlayList } from "@/interfaces/IPlayList";

type Props = {
  visible: boolean;
  playLists: Array<IPlayList>;
  setVisible: Function;
  setAddToPlayList: Function;
};

const PlayListAddModal = ({
  visible,
  playLists,
  setVisible,
  setAddToPlayList,
}: Props) => {
  const { isLoading } = useArtist();
  const [playListIds, setPlayListIds] = useState<Array<number> | null>(null);

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
          <div className="relative w-full md:w-[540px] max-h-full h-fit px-5 md:px-10 pt-20 pb-5 md:pb-10 bg-background rounded-lg overflow-x-hidden overflow-y-auto pr-5">
            <h1 className="absolute w-full top-12 left-1/2 -translate-x-1/2 text-xl text-center text-primary font-thin">
              Add to playlist
            </h1>
            <div className="absolute top-5 right-5 text-primary cursor-pointer">
              <X width={24} height={24} onClick={() => setVisible(false)} />
            </div>
            <div className="relative w-full top-5 h-fit flex-grow flex flex-col justify-start items-center">
              <div className="w-full flex flex-row justify-center items-center space-x-2">
                <div className="w-full flex flex-col justify-start items-start space-y-5 pb-5">
                  <div className="w-full flex flex-col lg:flex-row justify-start items-center">
                    <MultiSelect
                      defaultValue={playLists.map((playList) => {
                        return {
                          label: "Select PlayList",
                          value: "",
                        };
                      })}
                      defaultLabel="Select PlayList"
                      value={playListIds?.map((playListId) => {
                        const playList = Object.values(playLists).filter(
                          (playList) => playList.id === playListId
                        )[0];
                        return {
                          label: playList.name,
                          value: playListId.toString(),
                        };
                      })}
                      setValue={(value: Array<number>) => setPlayListIds(value)}
                      label="Select PlayList"
                      options={playLists.map((playList) => {
                        return {
                          label: playList.name,
                          value: playList.id ? playList.id.toString() : "",
                        };
                      })}
                    />
                  </div>
                  <div className="w-full flex flex-row justify-center items-center space-x-10">
                    <ButtonSettings
                      label="Cancel"
                      onClick={() => setVisible(false)}
                    />
                    <ButtonSettings
                      label="Add"
                      bgColor={"1"}
                      onClick={() => {
                        setAddToPlayList(playListIds);
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

export default PlayListAddModal;
