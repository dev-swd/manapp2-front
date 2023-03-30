import { useState, useEffect } from 'react';
import { AlertType } from './../common/cmnType';
import { cmnProps } from './../common/cmnConst';
import { getSalesreport } from './../../lib/api/prospect';
import { formatDateZero } from '../../lib/common/dateCom';
import Loading from '../common/Loading';
import ReportUpdPage from './ReportUpdPage';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const CustomCell = styled(TableCell)({
  fontSize: cmnProps.fontSize,
  fontFamily: cmnProps.fontFamily,
  zIndex: 1
});

const dateDispForm = "YYYY年MM月DD日";

const initReport: Report = {
  id: null,
  reportDate: null,
  makeName: "",
  updateName: "",
  salesactionName: "",
  topics: "",
  content: "",
  createdAt: null,
  updatedAt: null,
}
type Report = {
  id: number | null;
  reportDate: Date | null;
  makeName: string;
  updateName: string;
  salesactionName: string;
  topics:  string;
  content: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}
type Props = {
  show: boolean;
  reportId: number | null;
  isClosing: boolean;
  close: (refresh?: boolean) => void;
}
const ReportShowPage = (props: Props) => {
  const [report, setReport] = useState<Report>(initReport);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [showUpd, setShowUpd] = useState<boolean>(false);
  const [updateFlg, setUpdateFlg] = useState<boolean>(false);

  // 初期処理
  useEffect(() => {
    if(props.reportId){
      setIsLoading(true);
      handleGetReport();
    }
  }, [props.reportId]);

  // 営業報告取得
  const handleGetReport = async () => {
    try {
      const res = await getSalesreport(props.reportId);
      setReport(res.data.salesreport);
    } catch (e) {
      setErr({severity: "error", message: "営業報告取得エラー"});
    } 
    setIsLoading(false);
  }

  // 閉じるボタン押下時の処理
  const handleClose = () => {
    if(updateFlg){
      props.close(true);
    } else {
      props.close();
    }
    setReport(initReport);
    setUpdateFlg(false);
    setErr({severity: null, message: ""});
  }

  // 詳細画面終了
  const closeUpd = (refresh?: boolean) => {
    setShowUpd(false);
    if(refresh){
      setIsLoading(true);
      handleGetReport();
      setUpdateFlg(true);
    }
  }

  return (
    <>
      { props.show ? (
        <div className="overlay-dark">
          <Box component='div' sx={{ backgroundColor: '#fff', height: '90%', width: '60vw', minWidth: '400px', border: "0.5px solid #000", boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>
            <AppBar position='static'>
              <Toolbar variant="dense">
                <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>営業報告詳細</Typography>
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

            {(err.severity) &&
              <Stack sx={{width: '100%'}} spacing={1}>
                <Alert severity={err.severity}>{err.message}</Alert>
              </Stack>
            }
            
            <Box component='div' sx={{mt: 2, mx: 'auto', width: '95%'}} >
              <Button size="large" color='primary' onClick={() => setShowUpd(true)} disabled={props.isClosing}>変更</Button>
            </Box>

            <TableContainer component={Paper} sx={{ my: 2, mx: 'auto', px: 2, width: '95%' }}>
              <Table sx={{ width: '100%', height: err.severity ? 'calc(100% - 50px)' : '100%', overflow: 'none' }} stickyHeader aria-label="prospects table">
                <TableBody>
                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <CustomCell sx={{ width: 150 }}>概要</CustomCell>
                    <CustomCell sx={{ width: 'auto' }}>{report.topics}</CustomCell>
                  </TableRow>
                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <CustomCell>報告日</CustomCell>
                    <CustomCell>{formatDateZero(report.reportDate, dateDispForm)}</CustomCell>
                  </TableRow>
                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <CustomCell>報告者</CustomCell>
                    <CustomCell>{report.makeName}</CustomCell>
                  </TableRow>
                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <CustomCell>アクション</CustomCell>
                    <CustomCell>{report.salesactionName}</CustomCell>
                  </TableRow>
                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <CustomCell>内容</CustomCell>
                    <CustomCell sx={{ whiteSpace: 'pre-wrap' }}>{report.content}</CustomCell>
                  </TableRow>
                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <CustomCell>最終更新日</CustomCell>
                    <CustomCell>{formatDateZero(report.updatedAt, dateDispForm)}</CustomCell>
                  </TableRow>
                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <CustomCell>最終更新者</CustomCell>
                    <CustomCell>{report.updateName}</CustomCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>            
          </Box>
          <Loading isLoading={isLoading} />
          <ReportUpdPage show={showUpd} reportId={props.reportId} close={closeUpd} />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
export default ReportShowPage;
