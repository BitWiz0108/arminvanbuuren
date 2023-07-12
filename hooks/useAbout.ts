import { useState } from "react";
import { toast } from "react-toastify";

import { useAuthValues } from "@/contexts/contextAuth";

import { API_BASE_URL, API_VERSION } from "@/libs/constants";

import { IAbout } from "@/interfaces/IAbout";

const useAbout = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { accessToken } = useAuthValues();
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  const fetchAboutContent = async () => {
    setIsLoading(true);

    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/admin/about`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      return data as IAbout;
    } else {
      setIsLoading(false);
      return null;
    }
  };

  const updateAboutContent = async (
    coverImage1: File | null,
    coverImage2: File | null
  ): Promise<IAbout | null> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setLoadingProgress(0);

      const nullFile = new File([""], "garbage.bin");

      const formData = new FormData();
      formData.append("files", coverImage1 ?? nullFile);
      formData.append("files", coverImage2 ?? nullFile);
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", `${API_BASE_URL}/${API_VERSION}/admin/about/images`);

      xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);

      // Track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round(
            (event.loaded / event.total) * 100
          );
          setLoadingProgress(percentCompleted);
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201 || xhr.status === 202) {
          setIsLoading(false);
          const data = JSON.parse(xhr.response);
          const music = data as IAbout;

          resolve(music);
        } else {
          if (xhr.status === 500) {
            toast.error("Error occurred while updating.");
            setIsLoading(false);
          } else {
            const data = JSON.parse(xhr.responseText);
            toast.error(data.message);
            setIsLoading(false);
          }
          reject(xhr.statusText);
        }
      };

      xhr.onloadend = () => {
        setLoadingProgress(0);
      };

      xhr.send(formData);
    });
  };

  const fetchConnectContent = async () => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/about/connect`,
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
      return data;
    } else {
      setIsLoading(false);
      return null;
    }
  };

  const updateConnectContent = async (content: string) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/about/connect`,
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
      return data;
    } else {
      setIsLoading(false);
      return null;
    }
  };

  return {
    isLoading,
    loadingProgress,
    fetchAboutContent,
    updateAboutContent,
    fetchConnectContent,
    updateConnectContent,
  };
};

export default useAbout;
