import Image from "next/image";
import moment from "moment";

import PaginationButtons from "@/components/PaginationButtons/index";
import Edit from "@/components/Icons/Edit";
import Delete from "@/components/Icons/Delete";

import {
  DATETIME_FORMAT,
  DEFAULT_BANNER_IMAGE,
  IMAGE_MD_BLUR_DATA_URL,
} from "@/libs/constants";

import { IPost } from "@/interfaces/IPost";

type Props = {
  posts: Array<IPost>;
  updatePost: Function;
  deletePost: Function;
  totalCount: number;
  page: number;
  setPage: Function;
};

const PostTable = ({
  posts,
  updatePost,
  deletePost,
  totalCount,
  page,
  setPage,
}: Props) => {
  return (
    <div className="w-full">
      <div className="w-full mt-2 py-3 px-5 flex flex-row justify-start items-center">
        <div className="w-[20%] min-w-[100px]">Image</div>
        <div className="w-[75%] lg:w-[50%]">Title</div>
        <div className="w-[25%] hidden md:flex">Created At</div>
        <div className="w-[5%] min-w-[60px]">Action</div>
      </div>
      {posts.map((value, index) => {
        return (
          <div
            key={index}
            className="w-full mt-2 py-3 rounded-md px-5 border border-gray-700 flex flex-row justify-start items-center gap-1"
          >
            <div className="w-[20%] min-w-[100px]">
              <Image
                className="w-24 h-12 object-cover rounded-md overflow-hidden"
                src={value.image ?? DEFAULT_BANNER_IMAGE}
                width={1600}
                height={900}
                alt=""
                placeholder="blur"
                blurDataURL={IMAGE_MD_BLUR_DATA_URL}
              />
            </div>
            <div className="w-[75%] lg:w-[50%] truncate">{value.title}</div>
            <div className="w-[25%] hidden md:flex truncate">
              {moment(value.createdAt).format(DATETIME_FORMAT)}
            </div>
            <div className="w-[5%] min-w-[60px] flex justify-center items-center space-x-5">
              <Edit
                width={24}
                height={24}
                className="text-primary hover:text-blueSecondary cursor-pointer transition-all duration-300"
                onClick={() => updatePost(value.id)}
              />
              <Delete
                width={24}
                height={24}
                className="text-primary hover:text-red-500 cursor-pointer transition-all duration-300"
                onClick={() => deletePost(value.id)}
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

export default PostTable;
