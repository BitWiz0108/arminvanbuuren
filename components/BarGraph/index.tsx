import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  labelsData: any;
  datasets: any;
};

const BarGraph = ({ labelsData, datasets }: Props) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Subscriptions",
      },
    },
    aspectRatio: 1,
  };

  const labels = labelsData;

  const data = {
    labels,
    datasets: [
      {
        label: "Subscriptions Count",
        data: datasets,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <div>
      <h2>Subscriptions</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarGraph;
