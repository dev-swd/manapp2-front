import { useState, useEffect } from 'react';
import { AlertType } from './../common/cmnType';
import { countByActionMonthWhereProspect } from './../../lib/api/prospect';
import Loading from '../common/Loading';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import chartjsPluginDatalabels from 'chartjs-plugin-datalabels';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  chartjsPluginDatalabels,
);

type Action = {
  id: number;
  name: string;
  colorR: number;
  colorG: number;
  colorB: number;
  colorA: number;
  cnt: number;
}
type Data = {
  [key: number]: []
}
type Props = {
  prospectId: number | null;
  isUpdateReport: boolean;
}
const ReportGraphPage = (props: Props) => {
  const [ym, setYm] = useState<string[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [datas, setDatas] = useState<Data>({});

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });

  // 初期処理
  useEffect(() => {
    if(props.prospectId){
      setIsLoading(true);
      handleGetReportCnt();
    }
  }, [props.prospectId, props.isUpdateReport]);

  // 営業報告取得
  const handleGetReportCnt = async () => {
    try {
      const res = await countByActionMonthWhereProspect(props.prospectId);
      setYm(res.data.ym);
      setActions(res.data.actions);
      setDatas(res.data.datas);
    } catch (e) {
      setErr({severity: "error", message: "営業報告取得エラー"});
    } 
    setIsLoading(false);
  }
  
  const options1 = {
    plugins: {
      title: {
        display: true,
        text: '営業アクション割合',
      },
      legend: {
        position: 'top' as const,
      },
      datalabels: {
        display: true,
        font: {
          weight: 'bold' as const,
        }
      }
    }
  }

  const data1 = {
    labels: actions.map(function(a: Action){return a.name}),
    datasets: [
      {
        data: actions.map(function(a: Action){return a.cnt}),
        backgroundColor: actions.map(function(a: Action){return `rgba(${a.colorR}, ${a.colorG}, ${a.colorB}, ${a.colorA})`}),
        borderColor: actions.map(function(a: Action){return `rgba(${a.colorR}, ${a.colorG}, ${a.colorB}, 1)`}),
        borderWidth: 1,
      },
    ],
  }

  const options2 = {
    plugins: {
      title: {
        display: true,
        text: '月別営業アクション回数',
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
        ticks: {
          stepSize: 1,
        }
      },
    },
  }

  const data2 = {
    labels: ym,
    datasets: 
      actions.map(function(a: Action){
        let tmp = {
          label: a.name,
          data: datas[a.id],
          backgroundColor: `rgba(${a.colorR}, ${a.colorG}, ${a.colorB}, ${a.colorA})`,
          borderColor: `rgba(${a.colorR}, ${a.colorG}, ${a.colorB}, 1`,
          borderWidth: 1,
          }
        return tmp;
      })
  };

  // 画面編集
  return (
    <>
      <Box component='div' sx={{ p: 2, backgroundColor: '#fff', height: '100%', width: '100%', position: 'relative' }}>

        {(err.severity) &&
          <Stack sx={{width: '100%'}} spacing={1}>
            <Alert severity={err.severity}>{err.message}</Alert>
          </Stack>
        }

        <Box 
          component='div' 
          sx={{ width: '100%', height: err.severity ? 'calc(100% - 50px)' : '100%', overflow: 'auto' }}
        >

          <Box component='div' sx={{ mr: '2px', mb: '2px', pt: 1, pb: 2, height: 'calc(50% - 2px)', width: 'calc(100% - 2px)', display: 'flex', justifyContent: 'center', border: 'solid 0.5px #000', borderRadius: '4px', boxShadow: '1px 2px 1px rgba(0, 0, 0, 0.5)' }}>
            <Pie options={options1} data={data1} />
          </Box>

          <Box component='div' sx={{ mr: '2px', mb: '2px', pt: 1, pb: 2, height: 'calc(50% - 2px)', width: 'calc(100% - 2px)', display: 'flex', justifyContent: 'center', border: 'solid 0.5px #000', borderRadius: '4px', boxShadow: '1px 2px 1px rgba(0, 0, 0, 0.5)' }}>
            <Bar options={options2} data={data2} />
          </Box>

        </Box>
      </Box>
      <Loading isLoading={isLoading} />
    </>
  );

}
export default ReportGraphPage;
