import { useState } from "react";
import { toast } from "react-toastify";

import { useAuthValues } from "@/contexts/contextAuth";

import {
  API_BASE_URL,
  API_VERSION,
  FILE_TYPE,
  IMAGE_SIZE,
} from "@/libs/constants";

import { IGallery } from "@/interfaces/IGallery";

const useGallery = () => {
  const { accessToken } = useAuthValues();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

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
    galleryImageType: FILE_TYPE,
    imageFile: File | null,
    imageFileCompressed: File | null,
    videoFile: File | null,
    videoFileCompressed: File | null,
    size: IMAGE_SIZE,
    description: string
  ): Promise<IGallery | null> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setLoadingProgress(0);

      const formData = new FormData();
      const nullFile = new File([""], "garbage.bin");

      formData.append("type", galleryImageType);
      if (galleryImageType == FILE_TYPE.IMAGE) {
        formData.append("files", imageFile ?? nullFile);
        formData.append("files", imageFileCompressed ?? nullFile);
      } else if (galleryImageType == FILE_TYPE.VIDEO) {
        formData.append("files", videoFile ?? nullFile);
        formData.append("files", videoFileCompressed ?? nullFile);
      }
      formData.append("size", size);
      formData.append("description", description);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_BASE_URL}/${API_VERSION}/admin/gallery`);

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
          const music = data as IGallery;

          resolve(music);
        } else {
          if (xhr.status === 500) {
            toast.error("Error occurred while creating music.");
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

  const updateImage = async (
    id: number | null,
    galleryImageType: FILE_TYPE,
    imageFile: File | null,
    imageFileCompressed: File | null,
    videoFile: File | null,
    videoFileCompressed: File | null,
    size: IMAGE_SIZE,
    description: string
  ): Promise<IGallery | null> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setLoadingProgress(0);

      const nullFile = new File([""], "garbage.bin");

      const formData = new FormData();
      if (id) formData.append("id", id.toString());
      else formData.append("id", "");
      formData.append("type", galleryImageType);
      if (galleryImageType == FILE_TYPE.IMAGE) {
        formData.append("files", imageFile ?? nullFile);
        formData.append("files", imageFileCompressed ?? nullFile);
      } else if (galleryImageType == FILE_TYPE.VIDEO) {
        formData.append("files", videoFile ?? nullFile);
        formData.append("files", videoFileCompressed ?? nullFile);
      }
      formData.append("size", size);
      formData.append("description", description);

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", `${API_BASE_URL}/${API_VERSION}/admin/gallery`);

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
          const music = data as IGallery;
          resolve(music);
        } else {
          if (xhr.status === 500) {
            toast.error("Error occurred while creating music.");
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

  return {
    isLoading,
    loadingProgress,
    fetchImages,
    addImage,
    updateImage,
    deleteImage,
  };
};

export default useGallery;
