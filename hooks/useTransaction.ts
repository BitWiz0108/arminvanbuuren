import { useState } from "react";

import { useAuthValues } from "@/contexts/contextAuth";

import {
  API_BASE_URL,
  API_VERSION,
  DEFAULT_AVATAR_IMAGE,
} from "@/libs/constants";
import { getAWSSignedURL } from "@/libs/aws";

import { ITransaction } from "@/interfaces/ITransaction";

const useTransaction = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { accessToken } = useAuthValues();

  const fetchTransactions = async (page: number, limit: number = 10) => {
    setIsLoading(true);
    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/transactions?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      const transactions = data.transactions as Array<ITransaction>;
      const avatarImagePromises = transactions.map((transaction) => {
        return getAWSSignedURL(
          transaction.buyer.avatarImage,
          DEFAULT_AVATAR_IMAGE
        );
      });
      const avatarImages = await Promise.all(avatarImagePromises);
      transactions.forEach((transaction, index) => {
        transaction.buyer.avatarImage = avatarImages[index];
      });
      const pages = Number(data.pages);

      setIsLoading(false);
      return {
        pages,
        transactions,
      };
    } else {
      setIsLoading(false);
    }
    return { pages: 0, transactions: [] };
  };

  return {
    isLoading,
    fetchTransactions,
  };
};

export default useTransaction;
