import { useState, useEffect } from 'react';
import { AlertType } from './../common/cmnType';
import { cmnProps } from './../common/cmnConst';
import { getSalesreportsWhereProspect } from './../../lib/api/prospect';
import { formatDateZero, formatDateTimeZero } from '../../lib/common/dateCom';
import Loading from '../common/Loading';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import PostAddIcon from '@mui/icons-material/PostAdd';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import ReportNewPage from './ReportNewPage';
import ReportShowPage from './ReportShowPage';
import ReportUpdPage from './ReportUpdPage';

const dateDispForm = "YYYY年MM月DD日";
const datetimeDispForm = "YYYY年MM月DD日 HH:MI:SS";

type NextParam = {
  show: boolean;
  id: number | null;
}
type Report = {
  id: number;
  reportDate: Date | null;
  makeName: string;
  updateName: string;
  salesactionName: string;
  topics:  string;
  createdAt: Date;
  updatedAt: Date;
}
type Props = {
  prospectId: number | null;
  isClosing: boolean;
  setIsUpdateReport: (isUpdateReport: boolean) => void;
  isUpdateReport: boolean;
}
const ReportIndexPage = (props: Props) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });

  const [showNew, setShowNew] = useState<boolean>(false);
  const [paramDetail, setParamDetail] = useState<NextParam>({show: false, id: null});
  const [paramUpd, setParamUpd] = useState<NextParam>({show: false, id: null});

  // 初期処理
  useEffect(() => {
    if(props.prospectId){
      setIsLoading(true);
      handleGetReports();
    }
  }, [props.prospectId]);

  // 営業報告取得
  const handleGetReports = async () => {
    try {
      const res = await getSalesreportsWhereProspect(props.prospectId);
      setReports(res.data.salesreports);
    } catch (e) {
      setErr({severity: "error", message: "営業報告取得エラー"});
    } 
    setIsLoading(false);
  }

  // 新規作成画面終了
  const closeNew = (refresh?: boolean) => {
    setShowNew(false);
    if(refresh){
      setIsLoading(true);
      handleGetReports();
      props.setIsUpdateReport(!props.isUpdateReport)
    }
  }

  // 詳細画面表示
  const handleShowDetail = (id: number) => {
    setParamDetail({show: true, id: id});
  }

  // 詳細画面終了
  const closeDetail = (refresh?: boolean) => {
    setParamDetail({show: false, id: null});
    if(refresh){
      setIsLoading(true);
      handleGetReports();
      props.setIsUpdateReport(!props.isUpdateReport)
    }
  }

  // 変更画面表示
  const handleShowUpd = (id: number) => {
    setParamUpd({show: true, id: id});
  }

  // 変更画面終了
  const closeUpd = (refresh?: boolean) => {
    setParamUpd({show: false, id: null});
    if(refresh){
      setIsLoading(true);
      handleGetReports();
      props.setIsUpdateReport(!props.isUpdateReport)
    }
  }

  // 画面編集
  return (
    <>
      <Box component='div' sx={{ p: 2, backgroundColor: '#fff', height: '100%', width: '100%' , position: 'relative'}}>

        {(err.severity) &&
          <Stack sx={{width: '100%'}} spacing={1}>
            <Alert severity={err.severity}>{err.message}</Alert>
          </Stack>
        }

        <Button 
          variant="contained"
          color="primary"
          size="small"
          startIcon={<PostAddIcon />}
          sx={{ml: 1, mb: 1.5}}
          disabled={props.isClosing}
          onClick={(e) => setShowNew(true)}
        >
          営業報告追加
        </Button>

        <Box 
          component='div' 
          sx={{ m: 1, width: '100%', maxHeight: err.severity ? 'calc(100% - 100px)' : 'calc(100% - 50px)', overflow: 'auto', border: 'solid 0.5px #000', borderRadius: '4px', boxShadow: '1px 2px 1px rgba(0, 0, 0, 0.5)'}}
        >
          { reports.length ? (
            <>
              { reports.map((r,i) => (
                <Card key={`report-${i}`} sx={{ mb: i===reports.length-1 ? 0 : 1, minWidth: 300 }}>
                  <CardActionArea onClick={() => handleShowDetail(r.id)}>
                    <CardContent>
                      <Typography sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>
                        {`報告日：${formatDateZero(r.reportDate, dateDispForm)}　報告者：${r.makeName ? r.makeName : ""}`}
                      </Typography>
                      <Typography sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>
                        {`最終更新日：${formatDateTimeZero(r.updatedAt, datetimeDispForm)}　最終更新者：${r.updateName ? r.updateName : ""}`}
                      </Typography>
                      { r.salesactionName && 
                        <Typography sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>
                          {r.salesactionName}
                        </Typography>
                      }
                      <Typography sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>
                        {r.topics.substring(0,30) + (r.topics.length>30 ? "..." : "")}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button size="small" color='primary' onClick={() => handleShowDetail(r.id)}>SHOW</Button>
                    <Button size="small" color='primary' onClick={() => handleShowUpd(r.id)} disabled={props.isClosing}>EDIT</Button>
                  </CardActions>
                </Card>
              ))}
            </>
          ) : (
            <>
              <Card sx={{ minWidth: 300 }}>
                <CardContent>
                  <Typography variant='h3' component='div'>
                    No Report
                  </Typography>
                </CardContent>
              </Card>
            </>
          )}
        </Box>
        <Loading isLoading={isLoading} />
      </Box>
      <ReportNewPage show={showNew} prospectId={props.prospectId} close={closeNew} />
      <ReportShowPage show={paramDetail.show} reportId={paramDetail.id} isClosing={props.isClosing} close={closeDetail} />
      <ReportUpdPage show={paramUpd.show} reportId={paramUpd.id} close={closeUpd} />
    </>
  );
}
export default ReportIndexPage;
