import React, { useState } from "react";
import moment from "moment";

import Delete from "@/components/Icons/Delete";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

import { IPlayList } from "@/interfaces/IPlayList";

import { DATETIME_FORMAT } from "@/libs/constants";

type Props = {
  playLists: Array<IPlayList>;
  deletePlayList: Function;
  updatePlayList: Function;
};

const PlayListTable = ({
  playLists,
  deletePlayList,
  updatePlayList,
}: Props) => {
  const [
    isDeleteConfirmationModalVisible,
    setIsDeleteConfirmationModalVisible,
  ] = useState<boolean>(false);

  const [deletePlayListId, setDeletePlayListId] = useState<Number | null>();

  return (
    <div className="w-full">
      <div className="w-full mt-2 py-3 px-5 flex flex-row justify-start items-center gap-1">
        <label className="w-[50%]">Playlist Name</label>
        <label className="w-[20%]">Total Music</label>
        <label className="w-[15%]">Created At</label>
        <label className="w-[5%] min-w-[20px]">Action</label>
      </div>
      {playLists.map((value, index) => {
        return (
          <div
            key={index}
            className="w-full mt-2 py-3 rounded-md px-5 border border-gray-700 flex flex-row justify-start items-center cursor-pointer"
          >
            <div
              className="w-[50%] truncate"
              onClick={() => updatePlayList(value.id)}
            >
              {value.name}
            </div>
            <div className="w-[20%] truncate">{value.musics?.length} Songs</div>
            <div className="w-[15%] truncate">
              {moment(value.createdAt).format(DATETIME_FORMAT)}
            </div>
            <div className="w-[5%] min-w-[20px] flex justify-center items-center space-x-5">
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
