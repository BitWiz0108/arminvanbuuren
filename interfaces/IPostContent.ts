import { FILE_TYPE } from "@/libs/constants";

interface IContentBody {
  content: string;
  contentCompressed: string;
}

export interface IPostContent {
  types: Array<FILE_TYPE | null> | null;
  files: Array<IContentBody> | null;
}
