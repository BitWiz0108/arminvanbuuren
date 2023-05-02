import { DEFAULT_COVER_IMAGE } from "@/libs/constants";

export interface IStream {
  id: number | null;
  coverImage: string;
  title: string;
  singer: any;
  creator: any;
  releaseDate: string;
  previewVideo: string;
  fullVideo: string;
  description: string;
  duration: number;
  shortDescription: string;
  lyrics: string;
  isExclusive: boolean;
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
  fullVideo: "",
  description: "",
  duration: 0,
  shortDescription: "",
  lyrics: "",
  isExclusive: false,
} as IStream;
