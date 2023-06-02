import { useState } from "react";

import { useAuthValues } from "@/contexts/contextAuth";

import {
  API_BASE_URL,
  API_VERSION,
} from "@/libs/constants";
import { ITermsOfService } from "@/interfaces/ITermsOfService";
import { ISubscriptionContent } from "@/interfaces/ISubscriptionContent";

const useTermsOfService = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { accessToken } = useAuthValues();

  const fetchTermsContent = async () => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/termsofservice`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      return data as ITermsOfService;
    } else {
      setIsLoading(false); return null;
    }
  }

  const updateTermsContent = async (content: string) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/termsofservice`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content }),
      }
    );
    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      return data as ITermsOfService;
    } else {
      setIsLoading(false); return null;
    }
  }

  const fetchSubscriptionContent = async (artistId : number | null) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/artist/subscription-description?artistId=${artistId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      return data as ISubscriptionContent;
    } else {
      setIsLoading(false); return null;
    }
  }

  const updateSubscriptionContent = async (artistId : number | null, content: string) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/artist/subscription-description`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ artistId,content }),
      }
    );
    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      return data as ISubscriptionContent;
    } else {
      setIsLoading(false); return null;
    }
  }

  return { isLoading, fetchTermsContent, updateTermsContent, fetchSubscriptionContent, updateSubscriptionContent }
}

export default useTermsOfService;