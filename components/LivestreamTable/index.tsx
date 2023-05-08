import React from "react";
import Image from "next/image";
import moment from "moment";

import PaginationButtons from "@/components/PaginationButtons";
import Edit from "@/components/Icons/Edit";
import Delete from "@/components/Icons/Delete";
import Comment from "@/components/Icons/Comment";

import {
  DATETIME_FORMAT,
  DEFAULT_COVER_IMAGE,
  IMAGE_MD_BLUR_DATA_URL,
} from "@/libs/constants";

import { IStream } from "@/interfaces/IStream";

type Props = {
  livestreams: Array<IStream>;
  updateLivestream: Function;
  commentLivestream: Function;
  deleteLivestream: Function;
  totalCount: number;
  page: number;
  setPage: Function;
};

const LivestreamTable = ({
  livestreams,
  updateLivestream,
  commentLivestream,
  deleteLivestream,
  totalCount,
  page,
  setPage,
}: Props) => {
  return (
    <div className="w-full">
      <div className="w-full mt-2 py-3 px-5 flex flex-row justify-start items-center">
        <label className="w-[20%] min-w-[100px]"> Image</label>
        <label className="w-[50%] lg:w-[30%]"> Title</label>
        <label className="w-[20%] hidden lg:flex"> Artist</label>
        <label className="w-[25%] hidden lg:flex"> Release Date</label>
        <label className="w-[5%] min-w-[100px]"> Action</label>
      </div>
      {livestreams.map((value, index) => {
        return (
          <div
            key={index}
            className="w-full mt-2 py-3 rounded-md px-5 border border-gray-700 flex flex-row justify-start items-center gap-1"
          >
            <div className="w-[20%] min-w-[100px]">
              <Image
                className="w-20 h-14 object-cover rounded-lg overflow-hidden"
                src={value.coverImage ?? DEFAULT_COVER_IMAGE}
                width={350}
                height={190}
                alt=""
                placeholder="blur"
                blurDataURL={IMAGE_MD_BLUR_DATA_URL}
              />
            </div>
            <div className="w-[50%] lg:w-[30%] truncate">{value.title}</div>
            <div className="w-[20%] hidden lg:flex truncate">
              {value.singer?.firstName} {value.singer?.lastName}
            </div>
            <div className="w-[25%] hidden lg:flex truncate">
              {moment(value.releaseDate).format(DATETIME_FORMAT)}
            </div>
            <div className="w-[5%] min-w-[100px] flex justify-center items-center space-x-5">
              <Comment
                width={24}
                height={24}
                className="text-primary hover:text-blueSecondary cursor-pointer transition-all duration-300"
                onClick={() => commentLivestream(value.id)}
              />
              <Edit
                width={24}
                height={24}
                className="text-primary hover:text-blueSecondary cursor-pointer transition-all duration-300"
                onClick={() => updateLivestream(value.id)}
              />
              <Delete
                width={24}
                height={24}
                className="text-primary hover:text-red-500 cursor-pointer transition-all duration-300"
                onClick={() => deleteLivestream(value.id)}
              />
            </div>
          </div>
        );
      })}
      <div className="flex w-full justify-center items-center">
        <div className="flex w-52 justify-center items-center">
          <PaginationButtons
            label="Prev"
            bgColor="cyan"
            onClick={() => {
              if (page > 1) {
                setPage(page - 1);
              }
            }}
          />
          <label className="px-2 py-0.5 mt-5 ">
            {totalCount > 0 ? page : 0}
          </label>
          <label className="px-2 py-0.5 mt-5 ">/</label>
          <label className="px-2 py-0.5 mt-5 ">{totalCount}</label>
          <PaginationButtons
            label="Next"
            bgColor="cyan"
            onClick={() => {
              if (page < totalCount) {
                setPage(page + 1);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default LivestreamTable;
