import { DEFAULT_COVER_IMAGE } from "@/libs/constants";

import { IAlbum } from "@/interfaces/IAlbum";

export interface IMusic {
  id: number | null;
  singer: any;
  coverImage: string;
  filename: string;
  musicFile: string;
  musicFileCompressed: string;
  isExclusive: boolean;
  albumId: number | null;
  album: IAlbum;
  duration: number;
  title: string;
  musicGenreId: number | null;
  languageId: number | null;
  language: string;
  copyright: string;
  lyrics: string;
  description: string;
  releaseDate: string;
  createdAt: string;
  favorites: any;
}

export const DEFAULT_MUSIC = {
  id: null,
  singer: null,
  coverImage: DEFAULT_COVER_IMAGE,
  filename: "",
  musicFile: "",
  musicFileCompressed: "",
  isExclusive: false,
  albumId: null,
  duration: 0,
  title: "",
  musicGenreId: null,
  languageId: null,
  copyright: "",
  lyrics: "",
  description: "",
  releaseDate: "",
  createdAt: "",
} as IMusic;

export interface IMusicQueryParam {
  page: number;
  limit: number;
  title: "ASC" | "DESC" | "";
  albumName: "ASC" | "DESC" | "";
  releaseDate: "ASC" | "DESC" | "";
  artistName: "ASC" | "DESC" | "";
}

export const DEFAULT_MUSICQUERYPARAM = {
  page: 1,
  limit: 10,
  title: "",
  albumName: "",
  releaseDate: "",
  artistName: "",
} as IMusicQueryParam;
