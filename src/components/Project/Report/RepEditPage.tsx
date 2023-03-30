import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from './../../../App';
import { AlertType } from './../../common/cmnType';
import { cmnProps, projectStatus } from './../../common/cmnConst';
import { formatDateZero } from '../../../lib/common/dateCom';
import ConfirmDlg, { ConfirmParam } from './../../common/ConfirmDlg';
import Loading from './../../common/Loading';
import { getReport, actualPhaseParam, reportUpdParam, updateReport } from '../../../lib/api/project';
import SelectEmployeeId from '../../common/SelectEmployeeId';
import InputNumber from '../../common/InputNumber';
import { integerOnly, decimalOnly } from '../../../lib/common/inputRegulation';
import { isEmpty } from '../../../lib/common/isEmpty';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from "@mui/material/MenuItem";
import { LocalizationProvider, DatePicker } from  '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import ja from 'date-fns/locale/ja'
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SendIcon from '@mui/icons-material/Send';
import Snackbar from '@mui/material/Snackbar';
import Drawer from '@mui/material/Drawer';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';

// DatePickerのためのStyle
const styles = {
  paperprops: {
    'div[role=presentation]': {
      display: 'flex',
      '& .PrivatePickersFadeTransitionGroup-root:first-of-type': {
        order: 2
      },
      '& .PrivatePickersFadeTransitionGroup-root:nth-of-type(2)': {
        order: 1,
        '& div::after':{
          content: '"年"'
        }
      },
      '& .MuiButtonBase-root': {
        order: 3
      }
    }
  }
}

