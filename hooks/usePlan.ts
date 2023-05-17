import { useState } from "react";
import { toast } from "react-toastify";

import { useAuthValues } from "@/contexts/contextAuth";

import { API_BASE_URL, API_VERSION } from "@/libs/constants";

import { IPlan } from "@/interfaces/IPlan";

const usePlan = () => {
  const { accessToken } = useAuthValues();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  const fetchPlans = async () => {
    setIsLoading(true);

    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/admin/plans`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      const plans = data as Array<IPlan>;
      return plans;
    }

    setIsLoading(false);
    return [];
  };

  const createPlan = async (
    imageFile: File,
    name: string,
    description: string,
    price: number,
    duration: number,
    currencyId: number | null
  ): Promise<IPlan | null> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setLoadingProgress(0);

      const formData = new FormData();
      formData.append("imageFile", imageFile);
      formData.append("name", name.toString());
      formData.append("description", description.toString());
      formData.append("price", price.toString());
      formData.append("duration", duration.toString());
      if (currencyId) formData.append("currencyId", currencyId.toString());
      else formData.append("currencyId", "");

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_BASE_URL}/${API_VERSION}/admin/plans`);

      xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);

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
          const music = data as IPlan;

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

  const updatePlan = async (
    id: number | null,
    imageFile: File | null,
    name: string,
    description: string,
    price: number,
    duration: number,
    currencyId: number | null
  ): Promise<IPlan | null> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setLoadingProgress(0);

      const formData = new FormData();
      if (id) formData.append("id", id.toString());
      else formData.append("id", "");
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }
      formData.append("name", name.toString());
      formData.append("description", description.toString());
      formData.append("price", price.toString());
      formData.append("duration", duration.toString());
      if (currencyId) formData.append("currencyId", currencyId.toString());
      else formData.append("currencyId", "");

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", `${API_BASE_URL}/${API_VERSION}/admin/plans`);

      xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);

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
          const music = data as IPlan;
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

  const deletePlan = async (id: number | null) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/plans?id=${id}`,
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
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
  };
};

export default usePlan;
