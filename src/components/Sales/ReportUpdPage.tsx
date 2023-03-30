import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from './../../App';
import { AlertType } from './../common/cmnType';
import { cmnProps } from './../common/cmnConst';
import ConfirmDlg, { ConfirmParam } from './../common/ConfirmDlg';
import Loading from './../common/Loading';
import { getSalesActions } from '../../lib/api/prospect';
import { getSalesreport, updateSalesreport, salesReportParam } from '../../lib/api/prospect';
import { isEmpty } from '../../lib/common/isEmpty';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from "@mui/material/MenuItem";
import { LocalizationProvider, DatePicker } from  '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import ja from 'date-fns/locale/ja'

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

// ディレイ用
const wait = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type Action = {
  id: number;
  name: string;
}
const initReport: Report = {
  id: null,
  reportDate: null,
  makeId: null,
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
  makeId: number | null;
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
  close: (refresh?: boolean) => void;
}
const ReportUpdPage = (props: Props) => {
  const { currentUser } = useContext(GlobalContext);
  const [reportDate, setReportDate] = useState<Date | null>(null);
  const [salesActionId, setSalesActionId] = useState<number | null>(null);
  const [topics, setTopics] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [actions, setActions] = useState<Action[]>([]);
  const [report, setReport] = useState<Report>(initReport);

  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [confirm, setConfirm] = useState<ConfirmParam>( { message: "", tag: "", width: null });
  const [isLoading1, setIsLoading1] = useState<boolean>(false);
  const [isLoading2, setIsLoading2] = useState<boolean>(false);

  // 初期処理
  useEffect(() => {
    if(props.reportId){
      setIsLoading1(true);
      setIsLoading2(true);
      handleGetListData();
      handleGetReport();
    }
  }, [props.reportId]);

  // マスター情報取得
  const handleGetListData = async () => {
    // ちらつき防止のため意図的にディレイを入れる（0.5秒）
    await wait(500);
    try {
      const res = await getSalesActions();
      setActions(res.data.salesactions);
    } catch (e) {
      setErr({severity: "error", message: "マスタ取得エラー"});
    } 
    setIsLoading1(false);
  }

  // 営業報告取得
  const handleGetReport = async () => {
    try {
      const res = await getSalesreport(props.reportId);
      setReportDate(res.data.salesreport.reportDate);
      setSalesActionId(res.data.salesreport.salesactionId);
      setTopics(res.data.salesreport.topics);
      setContent(res.data.salesreport.content);
      setReport(res.data.salesreport);
    } catch (e) {
      setErr({severity: "error", message: "営業報告取得エラー"});
    } 
    setIsLoading2(false);
  }

  // 更新ボタン押下時の処理
  const handleSubmit = () => {
    setConfirm({
      message: "営業報告を更新します。よろしいですか？",
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
    setIsLoading1(true);
    saveReport();
  }

  // 登録処理
  const saveReport = async () => {
    const params: salesReportParam = {
      id: props.reportId,
      reportDate: reportDate,
      makeId: report.makeId,
      updateId: currentUser.id,
      salesactionId: salesActionId,
      topics: topics,
      content: content,
    }
    try {
      const res = await updateSalesreport(props.reportId, params);
      if (res.status === 200){
        props.close(true);
        setReportDate(null);
        setSalesActionId(null);
        setTopics("");
        setContent("");
        setReport(initReport);
        setErr({severity: null, message: ""});
      } else {
        setErr({severity: "error", message: "営業報告更新エラー(" + res.status + ")"});
      }
    } catch (e) {
      setErr({severity: "error", message: "営業報告更新エラー"});
    }
    setIsLoading1(false);
  }

  // 確認ダイアログでキャンセルの場合の処理
  const handleCofirmCancel = () => {
    setConfirm({
      message: "",
      tag: "",
      width: null
    });
  }

  // 閉じるボタン押下時の処理
  const handleClose = () => {
    props.close();
    setReportDate(null);
    setSalesActionId(null);
    setTopics("");
    setContent("");
    setReport(initReport);
    setErr({severity: null, message: ""});
  }

  // 画面編集
  return (
    <>
      { props.show ? (
        <div className="overlay-dark">
          <Box component='div' sx={{ backgroundColor: '#fff', height: '90%', width: '60vw', minWidth: '400px', border: "0.5px solid #000", boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>
            <AppBar position='static'>
              <Toolbar variant="dense">
                <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>営業報告変更</Typography>
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

            <Box component='div' sx={{overflow: 'auto', height: 'calc(100% - 50px)'}}>

              {(err.severity) &&
                <Stack sx={{width: '100%'}} spacing={1}>
                  <Alert severity={err.severity}>{err.message}</Alert>
                </Stack>
              }

              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<SaveAltIcon />}
                disabled={isEmpty(topics) || isEmpty(reportDate) || isEmpty(salesActionId)}
                style={{marginTop:20, marginLeft:20, marginBottom:30}}
                onClick={(e) => handleSubmit()}
              >
                更新
              </Button>
            
              <Box component="div" sx={{ mx: 2 }}>
                <TextField
                  required
                  fullWidth
                  id="topics"
                  name="topics"
                  label="topics"
                  value={topics}
                  variant="outlined"
                  size="small"
                  inputProps={{maxLength:50, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setTopics(e.target.value)}
                />
                <Box component="div" sx={{mt: 2}}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} >
                    <DatePicker
                      label="report date"
                      inputFormat="yyyy年MM月dd日"
                      mask='____年__月__日'
                      value={reportDate}
                      onChange={(value: Date | null) => setReportDate(value)}
                      renderInput={(params: any) => <TextField 
                                                {...params}
                                                required
                                                error={false} 
                                                variant="outlined" 
                                                size="small" 
                                                InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }} 
                                              />}
                      PaperProps={{ sx: styles.paperprops }}
                    />
                  </LocalizationProvider>
                </Box>

                <Box component="div" sx={{mt: 2}}>
                  <FormControl variant="outlined" fullWidth size="small" required>
                    <InputLabel id="select-salesaction-label" sx={{verticalAlign: 'middle', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}>action</InputLabel>
                    <Select
                      labelId="select-salesaction-label"
                      id="select-salesaction"
                      label="action"
                      value={salesActionId ?? ''}
                      onChange={(e) => setSalesActionId(Number(e.target.value))}
                      sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}
                    >
                      { actions.map((a,i) =>
                      <MenuItem key={`salesaction-${i}`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={a.id}>{a.name}</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Box>

                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  id="content"
                  name="content"
                  label="content"
                  value={content}
                  variant="outlined"
                  size="small"
                  sx={{mt: 2}}
                  inputProps={{maxLength:255, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setContent(e.target.value)}
                />

              </Box>
            </Box>
          </Box>
          <ConfirmDlg confirm={confirm} handleOK={handleConfirmOK} handleCancel={handleCofirmCancel} />
          <Loading isLoading={isLoading1 || isLoading2} />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
export default ReportUpdPage;