const CustomCell = styled(TableCell)({
  fontSize: cmnProps.fontSize,
  fontFamily: cmnProps.fontFamily,
  padding: 5,
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const dateDispForm = "YYYY年MM月DD日";

type Props = {
  projectId: number | null;
}
const RepEditPage = (props: Props) => {
  const { currentUser } = useContext(GlobalContext);
  // プロジェクト情報
  const [number, setNumber] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [developmentPeriodFr, setDevelopmentPeriodFr] = useState<Date | null>(null);
  const [developmentPeriodTo, setDevelopmentPeriodTo] = useState<Date | null>(null);
  const [orderAmount, setOrderAmount] = useState<number | null>(null);
  const [customerPropertyKbn, setCustomerPropertyKbn] = useState<string>("");
  const [purchasingGoodsKbn, setPurchasingGoodsKbn] = useState<string>("");
  const [outsourcingKbn, setOutsourcingKbn] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  // 完了報告書
  const [reportId, setReportId] = useState<number | null>(null);
  const [makeDate, setMakeDate] = useState<Date | null>(null);
  const [makeId, setMakeId] = useState<{id:number | null, flg: boolean}>({id: null, flg: false});
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [actualWorkCost, setActualWorkCost] = useState<number | null>(null);
  const [actualWorkload, setActualWorkload] = useState<string>("");
  const [actualPurchasingCost, setActualPurchasingCost] = useState<number | null>(null);
  const [actualOutsourcingCost, setActualOutsourcingCost] = useState<number | null>(null);
  const [actualOutsourcingWorkload, setActualOutsourcingWorkload] = useState<string>("");
  const [actualExpensesCost, setActualExpensesCost] = useState<number | null>(null);
  const [customerPropertyAcceptResult, setCustomerPropertyAcceptResult] = useState<string>("");
  const [customerPropertyAcceptRemarks, setCustomerPropertyAcceptRemarks] = useState<string>("");
  const [customerPropertyUsedResult, setCustomerPropertyUsedResult] = useState<string>("");
  const [customerPropertyUsedRemarks, setCustomerPropertyUsedRemarks] = useState<string>("");
  const [purchasingGoodsAcceptResult, setPurchasingGoodsAcceptResult] = useState<string>("");
  const [purchasingGoodsAcceptRemarks, setPurchasingGoodsAcceptRemarks] = useState<string>("");
  const [outsourcingEvaluate1, setOutsourcingEvaluate1] = useState<string>("");
  const [outsourcingEvaluateRemarks1, setOutsourcingEvaluateRemarks1] = useState<string>("");
  const [outsourcingEvaluate2, setOutsourcingEvaluate2] = useState<string>("");
  const [outsourcingEvaluateRemarks2, setOutsourcingEvaluateRemarks2] = useState<string>("");
  const [meetingCount, setMeetingCount] = useState<number | null>(null);
  const [phoneCount, setPhoneCount] = useState<number | null>(null);
  const [mailCount, setMailCount] = useState<number | null>(null);
  const [faxCount, setFaxCount] = useState<number | null>(null);
  const [specificationChangeCount, setSpecificationChangeCount] = useState<number | null>(null);
  const [designErrorCount, setDesignErrorCount] = useState<number | null>(null);
  const [othersCount, setOthersCount] = useState<number | null>(null);
  const [correctiveActionCount, setCorrectiveActionCount] = useState<number | null>(null);
  const [preventiveMeasuresCount, setPreventiveMeasuresCount] = useState<number | null>(null);
  const [projectMeetingCount, setProjectMeetingCount] = useState<number | null>(null);
  const [statisticalConsideration, setStatisticalConsideration] = useState<string>("");
  const [qualitygoalsEvaluate, setQualitygoalsEvaluate] = useState<string>("");
  const [totalReport, setTotalReport] = useState<string>("");
  // 工程実績
  const [phases, setPhases] = useState<actualPhaseParam[]>([]);

  const [err, setErr] = useState<AlertType>({severity: null, message: ""});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<ConfirmParam>( { message: "", tag: "", width: null });
  const [snackbar, setSnackbar] = useState<{show: boolean, message: string}>({show: false, message: ""});
  const [inputErr, setInputErr] = useState<AlertType[]>([]);
  const [showErr, setShowErr] = useState<boolean>(false);

  // 初期処理
  useEffect(() => {
    if(props.projectId){
      setIsLoading(true);
      handleGetReport();
    }
  }, [props.projectId]);

  // 完了報告書取得
  const handleGetReport = async () => {
    try {
      const res = await getReport(props.projectId);
      // プロジェクト情報
      setNumber(res.data.project.number ?? '');
      setName(res.data.project.name ?? '');
      setDevelopmentPeriodFr(res.data.project.developmentPeriodFr);
      setDevelopmentPeriodTo(res.data.project.developmentPeriodTo);
      setOrderAmount(res.data.project.orderAmount);
      setCustomerPropertyKbn(res.data.project.customerPropertyKbn);
      setPurchasingGoodsKbn(res.data.project.purchasingGoodsKbn);
      setOutsourcingKbn(res.data.project.outsourcingKbn)
      // 完了報告書情報
      if(res.data.report){
        setReportId(res.data.report.id);
        setMakeDate(res.data.report.makeDate);
        setMakeId({id: res.data.project.makeId, flg: true});
        setDeliveryDate(res.data.report.deliveryDate);
        setActualWorkCost(res.data.report.actualWorkCost);
        setActualWorkload(res.data.report.actualWorkload ?? '');
        setActualPurchasingCost(res.data.report.actualPurchasingCost);
        setActualOutsourcingCost(res.data.report.actualOutsourcingCost);
        setActualOutsourcingWorkload(res.data.report.actualOutsourcingWorkload ?? '');
        setActualExpensesCost(res.data.report.actualExpensesCost);
        setCustomerPropertyAcceptResult(res.data.report.customerPropertyAcceptResult);
        setCustomerPropertyAcceptRemarks(res.data.report.customerPropertyAcceptRemarks);
        setCustomerPropertyUsedResult(res.data.report.customerPropertyUsedResult);
        setCustomerPropertyUsedRemarks(res.data.report.customerPropertyUsedRemarks)
        setPurchasingGoodsAcceptResult(res.data.report.purchasingGoodsAcceptResult)
        setPurchasingGoodsAcceptRemarks(res.data.report.purchasingGoodsAcceptRemarks);
        setOutsourcingEvaluate1(res.data.report.outsourcingEvaluate1);
        setOutsourcingEvaluateRemarks1(res.data.report.outsourcingEvaluateRemarks1);
        setOutsourcingEvaluate2(res.data.report.outsourcingEvaluate2);
        setOutsourcingEvaluateRemarks2(res.data.report.outsourcingEvaluateRemarks2);
        setMeetingCount(res.data.report.meetingCount);
        setPhoneCount(res.data.report.phoneCount);
        setMailCount(res.data.report.mailCount);
        setFaxCount(res.data.report.faxCount);
        setSpecificationChangeCount(res.data.report.specificationChangeCount);
        setDesignErrorCount(res.data.report.designErrorCount);
        setOthersCount(res.data.report.othersCount);
        setCorrectiveActionCount(res.data.report.correctiveActionCount);
        setPreventiveMeasuresCount(res.data.report.preventiveMeasuresCount);
        setProjectMeetingCount(res.data.report.projectMeetingCount);
        setStatisticalConsideration(res.data.report.statisticalConsideration);
        setQualitygoalsEvaluate(res.data.report.qualitygoalsEvaluate);
        setTotalReport(res.data.report.totalReport);
      } else {
        setMakeId({id: null, flg: true});
      }
      // 工程実績
      setPhases(res.data.phases);
    } catch (e) {
      setErr({severity: "error", message: "完了報告書取得エラー"});
    } 
    setIsLoading(false);
  }

  // 作成者変更時の処理
  const handleChangeMakeId = (id: number | null) => {
    setMakeId({id: id, flg: true});
  }

  // 粗利計算
  const calcGrossProfit = () => {
    let oa: number = orderAmount ? orderAmount : 0;
    let pwc: number = actualWorkCost ? actualWorkCost : 0;
    let ppc: number = actualPurchasingCost ? actualPurchasingCost : 0;
    let poc: number = actualOutsourcingCost ? actualOutsourcingCost : 0;
    let pec: number = actualExpensesCost ? actualExpensesCost : 0;
    return oa - pwc - ppc - poc - pec;
  }

  // 工程・レビュー実施回数入力
  const handleChangeReviewCount = (i: number, value: number | null) => {
    const tmpPhases = [...phases]
    tmpPhases[i].reviewCount = value;
    setPhases(tmpPhases);
  }

  // 工程・予定金額入力
  const handleChangePlannedCost = (i: number, value: number | null) => {
    const tmpPhases = [...phases]
    tmpPhases[i].plannedCost = value;
    setPhases(tmpPhases);
  }

  // 工程・実績金額入力
  const handleChangeActualCost = (i: number, value: number | null) => {
    const tmpPhases = [...phases]
    tmpPhases[i].actualCost = value;
    setPhases(tmpPhases);
  }

  // 工程・検収日入力
  const handleChangeAcceptCompDate = (i: number, value: Date | null) => {
    const tmpPhases = [...phases]
    tmpPhases[i].acceptCompDate = value;
    setPhases(tmpPhases);
  }

  // 工程・出荷番号
  const handleChangeShipNumber = (i: number, value: string) => {
    const tmpPhases = [...phases]
    tmpPhases[i].shipNumber = value;
    setPhases(tmpPhases);
  }

  // コミュニケーション回数計算
  const calcCommunicationCount = () => {
    let meetingCnt: number = meetingCount ? meetingCount : 0;
    let phoneCnt: number = phoneCount ? phoneCount : 0;
    let mailCnt: number = mailCount ? mailCount : 0;
    let faxCnt: number = faxCount ? faxCount : 0;
    return meetingCnt + phoneCnt + mailCnt + faxCnt;
  }

  // 設計変更回数計算
  const calcDesignChangesCount = () => {
    let sc: number = specificationChangeCount ? specificationChangeCount : 0;
    let dc: number = designErrorCount ? designErrorCount : 0;
    let oc: number = othersCount ? othersCount : 0;
    return sc + dc + oc;
  }

  // 改善一覧件数計算
  const calcImprovementCount = () => {
    let cc: number = correctiveActionCount ? correctiveActionCount : 0;
    let pc: number = preventiveMeasuresCount ? preventiveMeasuresCount : 0;
    return cc + pc;
  }

  // 一時保存
  const handleUpdate = () => {
    setConfirm({
      message: "この内容で一時保存します。よろしいですか？",
      tag: "",
      width: null
    });
  }

  // 提出
  const handleSubmit = () => {
    // 入力チェック
    if (!checkInput()) {
      setStatus(projectStatus.reportAuditing);
      setConfirm({
        message: "この内容で完了報告書報告書を提出します。よろしいですか？",
        tag: "",
        width: null
      });
    } else {
      setErr({severity: "error", message: "入力内容に誤りがあります。（クリックすると詳細が確認できます）"});
    }
  }

  // 入力チェック
  const checkInput = () => {
    let err: AlertType[] = [];
  
    // 作成日
    if (isEmpty(makeDate)) {
      err[err.length] = {severity: 'error', message: "作成日が未入力です。"};
    }

    // 作成者
    if (isEmpty(makeId)) {
      err[err.length] = {severity: 'error', message: "作成者が未選択です。"};
    }

    // 納品日
    if (isEmpty(deliveryDate)) {
      err[err.length] = {severity: 'error', message: "納品日が未入力です。"};
    }
  
    // 顧客所有物
    if(customerPropertyKbn==="有"){
      // 顧客所有物「有」の場合必須
      if(isEmpty(customerPropertyAcceptResult) || isEmpty(customerPropertyUsedResult)){
        err[err.length] = {severity: 'error', message: "顧客所有物「有」の場合、受入結果と使用結果は必須項目です。"};
      }
      if(customerPropertyAcceptResult==="不良" && isEmpty(customerPropertyAcceptRemarks)){
        err[err.length] = {severity: 'error', message: "顧客所有物・受入結果が不良の場合、備考には対応内容を記入してください。"};
      }
      if(customerPropertyUsedResult==="不良" && isEmpty(customerPropertyUsedRemarks)){
        err[err.length] = {severity: 'error', message: "顧客所有物・使用結果が不良の場合、備考には対応内容を記入してください。"};
      }
    }

    // 仕入品
    if(purchasingGoodsKbn==="有"){
      // 仕入品「有」の場合必須
      if(isEmpty(purchasingGoodsAcceptResult)){
        err[err.length] = {severity: 'error', message: "仕入品「有」の場合、受入結果は必須項目です。"};
      }
      if(purchasingGoodsAcceptResult==="不良" && isEmpty(purchasingGoodsAcceptRemarks)){
        err[err.length] = {severity: 'error', message: "仕入品・受入結果が不良の場合、備考には対応内容を記入してください。"};
      }
    }

    // 外注評価
    if(outsourcingKbn==="有"){
      // 外部委託「有」の場合必須
      if(isEmpty(outsourcingEvaluate1) || isEmpty(outsourcingEvaluate2)){
        err[err.length] = {severity: 'error', message: "外部委託「有」の場合、外注先は必須項目です。"};
      }
      if((!isEmpty(outsourcingEvaluate1) && isEmpty(outsourcingEvaluateRemarks1)) || (!isEmpty(outsourcingEvaluate2) && isEmpty(outsourcingEvaluateRemarks2))){
        err[err.length] = {severity: 'error', message: "外注先が入力されている場合、評価は必須項目です。"};
      }
    }

    // 受注範囲
    let cntErr: boolean = false;
    let acceptErr: boolean = false;
    phases.forEach((p,i) => {
      if(isEmpty(p.reviewCount)){
        cntErr = true;
      }
      if(isEmpty(p.acceptCompDate)){
        acceptErr = true;
      }
    });
    if(cntErr){
      err[err.length] = {severity: 'error', message: "受注範囲のレビュー回数に未入力があります。"};
    }
    if(acceptErr){
      err[err.length] = {severity: 'error', message: "受注範囲の検収日に未入力があります。"};
    }

    // 統計数値
    if(isEmpty(meetingCount)){
      err[err.length] = {severity: 'error', message: "統計数値の会議件数が未入力です。"};
    }
    if(isEmpty(phoneCount)){
      err[err.length] = {severity: 'error', message: "統計数値の電話件数が未入力です。"};
    }
    if(isEmpty(mailCount)){
      err[err.length] = {severity: 'error', message: "統計数値のメール件数が未入力です。"};
    }
    if(isEmpty(faxCount)){
      err[err.length] = {severity: 'error', message: "統計数値のFAX件数が未入力です。"};
    }
    if(isEmpty(specificationChangeCount)){
      err[err.length] = {severity: 'error', message: "統計数値の仕変件数が未入力です。"};
    }
    if(isEmpty(designErrorCount)){
      err[err.length] = {severity: 'error', message: "統計数値の設計ミス件数が未入力です。"};
    }
    if(isEmpty(othersCount)){
      err[err.length] = {severity: 'error', message: "統計数値のその他件数が未入力です。"};
    }
    if(isEmpty(correctiveActionCount)){
      err[err.length] = {severity: 'error', message: "統計数値の是正処置件数が未入力です。"};
    }
    if(isEmpty(preventiveMeasuresCount)){
      err[err.length] = {severity: 'error', message: "統計数値の予防措置件数が未入力です。"};
    }
    if(isEmpty(projectMeetingCount)){
      err[err.length] = {severity: 'error', message: "統計数値のプロジェクトミーティング件数が未入力です。"};
    }

    // 統計的考察
    if(isEmpty(statisticalConsideration)){
      err[err.length] = {severity: 'error', message: "統計的考察が未入力です。"};
    }

    // 品質目標達成度
    if(isEmpty(qualitygoalsEvaluate)){
      err[err.length] = {severity: 'error', message: "品質目標達成度が未入力です。"};
    }

    // 完了報告
    if(isEmpty(totalReport)){
      err[err.length] = {severity: 'error', message: "完了報告が未入力です。"};
    }

    if (err.length > 0) {
      setInputErr(err);
      return true;
    } else {
      return false;
    }

  }

  // 確認ダイアログでOKの場合の処理
  const handleConfirmOK = (dummy: string) => {
    setConfirm({
      message: "",
      tag: "",
      width: null
    });
    setIsLoading(true);
    saveProject();
  }

  // プロジェクト更新
  const saveProject = async () => {
    try {
      const res = await updateReport(reportId, updateParams);
      if (res.status === 200 && res.data.status === 200){
        setSnackbar({show: true, message: "更新しました。"});
        setInputErr([]);
        setErr({severity: null, message: ""});
        // データリフレッシュ
        handleGetReport();
      } else {
        setErr({severity: "error", message: `完了報告書更新エラー(${res.status})`});
        setIsLoading(false);    
      }
    } catch (e) {
      setErr({severity: "error", message: "完了報告書更新エラー"});
      setIsLoading(false);    
    }
  }

  // 更新パラメータセット
  const updateParams: reportUpdParam = {
    makeDate: makeDate,
    makeId: makeId.id,
    deliveryDate: deliveryDate,
    actualWorkCost: actualWorkCost,
    actualWorkload: Number(actualWorkload),
    actualPurchasingCost: actualPurchasingCost,
    actualOutsourcingCost: actualOutsourcingCost,
    actualOutsourcingWorkload: Number(actualOutsourcingWorkload),
    actualExpensesCost: actualExpensesCost,
    grossProfit: calcGrossProfit(),
    customerPropertyAcceptResult: customerPropertyAcceptResult,
    customerPropertyAcceptRemarks: customerPropertyAcceptRemarks,
    customerPropertyUsedResult:customerPropertyUsedResult,
    customerPropertyUsedRemarks: customerPropertyUsedRemarks,
    purchasingGoodsAcceptResult: purchasingGoodsAcceptResult,
    purchasingGoodsAcceptRemarks: purchasingGoodsAcceptRemarks,
    outsourcingEvaluate1: outsourcingEvaluate1,
    outsourcingEvaluateRemarks1: outsourcingEvaluateRemarks1,
    outsourcingEvaluate2: outsourcingEvaluate2,
    outsourcingEvaluateRemarks2: outsourcingEvaluateRemarks2,
    communicationCount: calcCommunicationCount(),
    meetingCount: meetingCount,
    phoneCount: phoneCount,
    mailCount: mailCount,
    faxCount: faxCount,
    designChangesCount: calcDesignChangesCount(),
    specificationChangeCount: specificationChangeCount,
    designErrorCount: designErrorCount,
    othersCount: othersCount,
    improvementCount: calcImprovementCount(),
    correctiveActionCount: correctiveActionCount,
    preventiveMeasuresCount: preventiveMeasuresCount,
    projectMeetingCount: projectMeetingCount,
    statisticalConsideration: statisticalConsideration,
    qualitygoalsEvaluate: qualitygoalsEvaluate,
    totalReport: totalReport,
    createdId: currentUser.id,
    updatedId: currentUser.id,
    project: {
      id: props.projectId,
      status: status
    },
    phases: phases
  }

  // 確認ダイアログでキャンセルの場合の処理
  const handleCofirmCancel = () => {
    setConfirm({
      message: "",
      tag: "",
      width: null
    });
    setStatus("");
  }

  // snackbar close処理
  const handleSnackbarClose = () => {
    setSnackbar({show: false, message: ""});
  }

  // 画面編集
  return (
    <Box component='div' sx={{ width: '100%', height: '100%' }}>

      {(err.severity && !showErr) &&
        <Stack sx={{width: '100%'}} spacing={1} mb={3} >
          {inputErr.length ? (
            <Alert severity={err.severity} onClick={(e) => setShowErr(true)}>{err.message}</Alert>
          ) : (
            <Alert severity={err.severity}>{err.message}</Alert>
          )}
        </Stack>
      }

      <Drawer
        anchor={'right'}
        open={showErr}
        variant="persistent"
      >
        <Box component='div' sx={{ mt: 6, backgroundColor: '#fff', height: 'inherit', width: '40vw', borderLeft: '1px solid #000' }}>
          <Box component='div' sx={{ mt: 3, mr: 2, textAlign: 'right' }}>
            <Button
                color="primary"
                endIcon={<KeyboardArrowRightIcon />}
                onClick={() => setShowErr(false)}
              >
                Close
            </Button>
          </Box>
          <Box component='div' sx={{ height: '80vh', m: 2, overflowY: 'auto' }}>
            {inputErr.map((e,i) => (
              <Stack sx={{p: 1}} key={`err-${i}`}>
                <Alert severity={e.severity ? e.severity! : 'error'}>{e.message}</Alert>
              </Stack>
            ))}
          </Box>
        </Box>
      </Drawer>
      
      <Button 
        size="small" 
        variant="contained" 
        endIcon={<SaveAltIcon />} 
        onClick={(e) => handleUpdate()} 
        style={{marginRight:10}}
      >
        一時保存
      </Button>
      <Button 
        size="small" 
        variant="contained" 
        endIcon={<SendIcon />} 
        onClick={(e) => handleSubmit()}
      >
        提出
      </Button>

      <TableContainer component={Paper} sx={{ mt: 2, height: '95%', border: '0.5px #c0c0c0 solid' }}>
        <Table sx={{ width: '100%' }} stickyHeader aria-label="project table">
          <TableBody>
            <TableRow sx={{ height: 60, '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell sx={{ width: 180 }}>プロジェクトNo.</CustomCell>
              <CustomCell sx={{ width: 'auto' }}>{number}</CustomCell>
            </TableRow>
            <TableRow sx={{ height: 60, '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>プロジェクト名</CustomCell>
              <CustomCell>{name}</CustomCell>
            </TableRow>
            <TableRow sx={{ height: 60, '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>開発期間</CustomCell>
              <CustomCell>
                {`${formatDateZero(developmentPeriodFr, dateDispForm)}　〜　${formatDateZero(developmentPeriodTo, dateDispForm)}`}
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: 60, '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>作成</CustomCell>
              <CustomCell>
                <Box component='div' sx={{ display: 'flex', alignItems: 'center'}}>
                  <Box component='div' sx={{ mr: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} >
                      <DatePicker
                        label="作成日"
                        inputFormat="yyyy年MM月dd日"
                        mask='____年__月__日'
                        value={makeDate}
                        onChange={(value: Date | null) => setMakeDate(value)}
                        renderInput={(params: any) => <TextField 
                                                  {...params}
                                                  error={false} 
                                                  variant="outlined" 
                                                  size="small" 
                                                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }} 
                                                />}
                        PaperProps={{ sx: styles.paperprops }}
                      />
                    </LocalizationProvider>
                  </Box>
                  <SelectEmployeeId 
                    empId={makeId.id}
                    empGet={makeId.flg}
                    setEmpId={handleChangeMakeId}
                    setErr={setErr}
                    label="作成者"
                    width={230}
                  />
                </Box>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: 60, '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>納品日</CustomCell>
              <CustomCell>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} >
                  <DatePicker
                    label="納品日"
                    inputFormat="yyyy年MM月dd日"
                    mask='____年__月__日'
                    value={deliveryDate}
                    onChange={(value: Date | null) => setDeliveryDate(value)}
                    renderInput={(params: any) => <TextField 
                                              {...params}
                                              error={false} 
                                              variant="outlined" 
                                              size="small" 
                                              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }} 
                                            />}
                    PaperProps={{ sx: styles.paperprops }}
                  />
                </LocalizationProvider>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: '60px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>受注金額</CustomCell>
              <CustomCell>{"¥" + (orderAmount ?? '0').toLocaleString()}</CustomCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>実績値</CustomCell>
              <CustomCell>
                <Box component="div" sx={{ mt: 0.7, display: 'flex', alignItems: 'center' }}>
                  <InputNumber 
                    value={actualWorkCost}
                    setValue={setActualWorkCost}
                    label="作業費"
                    maxLength={10}
                    width="230px"
                    id="actualWorkCost"
                    name="actualWorkCost"
                    startChar='¥'
                  />
                  <Box component="span" sx={{ alignSelf: 'center', textAlign: 'center', width: '30px', height: '20px' }}>（</Box>
                  <TextField
                    id="actualWorkload"
                    name="actualWorkload"
                    label="作業工数"
                    value={actualWorkload}
                    variant="outlined"
                    size="small"
                    sx={{ width: '90px' }}
                    inputProps={{maxLength:6, style: {textAlign: 'right', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                    InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                    onChange={(e) => setActualWorkload(decimalOnly(e.target.value))}
                  />
                  <Box component="span" sx={{ alignSelf: 'center', textAlign: 'center', width: '50px', height: '20px' }}>人月）</Box>
                </Box>
                <Box component="div" sx={{ mt: 1.5, display: 'flex', alignItems: 'center' }}>
                  <InputNumber 
                    value={actualOutsourcingCost}
                    setValue={setActualOutsourcingCost}
                    label="外注費"
                    maxLength={10}
                    width="230px"
                    id="actualOutsourcingCost"
                    name="actualOutsourcingCost"
                    startChar='¥'
                  />
                  <Box component="span" sx={{alignSelf: 'center', textAlign: 'center', width: '30px', height: '20px' }}>（</Box>
                  <TextField
                    id="actualOutsourcingWorkload"
                    name="actualOutsourcingWorkload"
                    label="外注工数"
                    value={actualOutsourcingWorkload}
                    variant="outlined"
                    size="small"
                    sx={{ width: '90px' }}
                    inputProps={{maxLength:6, style: {textAlign: 'right', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                    InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                    onChange={(e) => setActualOutsourcingWorkload(decimalOnly(e.target.value))}
                  />
                  <Box component="span" sx={{alignSelf: 'center', textAlign: 'center', width: '50px', height: '20px' }}>人月）</Box>
                </Box>
                <Box component="div" sx={{ mt: 1.5 }}>
                  <InputNumber 
                    value={actualPurchasingCost}
                    setValue={setActualPurchasingCost}
                    label="仕入費"
                    maxLength={10}
                    width="230px"
                    id="actualPurchasingCost"
                    name="actualPurchasingCost"
                    startChar='¥'
                  />
                </Box>
                <Box component="div" sx={{ mt: 1.5, mb: 0.7 }}>
                  <InputNumber 
                    value={actualExpensesCost}
                    setValue={setActualExpensesCost}
                    label="経費"
                    maxLength={10}
                    width="230px"
                    id="actualExpensesCost"
                    name="actualExpensesCost"
                    startChar='¥'
                  />
                </Box>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: '60px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>粗利</CustomCell>
              <CustomCell>
                <TextField
                  id="grossProfit"
                  name="grossProfit"
                  label="粗利"
                  value={"¥" + calcGrossProfit().toLocaleString()}
                  variant="outlined"
                  size="small"
                  sx={{ width: '230px', backgroundColor: '#f5f5f5' }}
                  inputProps={{ readOnly: true, style: {textAlign: 'right', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                />
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: '60px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>顧客所有物</CustomCell>
              <CustomCell>
                <Box component="div" sx={{ mt: 0.7, display: 'flex', alignItems: 'center' }}>
                  <FormControl variant="outlined" sx={{ mr: 3 }} size="small">
                    <InputLabel id="select-custom-property-accept-result-label" sx={{verticalAlign: 'middle', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}>受入結果</InputLabel>
                    <Select
                      labelId="select-custom-property-accept-result-label"
                      id="select-custom-property-accept-result"
                      label="受入結果"
                      value={ customerPropertyAcceptResult ?? ''}
                      onChange={(e) => setCustomerPropertyAcceptResult(e.target.value)}
                      sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily, width: 110}}
                    >
                      <MenuItem key={`custom-property-accept-result-1`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={"良好"}>良好</MenuItem>
                      <MenuItem key={`custom-property-accept-result-2`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={"不良"}>不良</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    id="customerPropertyAcceptRemarks"
                    name="customerPropertyAcceptRemarks"
                    label="受入結果備考"
                    value={customerPropertyAcceptRemarks}
                    variant="outlined"
                    size="small"
                    inputProps={{maxLength:30, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                    InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                    onChange={(e) => setCustomerPropertyAcceptRemarks(e.target.value)}
                  />
                </Box>
                <Box component="div" sx={{ mt: 1.2, mb: 0.7, display: 'flex', alignItems: 'center' }}>
                  <FormControl variant="outlined" sx={{ mr: 3 }} size="small">
                    <InputLabel id="select-custom-property-used-result-label" sx={{verticalAlign: 'middle', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}>使用結果</InputLabel>
                    <Select
                      labelId="select-custom-property-used-result-label"
                      id="select-custom-property-used-result"
                      label="使用結果"
                      value={ customerPropertyUsedResult ?? ''}
                      onChange={(e) => setCustomerPropertyUsedResult(e.target.value)}
                      sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily, width: 110}}
                    >
                      <MenuItem key={`custom-property-used-result-1`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={"良好"}>良好</MenuItem>
                      <MenuItem key={`custom-property-used-result-2`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={"不良"}>不良</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    id="customerPropertyUsedRemarks"
                    name="customerPropertyUsedRemarks"
                    label="使用結果備考"
                    value={customerPropertyUsedRemarks}
                    variant="outlined"
                    size="small"
                    inputProps={{maxLength:30, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                    InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                    onChange={(e) => setCustomerPropertyUsedRemarks(e.target.value)}
                  />
                </Box>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: '60px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>仕入品</CustomCell>
              <CustomCell>
                <Box component="div" sx={{ my: 0.7, display: 'flex', alignItems: 'center' }}>
                  <FormControl variant="outlined" sx={{ mr: 3 }} size="small">
                    <InputLabel id="select-purchasing-goods-accept-result-label" sx={{verticalAlign: 'middle', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}>受入結果</InputLabel>
                    <Select
                      labelId="select-purchasing-goods-accept-result-label"
                      id="select-purchasing-goods-accept-result"
                      label="受入結果"
                      value={ purchasingGoodsAcceptResult ?? ''}
                      onChange={(e) => setPurchasingGoodsAcceptResult(e.target.value)}
                      sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily, width: 110}}
                    >
                      <MenuItem key={`purchasing-goods-accept-result-1`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={"良好"}>良好</MenuItem>
                      <MenuItem key={`purchasing-goods-accept-result-2`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={"不良"}>不良</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    id="purchasingGoodsAcceptRemarks"
                    name="purchasingGoodsAcceptRemarks"
                    label="受入結果備考"
                    value={purchasingGoodsAcceptRemarks}
                    variant="outlined"
                    size="small"
                    inputProps={{maxLength:30, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                    InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                    onChange={(e) => setPurchasingGoodsAcceptRemarks(e.target.value)}
                  />
                </Box>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>外注評価</CustomCell>
              <CustomCell>
                <Box component="div" sx={{ mt: 0.7, display: 'flex', alignItems: 'center' }}>
                  <TextField
                    id="outsourcingEvaluate1"
                    name="outsourcingEvaluate1"
                    label="外注先"
                    value={outsourcingEvaluate1}
                    variant="outlined"
                    size="small"
                    sx={{ width: 270, mr: 1.5 }}
                    inputProps={{maxLength:20, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                    InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                    onChange={(e) => setOutsourcingEvaluate1(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    id="outsourcingEvaluateRemarks1"
                    name="outsourcingEvaluateRemarks1"
                    label="評価"
                    value={outsourcingEvaluateRemarks1}
                    variant="outlined"
                    size="small"
                    inputProps={{maxLength:50, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                    InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                    onChange={(e) => setOutsourcingEvaluateRemarks1(e.target.value)}
                  />
                </Box>
                <Box component="div" sx={{ mt: 0.7, display: 'flex', alignItems: 'center' }}>
                  <TextField
                    id="outsourcingEvaluate2"
                    name="outsourcingEvaluate2"
                    label="外注先"
                    value={outsourcingEvaluate2}
                    variant="outlined"
                    size="small"
                    sx={{ width: 270, mr: 1.5 }}
                    inputProps={{maxLength:20, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                    InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                    onChange={(e) => setOutsourcingEvaluate2(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    id="outsourcingEvaluateRemarks2"
                    name="outsourcingEvaluateRemarks2"
                    label="評価"
                    value={outsourcingEvaluateRemarks2}
                    variant="outlined"
                    size="small"
                    inputProps={{maxLength:50, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                    InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                    onChange={(e) => setOutsourcingEvaluateRemarks2(e.target.value)}
                  />
                </Box>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ minHeight: '100px', height: '100px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>受注範囲</CustomCell>
              <CustomCell>
                <TableContainer component={Paper}>
                  <Table sx={{ width: 1200 }} aria-label="phases table">
                    <TableHead>
                      <TableRow>
                        <CustomCell sx={{ width: 200 }}>工程</CustomCell>
                        <CustomCell sx={{ width: 200 }}>成果物</CustomCell>
                        <CustomCell sx={{ width: 110 }}>レビュー回数</CustomCell>
                        <CustomCell sx={{ width: 180 }}>予定金額</CustomCell>
                        <CustomCell sx={{ width: 180 }}>実績金額</CustomCell>
                        <CustomCell sx={{ width: 230 }}>検収日</CustomCell>
                        <CustomCell sx={{ width: 100 }}>No.</CustomCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {phases.map((p,i) => (
                        <TableRow key={`phase-${i}`} sx={{ minHeight: '50px', height: '50px', '&:last-child td, &:last-child th': { border: 0 } }}>
                          <CustomCell>{p.name}</CustomCell>
                          <CustomCell>
                            <Box sx={{ py: 1, whiteSpace: 'pre-wrap'}}>{p.deliverables}</Box>
                          </CustomCell>
                          <CustomCell>
                            <InputNumber 
                              value={p.reviewCount}
                              setValue={(v:number) => handleChangeReviewCount(i, v)}
                              label="回数"
                              maxLength={3}
                              width="80px"
                              id={`reviewCount-${i}`}
                              name="reviewCount"
                              endChar='回'
                            />
                          </CustomCell>
                          <CustomCell>
                            <InputNumber 
                              value={p.plannedCost}
                              setValue={(v:number) => handleChangePlannedCost(i, v)}
                              label="予定金額"
                              maxLength={10}
                              width="160px"
                              id={`plannedCost-${i}`}
                              name="plannedCost"
                              startChar='¥'
                            />
                          </CustomCell>
                          <CustomCell>
                            <InputNumber 
                              value={p.actualCost}
                              setValue={(v:number) => handleChangeActualCost(i, v)}
                              label="実績金額"
                              maxLength={10}
                              width="160px"
                              id={`actualCost-${i}`}
                              name="actualCost"
                              startChar='¥'
                            />
                          </CustomCell>
                          <CustomCell sx={{ pr: 2 }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} >
                              <DatePicker
                                label="検収日"
                                inputFormat="yyyy年MM月dd日"
                                mask='____年__月__日'
                                value={p.acceptCompDate}
                                onChange={(value: Date | null) => handleChangeAcceptCompDate(i, value)}
                                renderInput={(params: any) => <TextField 
                                                          {...params}
                                                          error={false} 
                                                          variant="outlined" 
                                                          size="small" 
                                                          InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }} 
                                                        />}
                                PaperProps={{ sx: styles.paperprops }}
                              />
                            </LocalizationProvider>
                          </CustomCell>
                          <CustomCell>
                            <TextField
                              fullWidth
                              id={`shipNumber-${i}`}
                              name="shipNumber"
                              label="No."
                              value={p.shipNumber}
                              variant="outlined"
                              size="small"
                              inputProps={{maxLength:6, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                              onChange={(e) => handleChangeShipNumber(i, integerOnly(e.target.value))}
                            />
                          </CustomCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ minHeight: '100px', height: '100px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>統計数値</CustomCell>
              <CustomCell>
                <TableContainer component={Paper}>
                  <Table sx={{ width: 1200 }} aria-label="phases table">
                    <TableBody>
                      <TableRow sx={{ height: '50px', '&:last-child td, &:last-child th': { border: 0 } }}>
                        <CustomCell sx={{ width: 200 }}>コミュニケーション記録</CustomCell>
                        <CustomCell sx={{ width: 1000 }}>
                          <Box component="div" sx={{ my: 0.7, display: 'flex', alignItems: 'center' }}>
                            <TextField
                              id="communicationCount"
                              name="communicationCount"
                              label="件数"
                              value={calcCommunicationCount().toLocaleString() + "件"}
                              variant="outlined"
                              size="small"
                              sx={{ width: '100px', backgroundColor: '#f5f5f5' }}
                              inputProps={{ readOnly: true, style: {textAlign: 'right', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                            />
                            <Box component="span" sx={{ ml: 3, height: '20px' }}>（ 会議：</Box>
                            <InputNumber 
                              value={meetingCount}
                              setValue={setMeetingCount}
                              label="件数"
                              maxLength={3}
                              width="80px"
                              id="meetingCount"
                              name="meetingCount"
                              endChar='件'
                            />
                            <Box component="span" sx={{ ml: 3, height: '20px' }}>電話：</Box>
                            <InputNumber 
                              value={phoneCount}
                              setValue={setPhoneCount}
                              label="件数"
                              maxLength={3}
                              width="80px"
                              id="phoneCount"
                              name="phoneCount"
                              endChar='件'
                            />
                            <Box component="span" sx={{ ml: 3, height: '20px' }}>メール：</Box>
                            <InputNumber 
                              value={mailCount}
                              setValue={setMailCount}
                              label="件数"
                              maxLength={3}
                              width="80px"
                              id="mailCount"
                              name="mailCount"
                              endChar='件'
                            />
                            <Box component="span" sx={{ ml:3, height: '20px' }}>FAX：</Box>
                            <InputNumber 
                              value={faxCount}
                              setValue={setFaxCount}
                              label="件数"
                              maxLength={3}
                              width="80px"
                              id="faxCount"
                              name="faxCount"
                              endChar='件'
                            />
                            <Box component="span" sx={{ ml: 3, height: '20px' }}>)</Box>
                          </Box>
                        </CustomCell>
                      </TableRow>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <CustomCell>設計変更票</CustomCell>
                        <CustomCell>
                          <Box component="div" sx={{ my: 0.7, display: 'flex', alignItems: 'center' }}>
                            <TextField
                              id="designChangesCount"
                              name="designChangesCount"
                              label="件数"
                              value={calcDesignChangesCount().toLocaleString() + "件"}
                              variant="outlined"
                              size="small"
                              sx={{ width: '100px', backgroundColor: '#f5f5f5' }}
                              inputProps={{ readOnly: true, style: {textAlign: 'right', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                            />
                            <Box component="span" sx={{ ml: 3, height: '20px' }}>（ 仕変：</Box>
                            <InputNumber 
                              value={specificationChangeCount}
                              setValue={setSpecificationChangeCount}
                              label="件数"
                              maxLength={3}
                              width="80px"
                              id="specificationChangeCount"
                              name="specificationChangeCount"
                              endChar='件'
                            />
                            <Box component="span" sx={{ ml: 3, height: '20px' }}>設計ミス：</Box>
                            <InputNumber 
                              value={designErrorCount}
                              setValue={setDesignErrorCount}
                              label="件数"
                              maxLength={3}
                              width="80px"
                              id="designErrorCount"
                              name="designErrorCount"
                              endChar='件'
                            />
                            <Box component="span" sx={{ ml: 3, height: '20px' }}>その他：</Box>
                            <InputNumber 
                              value={othersCount}
                              setValue={setOthersCount}
                              label="件数"
                              maxLength={3}
                              width="80px"
                              id="othersCount"
                              name="othersCount"
                              endChar='件'
                            />
                            <Box component="span" sx={{ ml: 3, height: '20px' }}>)</Box>
                          </Box>
                        </CustomCell>
                      </TableRow>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <CustomCell>改善一覧</CustomCell>
                        <CustomCell>
                          <Box component="div" sx={{ my: 0.7, display: 'flex', alignItems: 'center' }}>
                            <TextField
                              id="improvementCount"
                              name="improvementCount"
                              label="件数"
                              value={calcImprovementCount().toLocaleString() + "件"}
                              variant="outlined"
                              size="small"
                              sx={{ width: '100px', backgroundColor: '#f5f5f5' }}
                              inputProps={{ readOnly: true, style: {textAlign: 'right', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                            />
                            <Box component="span" sx={{ ml: 3, height: '20px' }}>（ 是正処置：</Box>
                            <InputNumber 
                              value={correctiveActionCount}
                              setValue={setCorrectiveActionCount}
                              label="件数"
                              maxLength={3}
                              width="80px"
                              id="correctiveActionCount"
                              name="correctiveActionCount"
                              endChar='件'
                            />
                            <Box component="span" sx={{ ml: 3, height: '20px' }}>予防措置：</Box>
                            <InputNumber 
                              value={preventiveMeasuresCount}
                              setValue={setPreventiveMeasuresCount}
                              label="件数"
                              maxLength={3}
                              width="80px"
                              id="preventiveMeasuresCount"
                              name="preventiveMeasuresCount"
                              endChar='件'
                            />
                            <Box component="span" sx={{ ml: 3, height: '20px' }}>)</Box>
                          </Box>
                        </CustomCell>
                      </TableRow>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <CustomCell>プロジェクトミーティング</CustomCell>
                        <CustomCell>
                          <Box component="div" sx={{ my: 0.7, display: 'flex', alignItems: 'center' }}>
                            <InputNumber 
                              value={projectMeetingCount}
                              setValue={setProjectMeetingCount}
                              label="件数"
                              maxLength={3}
                              width="100px"
                              id="projectMeetingCount"
                              name="projectMeetingCount"
                              endChar='件'
                            />
                          </Box>
                        </CustomCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ minHeight: '100px', height: '100px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>統計的考察</CustomCell>
              <CustomCell>
                <TextField
                  fullWidth
                  multiline
                  maxRows={5}
                  minRows={3}
                  id="statisticalConsideration"
                  name="statisticalConsideration"
                  label="統計的考察"
                  value={statisticalConsideration}
                  variant="outlined"
                  size="small"
                  sx={{ my: 0.7 }}
                  inputProps={{maxLength:255, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setStatisticalConsideration(e.target.value)}
                />
              </CustomCell>
            </TableRow>
            <TableRow sx={{ minHeight: '100px', height: '100px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>品質目標達成度</CustomCell>
              <CustomCell>
                <TextField
                  fullWidth
                  multiline
                  maxRows={5}
                  minRows={3}
                  id="qualitygoalsEvaluate"
                  name="qualitygoalsEvaluate"
                  label="品質目標達成度"
                  value={qualitygoalsEvaluate}
                  variant="outlined"
                  size="small"
                  sx={{ my: 0.7 }}
                  inputProps={{maxLength:255, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setQualitygoalsEvaluate(e.target.value)}
                />
              </CustomCell>
            </TableRow>
            <TableRow sx={{ minHeight: '100px', height: '100px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>完了報告</CustomCell>
              <CustomCell>
                <TextField
                  fullWidth
                  multiline
                  maxRows={5}
                  minRows={3}
                  id="totalReport"
                  name="totalReport"
                  label="完了報告"
                  value={totalReport}
                  variant="outlined"
                  size="small"
                  sx={{ my: 0.7 }}
                  inputProps={{maxLength:255, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setTotalReport(e.target.value)}
                />
              </CustomCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar open={snackbar.show} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <ConfirmDlg confirm={confirm} handleOK={handleConfirmOK} handleCancel={handleCofirmCancel} />
      <Loading isLoading={isLoading} />
    </Box>
  );
}
export default RepEditPage;
