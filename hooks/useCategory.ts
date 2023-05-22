import { useState } from "react";
import { toast } from "react-toastify";

import { useAuthValues } from "@/contexts/contextAuth";

import { API_BASE_URL, API_VERSION, DATE_FORMAT } from "@/libs/constants";

import { ICategory } from "@/interfaces/ICategory";
import moment from "moment";

const useCategory = () => {
  const { accessToken, user } = useAuthValues();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  const fetchAllCategory = async () => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/category`,
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
      const categorys = data as Array<ICategory>;

      return categorys;
    }

    setIsLoading(false);
    return [];
  };

  const createCategory = async (
    image: File,
    name: string,
    description: string,
    releaseDate: string
  ): Promise<ICategory | null> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setLoadingProgress(0);

      const formData = new FormData();

      formData.append("imageFile", image);
      formData.append("name", name.toString());
      if (user.id) formData.append("userId", user.id.toString());
      else formData.append("userId", "");
      formData.append("description", description.toString());
      formData.append(
        "releaseDate",
        moment(releaseDate).format(DATE_FORMAT).toString()
      );
      formData.append("copyright", "");

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_BASE_URL}/${API_VERSION}/admin/category`);
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
          const category = data as ICategory;
          resolve(category);
        } else {
          if (xhr.status === 500) {
            toast.error("Error occurred while creating category.");
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

  const updateCategory = async (
    id: number | null,
    image: File | null,
    name: string,
    description: string,
    releaseDate: string
  ): Promise<ICategory | null> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);

      const formData = new FormData();
      if (id) formData.append("id", id.toString());
      else formData.append("id", "");
      if (image) {
        formData.append("imageFile", image);
      }
      formData.append("name", name.toString());
      if (user.id) formData.append("userId", user.id.toString());
      else formData.append("userId", "");
      formData.append("description", description.toString());
      formData.append(
        "releaseDate",
        moment(releaseDate).format(DATE_FORMAT).toString()
      );
      formData.append("copyright", "");

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", `${API_BASE_URL}/${API_VERSION}/admin/category`);
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
          const category = data as ICategory;
          resolve(category);
        } else {
          if (xhr.status === 500) {
            toast.error("Error occurred while updating category.");
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

  const deleteCategory = async (id: number | null) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/category?id=${id}`,
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
    fetchAllCategory,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

export default useCategory;
