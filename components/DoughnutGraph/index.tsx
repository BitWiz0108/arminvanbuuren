import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  subscribedFans: number;
  freeFans: number;
}

const DoughnutGraph = ({ subscribedFans, freeFans }: Props) => {
  const inData = [];
  inData.push(subscribedFans);
  inData.push(freeFans);
  const data = {
    labels: ['Subscribed Fans', 'Free Fans'],
    datasets: [
      {
        label: 'Number',
        data: inData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.9)',
          'rgba(54, 162, 235, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Fans Oveview</h2>
      <Doughnut data={data} />
    </div>

  );
};

export default DoughnutGraph;