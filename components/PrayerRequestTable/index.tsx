import moment from "moment";

import PaginationButtons from "@/components/PaginationButtons/index";
import Delete from "@/components/Icons/Delete";
import Switch from "@/components/Switch";

import { DATETIME_FORMAT } from "@/libs/constants";

import { IPrayerRequest } from "@/interfaces/IPrayerRequest";

type Props = {
  prayerRequests: Array<IPrayerRequest>;
  deletePost: Function;
  setApprove: Function;
  totalCount: number;
  page: number;
  setPage: Function;
};

const PrayerRequestTable = ({
  prayerRequests,
  deletePost,
  setApprove,
  totalCount,
  page,
  setPage,
}: Props) => {
  return (
    <div className="w-full">
      <div className="w-full mt-2 py-3 px-5 flex flex-row justify-start items-center">
        <div className="w-[25%]">Title</div>
        <div className="w-[25%]">Request As</div>
        <div className="w-[20%]">Requester</div>
        <div className="w-[20%] hidden md:flex">Created At</div>
        <div className="w-[5%] min-w-[100px]">Approve</div>
        <div className="w-[5%] min-w-[100px]">Delete</div>
      </div>
      {prayerRequests?.map((value, index) => {
        return (
          <div
            key={index}
            className="w-full mt-2 py-3 rounded-md px-5 border border-gray-700 flex flex-row justify-start items-center gap-1"
          >
            <div className="w-[25%] truncate text-white hover:text-blue-500 cursor-pointer">
              {value.title}
            </div>
            <div className="w-[25%] truncate text-white hover:text-blue-500 cursor-pointer">
              {value.isAnonymous
                ? "Anonymous"
                : value.author.firstName + " " + value.author.lastName}
            </div>
            <div className="w-[20%] truncate text-white hover:text-blue-500 cursor-pointer">
              {value.author.firstName + " " + value.author.lastName}
            </div>
            <div className="w-[20%] hidden md:flex truncate text-white hover:text-blue-500 cursor-pointer">
              {moment(value.createdAt).format(DATETIME_FORMAT)}
            </div>
            <div className="w-[5%] min-w-[100px] flex justify-start items-start">
              <div className="relative w-full flex justify-start items-start">
                <Switch
                  checked={value.isApproved ? value.isApproved : false}
                  setChecked={() => setApprove(value.id, value.isApproved)}
                  label=""
                  labelPos="right"
                />
              </div>
            </div>
            <div className="w-[5%] min-w-[100px] flex pl-3 justify-start items-start">
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

export default PrayerRequestTable;
