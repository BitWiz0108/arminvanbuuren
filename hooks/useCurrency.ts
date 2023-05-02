import { useState } from "react";
import { toast } from "react-toastify";

import { useAuthValues } from "@/contexts/contextAuth";

import { API_BASE_URL, API_VERSION } from "@/libs/constants";

import { ICurrency } from "@/interfaces/ICurrency";

const useCurrency = () => {
  const { accessToken } = useAuthValues();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchCurrencies = async () => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/currency`,
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
      const currencies = data as Array<ICurrency>;

      return currencies;
    }

    setIsLoading(false);
    return [];
  };

  const createCurrency = async (name: string, code: string, symbol: string) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/currency`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name, code, symbol }),
      }
    );

    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      const currency = data as ICurrency;

      return currency;
    } else {
      if (response.status == 500) {
        toast.error("Error occured on creating currency.");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    }

    setIsLoading(false);
    return null;
  };

  const updateCurrency = async (
    id: number | null,
    name: string,
    code: string,
    symbol: string
  ) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/currency`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ id, name, code, symbol }),
      }
    );

    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      const currency = data as ICurrency;

      return currency;
    } else {
      if (response.status == 500) {
        toast.error("Error occured on updating currency.");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    }

    setIsLoading(false);
    return null;
  };

  const deleteCurrency = async (id: number | null) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/currency?id=${id}`,
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
    } else {
      if (response.status == 500) {
        toast.error("Error occured on deleting currency.");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    }

    setIsLoading(false);
    return false;
  };

  return {
    isLoading,
    fetchCurrencies,
    createCurrency,
    updateCurrency,
    deleteCurrency,
  };
};

export default useCurrency;
