import React, { useState } from "react";
import Image from "next/image";
import moment from "moment";

import PaginationButtons from "@/components/PaginationButtons";
import Edit from "@/components/Icons/Edit";
import Delete from "@/components/Icons/Delete";
import Comment from "@/components/Icons/Comment";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

import {
  DATETIME_FORMAT,
  DEFAULT_COVER_IMAGE,
  IMAGE_MD_BLUR_DATA_URL,
} from "@/libs/constants";

import { IStream, IStreamQueryParam } from "@/interfaces/IStream";

type Props = {
  livestreams: Array<IStream>;
  updateLivestream: Function;
  commentLivestream: Function;
  deleteLivestream: Function;
  totalCount: number;
  queryParam: IStreamQueryParam;
  changeQueryParam: (key: string, value: string | number) => void;
};

const LivestreamTable = ({
  livestreams,
  updateLivestream,
  commentLivestream,
  deleteLivestream,
  totalCount,
  queryParam,
  changeQueryParam,
}: Props) => {
  const clearQueryParam = (key: string) => {
    changeQueryParam(key, "");
  };

  const [
    isDeleteConfirmationModalVisible,
    setIsDeleteConfirmationModalVisible,
  ] = useState<boolean>(false);

  const [deleteLivestreamId, setDeleteLivestreamId] = useState<Number | null>();

  const toggleQueryParam = (key: string, value: string) => {
    switch (value) {
      case "":
        changeQueryParam(key, "ASC");
        break;
      case "ASC":
        changeQueryParam(key, "DESC");
        break;
      case "DESC":
        changeQueryParam(key, "ASC");
        break;
      default:
        changeQueryParam(key, "ASC");
    }
  };

  const arrowCode = (key: string, value: string) => {
    switch (value) {
      case "":
        return <></>;
      case "ASC":
        return (
          <>
            &uarr;&nbsp;
            <span
              className="cursor-pointer"
              onClick={() => clearQueryParam(key)}
            >
              &times;
            </span>
          </>
        );
      case "DESC":
        return (
          <>
            &darr;&nbsp;
            <span
              className="cursor-pointer"
              onClick={() => clearQueryParam(key)}
            >
              &times;
            </span>
          </>
        );
      default:
        return <></>;
    }
  };

  return (
    <div className="w-full">
      <div className="w-full mt-2 py-3 px-5 flex flex-row justify-start items-center">
        <label className="w-[15%] min-w-[100px]"> Image</label>
        <label className="w-[50%] lg:w-[30%] hover:cursor-pointer">
          <span onClick={() => toggleQueryParam("title", queryParam.title)}>
            Title&nbsp;
          </span>
          {arrowCode("title", queryParam.title)}
        </label>
        <label className="w-[25%] hidden lg:flex hover:cursor-pointer">
          <span
            onClick={() =>
              toggleQueryParam("categoryName", queryParam.categoryName)
            }
          >
            Category&nbsp;
          </span>
          {arrowCode("categoryName", queryParam.categoryName)}
        </label>
        <label className="w-[20%] hidden lg:flex hover:cursor-pointer">
          <span
            onClick={() =>
              toggleQueryParam("releaseDate", queryParam.releaseDate)
            }
          >
            Release Date&nbsp;
          </span>
          {arrowCode("releaseDate", queryParam.releaseDate)}
        </label>
        <label className="w-[10%] min-w-[100px] text-center"> Action</label>
      </div>
      {livestreams.map((value, index) => {
        return (
          <div
            key={index}
            className="w-full mt-2 py-3 rounded-md px-5 border border-gray-700 flex flex-row justify-start items-center gap-1"
          >
            <div className="w-[15%] min-w-[100px]">
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
            <div className="w-[25%] hidden lg:flex truncate">
              {value.categories.map((data, index) => {
                var categoryShow = "";
                categoryShow += data.name;
                if (index < value.categories.length - 1) {
                  categoryShow += ", ";
                }
                return categoryShow;
              })}
              {/* {value.category?.name} */}
            </div>
            <div className="w-[20%] hidden lg:flex truncate">
              {moment(value.releaseDate).format(DATETIME_FORMAT)}
            </div>
            <div className="w-[10%] min-w-[100px] flex justify-center items-center space-x-5">
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
                onClick={() => {
                  setIsDeleteConfirmationModalVisible(true);
                  setDeleteLivestreamId(value.id);
                }}
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
              if (queryParam.page > 1) {
                changeQueryParam("page", queryParam.page - 1);
              }
            }}
          />
          <label className="px-2 py-0.5 mt-5 ">
            {totalCount > 0 ? queryParam.page : 0}
          </label>
          <label className="px-2 py-0.5 mt-5 ">/</label>
          <label className="px-2 py-0.5 mt-5 ">{totalCount}</label>
          <PaginationButtons
            label="Next"
            bgColor="cyan"
            onClick={() => {
              if (queryParam.page < totalCount) {
                changeQueryParam("page", queryParam.page + 1);
              }
            }}
          />
        </div>
      </div>
      {isDeleteConfirmationModalVisible && (
        <DeleteConfirmationModal
          visible={isDeleteConfirmationModalVisible}
          setDelete={() => {
            deleteLivestream(deleteLivestreamId);
          }}
          setVisible={setIsDeleteConfirmationModalVisible}
        />
      )}
    </div>
  );
};
export default LivestreamTable;
