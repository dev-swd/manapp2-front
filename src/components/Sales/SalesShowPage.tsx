import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from './../../App';
import { AlertType } from './../common/cmnType';
import { cmnProps } from './../common/cmnConst';
import { getProspect } from '../../lib/api/prospect';
import { formatDateZero, formatDateTimeZero } from '../../lib/common/dateCom';
import Loading from '../common/Loading';
import ConfirmDlg, { ConfirmParam } from './../common/ConfirmDlg';
import SalesUpdPage from './SalesUpdPage';
import SalesClosePage from './SalesClosePage';
import { closingProspect, closingParam } from '../../lib/api/prospect';
import { isEmpty } from '../../lib/common/isEmpty';

import Box from '@mui/material/Box';
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
const datetimeDispForm = "YYYY年MM月DD日 HH:MI:SS";

const initProspect: Prospect = {
  name: "",
  divisionId: null,
  depName: "",
  divCode: "",
  divName: "",
  makeId: null,
  makeName: "",
  updateId: null,
  updateName: "",
  companyName: "",
  departmentName: "",
  personInChargeName: "",
  phone: "",
  fax: "",
  email: "",
  productId: null,
  productName: "",
  leadId: null,
  leadName: "",
  leadPeriodKbn: "",
  leadPeriod: null,
  content: "",
  periodFr: null,
  periodTo: null,
  mainPersonId: null,
  mainPersonName: "",
  orderAmount: null,
  salesChannels: "",
  salesPerson: "",
  closingDate: null,
  createdAt: null,
  updatedAt: null,
}
type Prospect = {
  name: string;
  divisionId: number | null;
  depName: string;
  divCode: string;
  divName: string;
  makeId: number | null;
  makeName: string;
  updateId: number | null;
  updateName: string;
  companyName: string;
  departmentName: string;
  personInChargeName: string;
  phone: string;
  fax: string;
  email: string;
  productId: number | null;
  productName: string;
  leadId: number | null;
  leadName: string;
  leadPeriodKbn: string;
  leadPeriod: number | null;
  content: string;
  periodFr: Date | null;
  periodTo: Date | null;
  mainPersonId: number | null;
  mainPersonName: string;
  orderAmount: number | null;
  salesChannels: string;
  salesPerson: string;
  closingDate: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}
