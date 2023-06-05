import { OAUTH_PROVIDER } from "@/libs/constants";

export interface IOauth {
  provider: OAUTH_PROVIDER;
  facebookAppId: string;
  facebookAppSecret: string;
  appleAppId: string;
  appleAppSecret: string;
  googleAppId: string;
  googleAppSecret: string;
}

export interface UIOauth {
  provider: OAUTH_PROVIDER;
  appId: string;
  appSecret: string;
}