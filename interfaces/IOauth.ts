import { OAUTH_PROVIDER } from "@/libs/constants";

export interface IOauth {
  provider: OAUTH_PROVIDER;
  appId: string;
  appSecret: string;
}
