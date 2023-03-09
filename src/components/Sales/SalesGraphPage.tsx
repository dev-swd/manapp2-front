import { useState, useEffect } from 'react';
import { cmnProps } from './../common/cmnConst';
import { AlertType } from './../common/cmnType';
import { countClosingByMonthProduct, countLeadByMonth } from './../../lib/api/prospect';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  BarController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  BarController
);

const getThisYearStart = () => {
  let dt = new Date();
  dt.setMonth(0);
  dt.setDate(1);
  dt.setHours(0);
  dt.setMinutes(0);
  dt.setSeconds(0);
  return dt;
}
const getThisYearEnd = () => {
  let dt = new Date();
  dt.setMonth(11);
  dt.setDate(31);
  dt.setHours(23);
  dt.setMinutes(59);
  dt.setSeconds(59);
  return dt;
}
const getMonthStart = () => {
  let dt = new Date();
  dt.setHours(0);
  dt.setMinutes(0);
  dt.setSeconds(0);
  dt.setDate(1);
  return dt;
}
const getMonthEnd = () => {
  let dt = new Date();
  dt.setMonth(dt.getMonth() + 1);
  dt.setDate(0);
  dt.setHours(23);
  dt.setMinutes(59);
  dt.setSeconds(59);
  return dt;
}

