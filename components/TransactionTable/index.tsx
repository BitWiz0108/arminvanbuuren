import React from "react";
import Image from "next/image";
import moment from "moment";

import PaginationButtons from "@/components/PaginationButtons";
import Paypal from "@/components/Icons/Paypal";
import Stripe from "@/components/Icons/Stripe";

import { getTransactionAsset } from "@/libs/utils";
import {
  DATETIME_FORMAT,
  DEFAULT_AVATAR_IMAGE,
  IMAGE_SM_BLUR_DATA_URL,
  PROVIDER,
} from "@/libs/constants";

import { ITransaction } from "@/interfaces/ITransaction";

type Props = {
  transactions: Array<ITransaction>;
  totalCount: number;
  page: number;
  setPage: Function;
};

const TransactionTable = ({
  transactions,
  totalCount,
  page,
  setPage,
}: Props) => {
  return (
    <div className="w-full">
      <div className="w-full mt-2 py-3 px-5 flex flex-row justify-start items-center">
        <label className="w-full lg:w-[10%] min-w-[100px] text-center">
          Customer
        </label>
        <label className="w-full lg:w-[15%]">Type</label>
        <label className="w-[15%] min-w-[80px] hidden lg:flex">Provider</label>
        <label className="w-full lg:w-[15%]">Amount</label>
        <label className="w-[25%] hidden lg:flex">Asset</label>
        <label className="w-full lg:w-[20%] hidden lg:flex">Date</label>
      </div>
      {transactions.map((value, index) => {
        return (
          <div
            key={index}
            className="w-full mt-2 py-3 rounded-md px-5 border border-gray-700 flex flex-row justify-start items-center"
          >
            <div className="w-full lg:w-[10%] min-w-[100px] flex flex-col justify-center items-center space-y-2 truncate">
              <Image
                className="w-8 h-8 rounded-full overflow-hidden object-cover"
                src={value.buyer.avatarImage ?? DEFAULT_AVATAR_IMAGE}
                width={200}
                height={200}
                alt=""
                placeholder="blur"
                blurDataURL={IMAGE_SM_BLUR_DATA_URL}
              />
              <span className="w-full text-center text-xs text-secondary truncate">
                {value.buyer.username}
              </span>
            </div>
            <div className="w-full lg:w-[15%] truncate">{value.type}</div>
            <div className="w-[15%] min-w-[80px] hidden lg:flex justify-start items-center">
              {value.provider == PROVIDER.PAYPAL ? <Paypal /> : <Stripe />}
            </div>
            <div className="w-full lg:w-[15%] truncate">
              {value.currency.symbol}
              {value.amount}
            </div>
            <div className="w-[25%] hidden lg:flex truncate">
              {getTransactionAsset(value)}
            </div>
            <div className="w-full lg:w-[20%] truncate hidden lg:flex">
              {moment(value.createdAt).format(DATETIME_FORMAT)}
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

export default TransactionTable;
