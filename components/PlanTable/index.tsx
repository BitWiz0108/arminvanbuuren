import React from "react";
import Image from "next/image";

import Delete from "@/components/Icons/Delete";
import Edit from "@/components/Icons/Edit";

import { DEFAULT_COVER_IMAGE, IMAGE_MD_BLUR_DATA_URL } from "@/libs/constants";

import { IPlan } from "@/interfaces/IPlan";

type Props = {
  plans: Array<IPlan>;
  deletePlan: Function;
  updatePlan: Function;
};

const PlanTable = ({ plans, deletePlan, updatePlan }: Props) => {
  return (
    <div className="w-full">
      <div className="w-full mt-2 py-3 px-5 flex flex-row justify-start items-center">
        <label className="w-[10%] min-w-[80px]">Image</label>
        <label className="w-full">Name</label>
        <label className="w-full">Price</label>
        <label className="w-full">Duration</label>
        <label className="w-full hidden lg:flex">Currency</label>
        <label className="w-[5%] min-w-[60px]">Action</label>
      </div>
      {plans.map((value, index) => {
        return (
          <div
            key={index}
            className="w-full mt-2 py-3 rounded-md px-5 border border-gray-700 flex flex-row justify-start items-center gap-1"
          >
            <div className="w-[10%] min-w-[80px]">
              <Image
                className="w-15 object-cover rounded-full"
                src={value.coverImage ?? DEFAULT_COVER_IMAGE}
                width={64}
                height={64}
                alt=""
                placeholder="blur"
                blurDataURL={IMAGE_MD_BLUR_DATA_URL}
              />
            </div>
            <div className="w-full truncate">{value.name}</div>
            <div className="w-full truncate">{value.price}</div>
            <div className="w-full truncate">{value.duration}</div>
            <div className="w-full truncate hidden lg:flex">
              {value.currency.code}
            </div>
            <div className="w-[5%] min-w-[60px] flex justify-center items-center space-x-5">
              <Edit
                width={24}
                height={24}
                className="text-primary hover:text-blueSecondary cursor-pointer transition-all duration-300"
                onClick={() => updatePlan(value.id)}
              />
              <Delete
                width={24}
                height={24}
                className="text-primary hover:text-red-500 cursor-pointer transition-all duration-300"
                onClick={() => deletePlan(value.id)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default PlanTable;
