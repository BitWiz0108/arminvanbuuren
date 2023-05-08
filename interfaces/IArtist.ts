import { DEFAULT_AVATAR_IMAGE, DEFAULT_BANNER_IMAGE } from "@/libs/constants";

export interface IArtist {
  id: number | null;
  username: string;
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  artistName: string;
  website: string;
  description: string;
  address: string;
  mobile: string;
  bannerImage: string;
  avatarImage: string;
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
  soundcloud: string;
  logoImage: string;
}

export const DEFAULT_ARTIST = {
  id: null,
  username: "",
  firstName: "",
  lastName: "",
  dob: "",
  email: "",
  artistName: "",
  website: "",
  description: "",
  address: "",
  mobile: "",
  bannerImage: DEFAULT_BANNER_IMAGE,
  avatarImage: DEFAULT_AVATAR_IMAGE,
  facebook: "",
  twitter: "",
  instagram: "",
  youtube: "",
  soundcloud: "",
  logoImage: "",
} as IArtist;
