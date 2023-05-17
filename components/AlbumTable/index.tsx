import React from "react";
import Image from "next/image";
import moment from "moment";

import Delete from "@/components/Icons/Delete";
import Edit from "@/components/Icons/Edit";

import {
  DATETIME_FORMAT,
  DEFAULT_COVER_IMAGE,
  IMAGE_MD_BLUR_DATA_URL,
} from "@/libs/constants";

import { IAlbum } from "@/interfaces/IAlbum";

type Props = {
  albums: Array<IAlbum>;
  deleteAlbum: Function;
  updateAlbum: Function;
};

const AlbumTable = ({ albums, deleteAlbum, updateAlbum }: Props) => {
  return (
    <div className="w-full">
      <div className="w-full mt-2 py-3 px-5 flex flex-row justify-start items-center">
        <label className="w-[15%] min-w-[100px]">Image</label>
        <label className="w-[55%]">Album Name</label>
        <label className="w-[25%] hidden lg:flex">Created At</label>
        <label className="w-[5%] min-w-[60px]">Action</label>
      </div>
      {albums.map((value, index) => {
        return (
          <div
            key={index}
            className="w-full mt-2 py-3 rounded-md px-5 border border-gray-700 flex flex-row justify-start items-center gap-1"
          >
            <div className="w-[15%] min-w-[100px]">
              <Image
                className="w-16 h-16 object-cover rounded-full"
                src={value.image ?? DEFAULT_COVER_IMAGE}
                width={64}
                height={64}
                alt=""
                placeholder="blur"
                blurDataURL={IMAGE_MD_BLUR_DATA_URL}
              />
            </div>
            <div className="w-[55%] truncate">{value.name}</div>
            <div className="w-[25%] hidden lg:flex truncate">
              {moment(value.createdAt).format(DATETIME_FORMAT)}
            </div>
            <div className="w-[5%] min-w-[60px] flex justify-center items-center space-x-5">
              <Edit
                width={24}
                height={24}
                className="text-primary hover:text-blueSecondary cursor-pointer transition-all duration-300"
                onClick={() => updateAlbum(value.id)}
              />
              <Delete
                width={24}
                height={24}
                className="text-primary hover:text-red-500 cursor-pointer transition-all duration-300"
                onClick={() => deleteAlbum(value.id)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default AlbumTable;
