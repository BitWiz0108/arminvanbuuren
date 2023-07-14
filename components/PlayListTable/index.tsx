import React, { useState } from "react";

import Delete from "@/components/Icons/Delete";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

import { IPlayList } from "@/interfaces/IPlayList";

type Props = {
  playLists: Array<IPlayList>;
  deletePlayList: Function;
  updatePlayList: Function;
};

const PlayListTable = ({ playLists, deletePlayList }: Props) => {
  const [
    isDeleteConfirmationModalVisible,
    setIsDeleteConfirmationModalVisible,
  ] = useState<boolean>(false);

  const [deletePlayListId, setDeletePlayListId] = useState<Number | null>();

  return (
    <div className="w-full">
      <div className="w-full mt-2 py-3 px-5 flex flex-row justify-start items-center">
        <label className="w-[55%]">Playlist Name</label>
        <label className="w-[5%] min-w-[60px]">Action</label>
      </div>
      {playLists.map((value, index) => {
        return (
          <div
            key={index}
            className="w-full mt-2 py-3 rounded-md px-5 border border-gray-700 flex flex-row justify-start items-center gap-1"
          >
            <div className="w-[55%] truncate">{value.name}</div>
            <div className="w-[5%] min-w-[60px] flex justify-center items-center space-x-5">
              <Delete
                width={24}
                height={24}
                className="text-primary hover:text-red-500 cursor-pointer transition-all duration-300"
                onClick={() => {
                  setIsDeleteConfirmationModalVisible(true);
                  setDeletePlayListId(value.id);
                }}
              />
            </div>
          </div>
        );
      })}
      {isDeleteConfirmationModalVisible && (
        <DeleteConfirmationModal
          visible={isDeleteConfirmationModalVisible}
          setDelete={() => {
            deletePlayList(deletePlayListId);
          }}
          setVisible={setIsDeleteConfirmationModalVisible}
        />
      )}
    </div>
  );
};
export default PlayListTable;
