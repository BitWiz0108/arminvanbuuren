import { useState } from "react";
import moment from "moment";

import { useAuthValues } from "@/contexts/contextAuth";

import {
  API_BASE_URL,
  API_VERSION,
  BEST_SELLING_TYPE,
  DATE_FORMAT,
} from "@/libs/constants";

const useDashBoard = () => {
  const { accessToken } = useAuthValues();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchDashboardStats = async () => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/dashboard/statistics`,
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

  const fetchBestSelling = async (
    type: BEST_SELLING_TYPE,
    from: string,
    to: string
  ) => {
    setIsLoading(true);
    let new_from = new Date(from);

    switch (type) {
      case BEST_SELLING_TYPE.DAILY:
        from = from;
        break;
      case BEST_SELLING_TYPE.WEEKLY:
        new_from = new Date(new_from.getFullYear(), new_from.getMonth(), 1);
        from = moment(new_from.toString()).format(DATE_FORMAT);
        break;
      case BEST_SELLING_TYPE.MONTHLY:
        new_from = new Date(new_from.getFullYear(), 0, 1);
        from = moment(new_from.toString()).format(DATE_FORMAT);
        break;
      default:
        break;
    }

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/dashboard/best-sellings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ type, from, to }),
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

  return { isLoading, fetchDashboardStats, fetchBestSelling };
};

export default useDashBoard;
