import { IMusic } from "@/interfaces/IMusic";

export interface IPlayList {
  id: number | null;
  musics: Array<IMusic>;
  name: string;
}

export const DEFAULT_PLAYLIST = {
  id: null,
  musics: [],
  name: "",
} as IPlayList;
