import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  dataLabel: any;
  dataSets: any;
};

const LineGraph = ({ dataLabel, dataSets }: Props) => {
  const options = {
    responsive: true,

    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Earnings per day",
      },
    },
    aspectRatio: 2,
  } as ChartOptions;

  const labels = dataLabel;

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Sellings",
        data: dataSets,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h2>Subscriptions Overview</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineGraph;
