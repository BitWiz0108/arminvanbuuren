import { DEFAULT_COVER_IMAGE } from "@/libs/constants";

export interface ICategory {
  id: number | null;
  image: string;
  name: string;
  creator: any;
  createdAt: string;
  description: string;
}

export const DEFAULT_CATEGORY = {
  id: null,
  image: DEFAULT_COVER_IMAGE,
  name: "",
  creator: null,
  description: "",
} as ICategory;
