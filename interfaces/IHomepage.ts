import { FILE_TYPE } from "@/libs/constants";

export interface IHomepage {
  type: FILE_TYPE;
  backgroundVideo: string;
  backgroundVideoCompressed: string;
  backgroundImage: string;
  backgroundImageCompressed: string;
  signInBackgroundVideo: string;
  signInBackgroundVideoCompressed: string;
  signInBackgroundImage: string;
  signInBackgroundImageCompressed: string;
  homePageDescription: string;
  signInDescription: string;
}

export const DEFAULT_HOMEPAGE = {
  type: FILE_TYPE.IMAGE,
  backgroundVideo: "",
  backgroundVideoCompressed: "",
  backgroundImage: "",
  backgroundImageCompressed: "",
  signInBackgroundVideo: "",
  signInBackgroundVideoCompressed: "",
  signInBackgroundImage: "",
  signInBackgroundImageCompressed: "",
  homePageDescription: "",
  signInDescription: "",
} as IHomepage;
