import { DEFAULT_COVER_IMAGE, FILE_TYPE } from "@/libs/constants";

import { IReply } from "@/interfaces/IReply";

export interface IPost {
  id: number | null;
  author: any;
  title: string;
  type: FILE_TYPE;
  image: string;
  imageCompressed: string;
  video: string;
  videoCompressed: string;
  content: string;
  createdAt: string;
  isFavorite: boolean;
  numberOfFavorites: number;
  replies: Array<IReply>;
}

export const DEFAULT_POST = {
  id: null,
  author: null,
  title: "",
  type: FILE_TYPE.IMAGE,
  image: DEFAULT_COVER_IMAGE,
  imageCompressed: DEFAULT_COVER_IMAGE,
  video: "",
  videoCompressed: "",
  content: "",
  createdAt: "",
  isFavorite: false,
  numberOfFavorites: 0,
  replies: [],
} as IPost;
