import moment from "moment";

import { TRANSACTION_TYPE } from "@/libs/constants";

import { ITransaction } from "@/interfaces/ITransaction";
import { IUser } from "@/interfaces/IUser";

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const getTransactionAsset = (transaction: ITransaction) => {
  if (transaction.type == TRANSACTION_TYPE.DONATION) {
    if (transaction.musicId && transaction.music) {
      return `Music: ${transaction.music.title}`;
    }
    if (transaction.livestreamId && transaction.livestream) {
      return `Livestream: ${transaction.livestream.title}`;
    }
  } else if (transaction.type == TRANSACTION_TYPE.SUBSCRIPTION) {
    if (transaction.planId && transaction.plan) {
      return `Plan: ${transaction.plan.name}`;
    }
  }
  return transaction.orderId;
};

export const checkContainsSpecialCharacters = (value: string) => {
  var regex = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
  return regex.test(value);
};

export const bigNumberFormat = (num: number, digits: number = 0) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
};

export const isMembership = (user: IUser) => {
  if (user.planId && user.planStartDate && user.planEndDate) {
    if (
      moment().isAfter(moment(user.planStartDate)) &&
      moment().isBefore(moment(user.planEndDate))
    ) {
      return true;
    }
  }
  return false;
};
