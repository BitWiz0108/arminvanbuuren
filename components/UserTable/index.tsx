import React from "react";
import Image from "next/image";
import moment from "moment";
import { twMerge } from "tailwind-merge";

import PaginationButtons from "@/components/PaginationButtons";
import Edit from "@/components/Icons/Edit";
import Delete from "@/components/Icons/Delete";

import {
  DATETIME_FORMAT,
  DEFAULT_AVATAR_IMAGE,
  IMAGE_SM_BLUR_DATA_URL,
} from "@/libs/constants";

import { IUser } from "@/interfaces/IUser";
import { isMembership } from "@/libs/utils";

type Props = {
  users: Array<IUser>;
  updateUser: Function;
  deleteUser: Function;
  totalCount: number;
  page: number;
  setPage: Function;
};

const UserTable = ({
  users,
  updateUser,
  deleteUser,
  totalCount,
  page,
  setPage,
}: Props) => {
  return (
    <div className="w-full">
      <div className="w-full mt-2 py-3 px-5 flex flex-row justify-start items-center">
        <label className="w-full lg:w-[10%] min-w-[100px] text-center">
          User
        </label>
        <label className="w-full lg:w-[10%]">Status</label>
        <label className="w-[20%] min-w-[80px] hidden lg:flex">Full Name</label>
        <label className="w-full lg:w-[20%] hidden lg:flex">Email</label>
        <label className="w-[10%] hidden lg:flex">Subscription</label>
        <label className="w-full lg:w-[25%] hidden lg:flex">Created At</label>
        <div className="w-[5%] min-w-[60px] text-center">Action</div>
      </div>
      {users.map((value, index) => {
        return (
          <div
            key={index}
            className="w-full mt-2 py-3 rounded-md px-5 border border-gray-700 flex flex-row justify-start items-center gap-1"
          >
            <div className="w-full lg:w-[10%] min-w-[100px] flex flex-col justify-center items-center space-y-2 truncate">
              <Image
                className="w-8 h-8 rounded-full overflow-hidden object-cover"
                src={value.avatarImage ?? DEFAULT_AVATAR_IMAGE}
                width={200}
                height={200}
                alt=""
                placeholder="blur"
                blurDataURL={IMAGE_SM_BLUR_DATA_URL}
              />
              <span className="w-full text-center text-xs text-secondary truncate">
                {value.username}
              </span>
            </div>
            <div className="w-full lg:w-[10%] truncate">
              <span
                className={twMerge(
                  "px-2 py-1 rounded-md inline-block",
                  value.status ? "bg-blueSecondary" : "bg-secondary"
                )}
              >
                {value.status ? "Active" : "Deactive"}
              </span>
            </div>
            <div className="w-[20%] min-w-[80px] hidden lg:flex justify-start items-center">
              {value.firstName} {value.lastName}
            </div>
            <div className="w-full lg:w-[20%] hidden lg:flex truncate">
              {value.email}
            </div>
            <div className="w-[10%] hidden lg:flex text-center truncate">
              {isMembership(value) ? (
                <span className="text-blueSecondary font-medium">Member</span>
              ) : (
                "-"
              )}
            </div>
            <div className="w-full lg:w-[25%] truncate hidden lg:flex">
              {moment(value.createdAt).format(DATETIME_FORMAT)}
            </div>
            <div className="w-[5%] min-w-[60px] flex justify-center items-center space-x-5">
              <Edit
                width={24}
                height={24}
                className="text-primary hover:text-blueSecondary cursor-pointer transition-all duration-300"
                onClick={() => updateUser(value.id)}
              />
              <Delete
                width={24}
                height={24}
                className="text-primary hover:text-red-500 cursor-pointer transition-all duration-300"
                onClick={() => deleteUser(value.id)}
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
export default UserTable;
