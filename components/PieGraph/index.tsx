import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Line, Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  liveStream: number;
  music: number;
};

const PieGraph = ({ liveStream, music }: Props) => {
  const inData = [];
  inData.push(liveStream);
  inData.push(music);

  const data = {
    labels: ["Livestream", "Music"],
    datasets: [
      {
        label: "Number",
        data: inData,
        backgroundColor: ["rgba(255, 99, 132, 0.9)", "rgba(54, 162, 235, 0.8)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Livestream/Music Overview</h2>
      <Pie data={data} />
    </div>
  );
};
export default PieGraph;
