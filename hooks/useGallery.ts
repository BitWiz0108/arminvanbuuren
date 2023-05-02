import { useState } from "react";

import { useAuthValues } from "@/contexts/contextAuth";

import { API_BASE_URL, API_VERSION } from "@/libs/constants";

import { IGallery } from "@/interfaces/IGallery";

const useGallery = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { accessToken } = useAuthValues();

  const fetchImages = async () => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/gallery`,
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
      return data as IGallery;
    } else {
      setIsLoading(false);
      return null;
    }
  };

  const addImage = async (imageFile: File) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("imageFile", imageFile);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/gallery`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );
    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      return data as IGallery;
    } else {
      setIsLoading(false);
      return null;
    }
  };

  const deleteImage = async (id: number | null) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/gallery?id=${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  return { isLoading, fetchImages, addImage, deleteImage };
};

export default useGallery;
