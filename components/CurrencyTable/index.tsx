import React from "react";

import Delete from "@/components/Icons/Delete";
import Edit from "@/components/Icons/Edit";

import { ICurrency } from "@/interfaces/ICurrency";

type Props = {
  currencies: Array<ICurrency>;
  deleteCurrency: Function;
  updateCurrency: Function;
};

const CurrencyTable = ({
  currencies,
  deleteCurrency,
  updateCurrency,
}: Props) => {
  return (
    <div className="w-full">
      <div className="w-full mt-2 py-3 px-5 flex flex-row justify-start items-center">
        <label className="w-full">Name</label>
        <label className="w-full">Code</label>
        <label className="w-full">Symbol</label>
        <label className="w-[5%] min-w-[60px]">Action</label>
      </div>
      {currencies.map((value, index) => {
        return (
          <div
            key={index}
            className="w-full mt-2 py-3 rounded-md px-5 border border-gray-700 flex flex-row justify-start items-center gap-1"
          >
            <div className="w-full truncate">{value.name}</div>
            <div className="w-full truncate">{value.code}</div>
            <div className="w-full truncate">{value.symbol}</div>
            <div className="w-[5%] min-w-[60px] flex justify-center items-center space-x-5">
              <Edit
                width={24}
                height={24}
                className="text-primary hover:text-blueSecondary cursor-pointer transition-all duration-300"
                onClick={() => updateCurrency(value.id)}
              />
              <Delete
                width={24}
                height={24}
                className="text-primary hover:text-red-500 cursor-pointer transition-all duration-300"
                onClick={() => deleteCurrency(value.id)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default CurrencyTable;
