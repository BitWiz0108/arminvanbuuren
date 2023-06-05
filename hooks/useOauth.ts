import { useState } from "react";
import { toast } from "react-toastify";

import { useAuthValues } from "@/contexts/contextAuth";

import { API_BASE_URL, API_VERSION, OAUTH_PROVIDER } from "@/libs/constants";

import { IOauth, UIOauth } from "@/interfaces/IOauth";

const useOauth = () => {
  const { accessToken } = useAuthValues();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchOauthSettings = async () => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/oauth`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      setIsLoading(false);
      if (response) {
        const data = (await response.json()) as IOauth;
        return data;
      }
    }
    setIsLoading(false);
    return null;
  };

  const updateOauthSettings = async (
    oauthProvider: OAUTH_PROVIDER,
    appId?: string,
    appSecret?: string
  ) => {
    setIsLoading(true);

    const provider = oauthProvider;
    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/admin/oauth`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ provider, appId, appSecret }),
    });

    if (response.ok) {
      setIsLoading(false);
      const data = (await response.json()) as UIOauth;
      return data;
    } else {
      if (response.status == 500) {
        toast.error("Error occured on updating the OAuth App settings.");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    }

    setIsLoading(false);
    return null;
  };

  return {
    isLoading,
    fetchOauthSettings,
    updateOauthSettings,
  };
};
export default useOauth;