type Master = {
  id: number;
  name: string;
  colorR: number;
  colorG: number;
  colorB: number;
  colorA: number;
}
type Data = {
  [key: number]: number[]
}
type Props = {
  show: boolean;
  close: () => void;  
}
const SalesGraphPage = (props: Props) => {
  const [dateFr, setDateFr] = useState<Date | null>(getThisYearStart());
  const [dateTo, setDateTo] = useState<Date | null>(getThisYearEnd());
  const [ym1, setYm1] = useState<string[]>([]);
  const [products, setProducts] = useState<Master[]>([]);
  const [datas1, setDatas1] = useState<Data>({});
  const [sumDatas, setSumDatas] = useState<Data>({});
  const [ym2, setYm2] = useState<string[]>([]);
  const [leads, setLeads] = useState<Master[]>([]);
  const [datas2, setDatas2] = useState<Data>({});

  const [isLoading1, setIsLoading1] = useState<boolean>(false);
  const [isLoading2, setIsLoading2] = useState<boolean>(false);
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });

  // 初期処理
  useEffect(() => {
    if(props.show){
      setIsLoading1(true);
      handleGetGraphData1();
      setIsLoading2(true);
      handleGetGraphData2();
    }
  }, [props.show]);

  // グラフデータ取得
  const handleGetGraphData1 = async () => {
    try {
      const res = await countClosingByMonthProduct(dateFr, dateTo);
      setYm1(res.data.ym);
      setProducts(res.data.products);
      setDatas1(res.data.datas);
      let tmpSumDatas :Data = {};
      res.data.products.forEach((p: Master) => {
        let ary: number[] = [];
        let sum: number = 0;
        res.data.datas[p.id].forEach((d: number) => {
          sum = sum + d;
          ary.push(sum);
        });
        tmpSumDatas[p.id] = ary;
      })
      console.log(tmpSumDatas);
      setSumDatas(tmpSumDatas);
    } catch (e) {
      setErr({severity: "error", message: "月別商材別確定件数取得エラー"});
    } 
    setIsLoading1(false);
  }

  // グラフデータ取得
  const handleGetGraphData2 = async () => {
    try {
      const res = await countLeadByMonth(dateFr, dateTo);
      setYm2(res.data.ym);
      setLeads(res.data.leads);
      setDatas2(res.data.datas);
    } catch (e) {
      setErr({severity: "error", message: "月別リード数取得エラー"});
    } 
    setIsLoading2(false);
  }

  // 閉じるボタン押下時の処理
  const handleClose = () => {
    setDateFr(getThisYearStart());
    setDateTo(getThisYearEnd());
    setYm1([]);
    setProducts([]);
    setDatas1({});
    setYm2([]);
    setLeads([]);
    setDatas2({});
    setErr({ severity: null, message: "" });
    props.close();
  }

  const options1 = {
    plugins: {
      title: {
        display: true,
        text: '月別商材別確定件数',
      },
      datalabels: {
        display: false,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
        ticks: {
          stepSize: 1,
        }
      },
    },
  }

  type typeDatasets = {
    type: any;
    label: any;
    data: any;
    backgroundColor?: any;
    borderColor: any;
    borderWidth: any;
    fill?: any
  }
  const resetData1 = () => {
    let tmp1 = products.map(function(p: Master){
      let tmp: typeDatasets = 
        {
          type: 'bar' as const,
          label: p.name,
          data: datas1[p.id],
          backgroundColor: `rgba(${p.colorR}, ${p.colorG}, ${p.colorB}, ${p.colorA})`,
          borderColor: `rgba(${p.colorR}, ${p.colorG}, ${p.colorB}, 1)`,
          borderWidth: 1,
        }
      return tmp;
    });
    let tmp2 = products.map(function(p: Master){
      let tmp: typeDatasets = 
        {
          type: 'line' as const,
          label: `${p.name}(累計)`,
          data: sumDatas[p.id],
          backgroundColor: `rgba(${p.colorR}, ${p.colorG}, ${p.colorB}, ${p.colorA})`,
          borderColor: `rgba(${p.colorR}, ${p.colorG}, ${p.colorB}, 1)`,
          borderWidth: 2,
          fill: false,
        }
      return tmp;
    });
    return tmp1.concat(tmp2);
  }
  const data1 = {
    labels: ym1,
    datasets: resetData1(),
  }

  const options2 = {
    plugins: {
      title: {
        display: true,
        text: '月別リードレベル別件数',
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
    labels: ym2,
    datasets: 
      leads.map(function(l: Master){
        let tmp = {
          label: l.name,
          data: datas2[l.id],
          backgroundColor: `rgba(${l.colorR}, ${l.colorG}, ${l.colorB}, ${l.colorA})`,
          borderColor: `rgba(${l.colorR}, ${l.colorG}, ${l.colorB}, 1`,
          borderWidth: 1,
          }
        return tmp;
      })
  };

  // 画面編集
  return (
    <>
      { props.show ? (
        <div className='fullscreen'>
          <AppBar position='static'>
            <Toolbar variant="dense">
              <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>営業情報グラフ</Typography>
              <IconButton
                size="medium"
                edge="end"
                color='inherit'
                aria-label="close"
                onClick={(e) => handleClose()}
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Box component='div' sx={{ height: 'calc(100vh - 52px)', width: '100vw' }}>
            {(err.severity) &&
              <Stack sx={{width: '100%'}} spacing={1}>
                <Alert severity={err.severity}>{err.message}</Alert>
              </Stack>
            }

            <Box component='div' sx={{ my: '4px', mx: '4px', pt: 1, pb: 2, height: 'calc(50% - 8px)', width: 'calc(50% - 8px)', display: 'flex', justifyContent: 'center', border: 'solid 0.5px #000', borderRadius: '4px', boxShadow: '1px 2px 1px rgba(0, 0, 0, 0.5)' }}>
              <Chart type='bar' options={options1} data={data1} />
            </Box>

            <Box component='div' sx={{ my: '4px', mx: '4px', pt: 1, pb: 2, height: 'calc(50% - 8px)', width: 'calc(50% - 8px)', display: 'flex', justifyContent: 'center', border: 'solid 0.5px #000', borderRadius: '4px', boxShadow: '1px 2px 1px rgba(0, 0, 0, 0.5)' }}>
              <Bar options={options2} data={data2} />
            </Box>

          </Box>
        </div>
      ) : (
        <></>
      )}
    </>

  );
}
export default SalesGraphPage;
