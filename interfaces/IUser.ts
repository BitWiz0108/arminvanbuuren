import { DEFAULT_AVATAR_IMAGE, GENDER } from "@/libs/constants";

import { DEFAULT_COUNTRY, ICountry } from "@/interfaces/ICountry";
import { DEFAULT_STATE, IState } from "@/interfaces/IState";
import { DEFAULT_CITY, ICity } from "@/interfaces/ICity";

export interface IUser {
  id: number | null;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: {
    id: number | null;
    name: string;
  };
  avatarImage: string;
  gender: GENDER;
  planId: number | null;
  planStartDate: string | null;
  planEndDate: string | null;
  status: boolean | null;
  dob: string;
  address: string;
  country: ICountry;
  state: IState;
  city: ICity;
  zipcode: string;
  createdAt: string;
}

export const DEFAULT_USER = {
  id: null,
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  role: {
    id: null,
    name: "",
  },
  avatarImage: DEFAULT_AVATAR_IMAGE,
  gender: GENDER.MALE,
  planId: null,
  planStartDate: "",
  planEndDate: "",
  status: false,
  dob: "1960-01-01",
  address: "",
  country: DEFAULT_COUNTRY,
  state: DEFAULT_STATE,
  city: DEFAULT_CITY,
  zipcode: "",
  createdAt: "",
} as IUser;