type Props = {
  prospectId: number | null;
  setIsClosing: (isClosing: boolean) => void;
  setIsUpdate: (isUpdate: boolean) => void;
}
const SalesShowPage = (props: Props) => {
  const { currentUser } = useContext(GlobalContext);
  const [prospect, setProspect] = useState<Prospect>(initProspect);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [showUpd, setShowUpd] = useState<boolean>(false);
  const [showClosing, setShowClosing] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<ConfirmParam>( { message: "", tag: "", width: null });

  // 初期処理
  useEffect(() => {
    if(props.prospectId){
      setIsLoading(true);
      handleGetProspect();
    }
  }, [props.prospectId]);

  // 案件情報取得
  const handleGetProspect = async () => {
    try {
      const res = await getProspect(props.prospectId);
      setProspect(res.data.prospect);
      if(res.data.prospect.closingDate){
        props.setIsClosing(true);
      } else {
        props.setIsClosing(false);
      }
    } catch (e) {
      setErr({severity: "error", message: "案件情報取得エラー"});
    } 
    setIsLoading(false);
  }

  // 変更画面終了
  const closeUpd = (refresh?: boolean) => {
    setShowUpd(false);
    if(refresh){
      setIsLoading(true);
      handleGetProspect();
      props.setIsUpdate(true);
    }
  }

  // 受注確定画面終了
  const closeClosing = (refresh?: boolean) => {
    setShowClosing(false);
    if(refresh){
      setIsLoading(true);
      handleGetProspect();
      props.setIsUpdate(true);
    }
  }

  // 受注取消
  const handleClosingCancel = () => {
    setConfirm({
      message: "受注確定を取り消します。よろしいですか？",
      tag: "",
      width: 400
    });
  }

  // 確認ダイアログでOKの場合の処理
  const handleConfirmOK = (dummy: string) => {
    setConfirm({
      message: "",
      tag: "",
      width: null
    });
    setIsLoading(true);
    saveSales();
  }

  // 登録処理
  const saveSales = async () => {
    const params: closingParam = {
      closingDate: null,
      updateId: currentUser.id,
    }
    try {
      const res = await closingProspect(props.prospectId, params);
      if (res.status === 200){
        setIsLoading(true);
        handleGetProspect();
        props.setIsUpdate(true);
      } else {
        setErr({severity: "error", message: "案件情報更新エラー(" + res.status + ")"});
      }
    } catch (e) {
      setErr({severity: "error", message: "案件情報更新エラー"});
    }
    setIsLoading(false);
  }

  // 確認ダイアログでキャンセルの場合の処理
  const handleCofirmCancel = () => {
    setConfirm({
      message: "",
      tag: "",
      width: null
    });
  }

  const emptyToBlank = (v: any) => {
    if(isEmpty(v)){
      return "";
    } else {
      return v;
    }
  }

  // 画面編集
  return (
    <>
      <Box component='div' sx={{ p: 2, backgroundColor: '#fff', height: '100%', width: '100%', position: 'relative' }}>

        {(err.severity) &&
          <Stack sx={{width: '100%'}} spacing={1}>
            <Alert severity={err.severity}>{err.message}</Alert>
          </Stack>
        }

        { prospect.closingDate ? (
          <Box component='div' sx={{mb: 1, mx: 'auto', width: '100%'}} >
            <Button size="large" color='primary' onClick={() => handleClosingCancel()}>受注取消</Button>
          </Box>
        ) : (
          <Box component='div' sx={{mb: 1, mx: 'auto', width: '100%'}} >
            <Button size="large" color='primary' onClick={() => setShowUpd(true)}>変更</Button>
            <Button size="large" color='primary' onClick={() => setShowClosing(true)}>受注確定</Button>
          </Box>
        )}

        <TableContainer component={Paper} sx={{ width: '100%', height: err.severity ? 'calc(100% - 100px)' : 'calc(100% - 50px)' }}>
          <Table sx={{ width: '100%', overflow: 'none' }} stickyHeader aria-label="prospects table">
            <TableBody>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <CustomCell sx={{ width: 150 }}>案件名</CustomCell>
                <CustomCell sx={{ width: 'auto' }}>{prospect.name}</CustomCell>
              </TableRow>
              { prospect.closingDate && 
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <CustomCell sx={{ fontWeight: 'bold', color: 'rgba(0, 100, 0, 1)' }}>受注確定日</CustomCell>
                  <CustomCell sx={{ fontWeight: 'bold', color: 'rgba(0, 100, 0, 1)' }}>{formatDateZero(prospect.closingDate, dateDispForm)}</CustomCell>
                </TableRow>    
              }
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <CustomCell>顧客会社名</CustomCell>
                <CustomCell>{prospect.companyName}</CustomCell>
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <CustomCell>顧客部署名</CustomCell>
                <CustomCell>{prospect.departmentName}</CustomCell>
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <CustomCell>顧客担当者名</CustomCell>
                <CustomCell>{prospect.personInChargeName}</CustomCell>
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <CustomCell>顧客電話番号</CustomCell>
                <CustomCell>{prospect.phone}</CustomCell>
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <CustomCell>顧客Fax</CustomCell>
                <CustomCell>{prospect.fax}</CustomCell>
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <CustomCell>顧客Email</CustomCell>
                <CustomCell>{prospect.email}</CustomCell>
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <CustomCell>概要</CustomCell>
                <CustomCell sx={{ whiteSpace: 'pre-wrap' }}>{prospect.content}</CustomCell>
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <CustomCell>想定期間</CustomCell>
                <CustomCell>{`${formatDateZero(prospect.periodFr, dateDispForm)}　〜　${formatDateZero(prospect.periodTo, dateDispForm)}`}</CustomCell>
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <CustomCell>想定受注金額</CustomCell>
                <CustomCell>{`¥ ${prospect.orderAmount?.toLocaleString() || ""}`}</CustomCell>
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <CustomCell>商材</CustomCell>
                <CustomCell>{prospect.productName}</CustomCell>
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <CustomCell>リードレベル</CustomCell>
                <CustomCell>{prospect.leadName}</CustomCell>
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <CustomCell>担当部門</CustomCell>
                <CustomCell>{prospect.divCode==="dep" ? emptyToBlank(prospect.depName) : `${emptyToBlank(prospect.depName)}　${emptyToBlank(prospect.divName)}`}</CustomCell>
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <CustomCell>主担当</CustomCell>
                <CustomCell>{prospect.mainPersonName}</CustomCell>
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <CustomCell>商流</CustomCell>
                <CustomCell>{prospect.salesChannels}</CustomCell>
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <CustomCell>（商流）担当者</CustomCell>
                <CustomCell>{prospect.salesPerson}</CustomCell>
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <CustomCell>登録</CustomCell>
                <CustomCell>{`${formatDateTimeZero(prospect.createdAt, datetimeDispForm)}　${prospect.makeName}`}</CustomCell>
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <CustomCell>最終更新</CustomCell>
                <CustomCell>{`${formatDateTimeZero(prospect.updatedAt, datetimeDispForm)}　${prospect.updateName}`}</CustomCell>
              </TableRow>
            </TableBody>
          </Table>            
        </TableContainer>
        <Loading isLoading={isLoading} />
      </Box>
      <SalesUpdPage show={showUpd} prospectId={props.prospectId} close={closeUpd} />
      <SalesClosePage show={showClosing} prospectId={props.prospectId} closingDate={prospect.closingDate} close={closeClosing} />
      <ConfirmDlg confirm={confirm} handleOK={handleConfirmOK} handleCancel={handleCofirmCancel} />
    </>
  );
}
export default SalesShowPage;
