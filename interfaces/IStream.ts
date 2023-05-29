import { DEFAULT_COVER_IMAGE } from "@/libs/constants";
import { ICategory } from "./ICategory";

export interface IStream {
  id: number | null;
  coverImage: string;
  title: string;
  singer: any;
  creator: any;
  releaseDate: string;
  previewVideo: string;
  previewVideoCompressed: string;
  fullVideo: string;
  fullVideoCompressed: string;
  description: string;
  duration: number;
  shortDescription: string;
  lyrics: string;
  isExclusive: boolean;
  categoryIds: Array<number> | null;
  categories: Array<ICategory>;
  favorites: any;
}

export const DEFAULT_ISTREAM = {
  id: null,
  coverImage: DEFAULT_COVER_IMAGE,
  title: "",
  singer: null,
  creator: null,
  releaseDate: "",
  previewVideo: "",
  previewVideoCompressed: "",
  fullVideo: "",
  fullVideoCompressed: "",
  description: "",
  duration: 0,
  shortDescription: "",
  lyrics: "",
  isExclusive: false,
  categoryIds: null,
} as IStream;

export interface IStreamQueryParam {
  page: number;
  limit: number;
  title: "ASC" | "DESC" | "";
  categoryName: "ASC" | "DESC" | "";
  releaseDate: "ASC" | "DESC" | "";
  artistName: "ASC" | "DESC" | "";
}

export const DEFAULT_STREAMQUERYPARAM = {
  page: 1,
  limit: 10,
  title: "",
  categoryName: "",
  releaseDate: "",
  artistName: "",
} as IStreamQueryParam;
