import { useState } from "react";
import { toast } from "react-toastify";

import { useAuthValues } from "@/contexts/contextAuth";

import {
  API_BASE_URL,
  API_VERSION,
} from "@/libs/constants";

import { IAbout } from "@/interfaces/IAbout";

const useAbout = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { accessToken } = useAuthValues();

  const fetchAboutContent = async () => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/about/images`,
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
      return data as IAbout;
    } else {
      setIsLoading(false);
      return null;
    }
  }

  const updateAboutContent = async (coverImage1: File | null, coverImage2: File | null) => {
    setIsLoading(true);
    const nullFile = new File([""], "garbage.bin");

    const formData = new FormData();
    formData.append("files", coverImage1 ?? nullFile);
    formData.append("files", coverImage2 ?? nullFile);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/about/images`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData
      }
    );
    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      toast.success("Successfully Updated the coverImages");
      return data as IAbout;
    } else {
      setIsLoading(false);
      return null;
    }
  }

  return { isLoading, fetchAboutContent, updateAboutContent };
};

export default useAbout;
