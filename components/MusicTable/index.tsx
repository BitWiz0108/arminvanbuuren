import Image from "next/image";
import moment from "moment";

import PaginationButtons from "@/components/PaginationButtons/index";
import Edit from "@/components/Icons/Edit";
import Delete from "@/components/Icons/Delete";

import {
  DATETIME_FORMAT,
  DEFAULT_COVER_IMAGE,
  IMAGE_MD_BLUR_DATA_URL,
} from "@/libs/constants";

import { IMusic, IMusicQueryParam } from "@/interfaces/IMusic";

type Props = {
  musics: Array<IMusic>;
  updateMusic: Function;
  deleteMusic: Function;
  totalCount: number;
  queryParam: IMusicQueryParam;
  changeQueryParam: (key: string, value: string | number) => void;
};

const MusicTable = ({
  musics,
  updateMusic,
  deleteMusic,
  totalCount,
  queryParam,
  changeQueryParam,
}: Props) => {
  const clearQueryParam = (key: string) => {
    changeQueryParam(key, "");
  };

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
        <div className="w-[15%] min-w-[100px]">Image</div>
        <div className="w-[50%] lg:w-[30%] hover:cursor-pointer">
          <span onClick={() => toggleQueryParam("title", queryParam.title)}>
            Title&nbsp;
          </span>
          {arrowCode("title", queryParam.title)}
        </div>
        <div className="w-[15%] hidden lg:flex hover:cursor-pointer">
          <span
            onClick={() => toggleQueryParam("albumName", queryParam.albumName)}
          >
            Album&nbsp;
          </span>
          {arrowCode("albumName", queryParam.albumName)}
        </div>
        <div className="w-[15%] hidden lg:flex hover:cursor-pointer">
          <span
            onClick={() =>
              toggleQueryParam("artistName", queryParam.artistName)
            }
          >
            Artist&nbsp;
          </span>
          {arrowCode("artistName", queryParam.artistName)}
        </div>
        <div className="w-[20%] hidden lg:flex hover:cursor-pointer">
          <span
            onClick={() =>
              toggleQueryParam("releaseDate", queryParam.releaseDate)
            }
          >
            Release Date&nbsp;
          </span>
          {arrowCode("releaseDate", queryParam.releaseDate)}
        </div>
        <div className="w-[5%] min-w-[60px] text-center">Action</div>
      </div>
      {musics.map((value, index) => {
        return (
          <div
            key={index}
            className="w-full mt-2 py-3 rounded-md px-5 border border-gray-700 flex flex-row justify-start items-center gap-1"
          >
            <div className="w-[15%] min-w-[100px]">
              <Image
                className="w-16 h-16 object-cover rounded-lg overflow-hidden"
                src={value.coverImage ?? DEFAULT_COVER_IMAGE}
                width={300}
                height={300}
                alt=""
                placeholder="blur"
                blurDataURL={IMAGE_MD_BLUR_DATA_URL}
              />
            </div>
            <div className="w-[50%] lg:w-[30%] truncate">{value.title}</div>
            <div className="w-[15%] hidden lg:flex truncate">
              {value.albums.map((data, index) => {
                var albumShow = "";
                albumShow += data.name;
                if (index < value.albums.length - 1) {
                  albumShow += ", ";
                }
                return albumShow;
              })}
            </div>
            <div className="w-[15%] hidden lg:flex truncate">
              {value.singer?.firstName} {value.singer?.lastName}
            </div>
            <div className="w-[20%] hidden lg:flex truncate">
              {moment(value.releaseDate).format(DATETIME_FORMAT)}
            </div>
            <div className="w-[5%] min-w-[60px] flex justify-center items-center space-x-5">
              <Edit
                width={24}
                height={24}
                className="text-primary hover:text-blueSecondary cursor-pointer transition-all duration-300"
                onClick={() => updateMusic(value.id)}
              />
              <Delete
                width={24}
                height={24}
                className="text-primary hover:text-red-500 cursor-pointer transition-all duration-300"
                onClick={() => deleteMusic(value.id)}
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
    </div>
  );
};

export default MusicTable;
