import { DEFAULT_COVER_IMAGE } from "@/libs/constants";

export interface IAlbum {
  id: number | null;
  image: string;
  name: string;
  creator: any;
  releaseDate: string;
  createdAt: string;
  description: string;
  videoBackground: string;
  videoBackgroundCompressed: string;
}

export const DEFAULT_IALBUM = {
  id: null,
  image: DEFAULT_COVER_IMAGE,
  name: "",
  creator: null,
  releaseDate: "",
  description: "",
  videoBackground: "",
  videoBackgroundCompressed: "",
} as IAlbum;
