import React from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { PolarArea } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

type Props = {
  totalIncome: number;
  totalDonation: number;
  totalSubscription: number;
};

const PolarGraph = ({
  totalIncome,
  totalDonation,
  totalSubscription,
}: Props) => {
  const inData = [];
  inData.push(
    Number(totalIncome),
    Number(totalDonation),
    Number(totalSubscription)
  );

  const data = {
    labels: ["Total Income", "Donations", "Subscriptions"],
    datasets: [
      {
        label: "Amount",
        data: inData,
        backgroundColor: [
          "rgba(8,232,222, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(250, 255, 0, 1)",
        ],
        borderColor: [
          "rgba(8,232,222,0.1)",
          "rgba(54, 162, 235, 0.1)",
          "rgba(250, 255, 0, 0.1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Earnings Overview</h2>
      <PolarArea data={data} />
    </div>
  );
};

export default PolarGraph;
