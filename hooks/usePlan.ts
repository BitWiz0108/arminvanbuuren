import { useState } from "react";
import { toast } from "react-toastify";

import { useAuthValues } from "@/contexts/contextAuth";

import { getAWSSignedURL } from "@/libs/aws";
import {
  API_BASE_URL,
  API_VERSION,
  DEFAULT_COVER_IMAGE,
} from "@/libs/constants";

import { IPlan } from "@/interfaces/IPlan";

const usePlan = () => {
  const { accessToken } = useAuthValues();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      const promises = plans.map((plan) => {
        return getAWSSignedURL(plan.coverImage, DEFAULT_COVER_IMAGE);
      });
      const images = await Promise.all(promises);
      plans.forEach((plan, index) => (plan.coverImage = images[index]));

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
  ) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("imageFile", imageFile);
    formData.append("name", name.toString());
    formData.append("description", description.toString());
    formData.append("price", price.toString());
    formData.append("duration", duration.toString());
    if (currencyId) formData.append("currencyId", currencyId.toString());
    else formData.append("currencyId", "");

    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/admin/plans`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      const plan = data as IPlan;
      plan.coverImage = await getAWSSignedURL(
        plan.coverImage,
        DEFAULT_COVER_IMAGE
      );

      return plan;
    } else {
      if (response.status == 500) {
        toast.error("Error occured on creating plan.");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    }

    setIsLoading(false);
    return null;
  };

  const updatePlan = async (
    id: number | null,
    imageFile: File | null,
    name: string,
    description: string,
    price: number,
    duration: number,
    currencyId: number | null
  ) => {
    setIsLoading(true);

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

    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/admin/plans`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      const plan = data as IPlan;
      plan.coverImage = await getAWSSignedURL(
        plan.coverImage,
        DEFAULT_COVER_IMAGE
      );

      return plan;
    } else {
      if (response.status == 500) {
        toast.error("Error occured on updating plan.");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    }

    setIsLoading(false);
    return null;
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

  return { isLoading, fetchPlans, createPlan, updatePlan, deletePlan };
};

export default usePlan;
