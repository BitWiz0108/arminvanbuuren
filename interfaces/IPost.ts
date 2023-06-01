import { FILE_TYPE } from "@/libs/constants";

import { IReply } from "@/interfaces/IReply";

export interface IContentBody {
  id?: number | null;
  type: FILE_TYPE | null;
  file: File | string | null;
  fileCompressed: File | string | null;
}

export interface IPost {
  id: number | null;
  author: any;
  title: string;
  files: Array<IContentBody>;
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
  files: [],
  content: "",
  createdAt: "",
  isFavorite: false,
  numberOfFavorites: 0,
  replies: [],
} as IPost;
