import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import Box from '@mui/material/Box';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const SampleStackedBarChart = () => {

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Chart.js Bar Chart - Stacked',
      },
      datalabels: {
        display: false,
      }
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  }

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: [1, 2, 3, 4, 5, 6, 7],
        backgroundColor: 'rgb(255, 99, 132)',
      },
      {
        label: 'Dataset 2',
        data: [1, 1, 1, 1, 1, 1, 1],
        backgroundColor: 'rgb(75, 192, 192)',
      },
      {
        label: 'Dataset 3',
        data: [1, 1, 1, 1, 1, 1, 1],
        backgroundColor: 'rgb(53, 162, 235)',
      },
    ],
  };
  
  // 画面編集
  return (
    <Box component='div' sx={{ height: '50%', width: '50%'}}>
      <Bar options={options} data={data} />
    </Box>
  );

}
export default SampleStackedBarChart;
