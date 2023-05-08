import { useState } from "react";

import { useAuthValues } from "@/contexts/contextAuth";

import { API_BASE_URL, API_VERSION, IMAGE_SIZE } from "@/libs/constants";

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

  const addImage = async (
    imageFile: File,
    size: IMAGE_SIZE,
    description: string
  ) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("imageFile", imageFile);
    formData.append("size", size);
    formData.append("description", description);

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

  const updateImage = async (
    id: number | null,
    imageFile: File | null,
    size: IMAGE_SIZE,
    description: string
  ) => {
    setIsLoading(true);

    const nullFile = new File([""], "garbage.bin");

    const formData = new FormData();
    if (id) formData.append("id", id.toString());
    else formData.append("id", "");
    if (imageFile) formData.append("imageFile", imageFile);
    else formData.append("imageFile", nullFile);
    formData.append("size", size);
    formData.append("description", description);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/gallery`,
      {
        method: "PUT",
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

  return { isLoading, fetchImages, addImage, updateImage, deleteImage };
};

export default useGallery;
