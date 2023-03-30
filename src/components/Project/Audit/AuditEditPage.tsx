import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from './../../../App';
import { AlertType } from './../../common/cmnType';
import { cmnProps, projectStatus } from './../../common/cmnConst';
import ConfirmDlg, { ConfirmParam } from './../../common/ConfirmDlg';
import { getAudits, auditParam, updateAudits } from '../../../lib/api/project';
import { isEmpty } from '../../../lib/common/isEmpty';
import SelectEmployeeId from '../../common/SelectEmployeeId';
import Loading from './../../common/Loading';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import TextField from '@mui/material/TextField';
import { LocalizationProvider, DatePicker } from  '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import ja from 'date-fns/locale/ja'
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from "@mui/material/MenuItem";
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MoveUpIcon from '@mui/icons-material/MoveUp';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import Snackbar from '@mui/material/Snackbar';

import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
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

const getToday = () => {
  let dt = new Date();
  dt.setMinutes(0);
  dt.setSeconds(0);
  dt.setMilliseconds(0);
  return dt;
}

type Props = {
  projectId: number | null;
  kinds: 'plan' | 'report';
}
const AuditEditPage = (props: Props) => {
  const { currentUser } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [audits, setAudits] = useState<auditParam[]>([]);
  const [getFlg, setGetFlg] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");

  const [err, setErr] = useState<AlertType>({severity: null, message: ""});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<ConfirmParam>({ message: "", tag: null, width: null });
  const [snackbar, setSnackbar] = useState<{show: boolean, message: string}>({show: false, message: ""});

  // 初期処理
  useEffect(() => {
    if (!isEmpty(props.projectId)) {
      handleGetAudits();
    }
  },[props.projectId]);

  // 監査情報取得
  const handleGetAudits = async () => {
    try {
      const res = await getAudits(props.projectId, props.kinds);
      const tmpAudits = res.data.audits.map((a: auditParam) => {
        const tmpAudit: auditParam = {
          id: a.id,
          projectId: a.projectId,
          kinds: a.kinds,
          number: a.number,
          auditorId: a.auditorId,
          auditDate: a.auditDate,
          title: a.title,
          contents: a.contents,
          result: a.result,
          acceptId: a.acceptId,
          acceptDate: a.acceptDate,
          del: false
        }
        return tmpAudit;
      });
      setAudits(tmpAudits);
      setGetFlg(true);
    } catch (e) {
      setErr({severity: "error", message: "監査報取得エラー"});
    } 
    setIsLoading(false);
  }

  // 追加ボタン押下時の処理
  const handleAdd = () => {
    setAudits([...audits,
    {
      id: null,
      projectId: props.projectId,
      kinds: props.kinds,
      number: null,
      auditorId: currentUser.id,
      auditDate: getToday(),
      title: "",
      contents: "",
      result: "",
      acceptId: null,
      acceptDate: null,
      del: false
    }]);
  }

  // 項目変更
  const handleChangeTitle = (i: number, value: string) => {
    const tmpAudits = [...audits];
    tmpAudits[i].title = value;
    setAudits(tmpAudits);
  }

  // 指摘内容変更
  const handleChangeContents = (i: number, value: string) => {
    const tmpAudits = [...audits];
    tmpAudits[i].contents = value;
    setAudits(tmpAudits);
  }

  // 監査日変更
  const handleChangeAuditDate = (i: number, value: Date | null) => {
    const tmpAudits = [...audits];
    tmpAudits[i].auditDate = value;
    setAudits(tmpAudits);
  }

  // 監査者変更
  const handleChangeAuditorId = (i: number, value: number | null) => {
    const tmpAudits = [...audits];
    tmpAudits[i].auditorId = value;
    setAudits(tmpAudits);
  }
  
  // 再確認結果変更
  const handleChangeResult = (i: number, value: string) => {
    const tmpAudits = [...audits];
    tmpAudits[i].result = value;
    setAudits(tmpAudits);
  }

  // 再確認日付変更
  const handleChangeAcceptDate = (i: number, value: Date | null) => {
    const tmpAudits = [...audits];
    tmpAudits[i].acceptDate = value;
    setAudits(tmpAudits);
  }

  // 再確認者変更
  const handleChangeAcceptId = (i: number, value: number | null) => {
    const tmpAudits = [...audits];
    tmpAudits[i].acceptId = value;
    setAudits(tmpAudits);
  }

  // MoveUp処理
  const handleMoveUp = (i: number) => {
    if (i !== 0) {
      let _tmpAudits = audits.slice(0, i-1);
      let _tmpAudit = audits[i-1];
      let tmpAudit = audits[i];
      let tmpAudits_ = audits.slice(i+1);

      let tmpAudits = _tmpAudits.concat(tmpAudit, _tmpAudit, tmpAudits_);
      setAudits(tmpAudits);
    }
  }

  // MoveDown処理
  const handleMoveDown = (i: number) => {
    if (i !== (audits.length - 1)) {
      let _tmpAudits = audits.slice(0, i);
      let tmpAudit = audits[i];
      let tmpAudit_ = audits[i+1];
      let tmpAudits_ = audits.slice(i+2);

      let tmpAudits = _tmpAudits.concat(tmpAudit_, tmpAudit, tmpAudits_);
      setAudits(tmpAudits);
    }
  }

  // Delete処理
  const handleDelete = (i: number) => {
    const tmpAudits = [...audits];
    tmpAudits[i].del = !tmpAudits[i].del;
    setAudits(tmpAudits);
  }

  // 差し戻し
  const handleDisapproval = () => {
    if (props.kinds==="plan") {
      setStatus(projectStatus.planSendBack);
      setConfirm({
        message: "この計画書を差し戻します。よろしいですか。",
        tag: null,
        width: 400
      });
      } else {
        setConfirm({
          message: "この完了報告書を差し戻します。よろしいですか。",
          tag: null,
          width: 400
        });
        setStatus(projectStatus.reportSendBack);
    }
  }

  // 承認
  const handleApproval = () => {
    if (props.kinds==="plan") {
      setStatus(projectStatus.projectInProgress);
      setConfirm({
        message: "この計画書を監査承認します。よろしいですか。",
        tag: null,
        width: 400
      });
      } else {
        setConfirm({
          message: "この完了報告書を監査承認します。よろしいですか。",
          tag: null,
          width: 400
        });
        setStatus(projectStatus.projectCompleted);
    }
  }

  // 一時保存
  const handleUpdate = () => {
    setConfirm({
      message: "この内容で一時保存します。よろしいですか？",
      tag: "",
      width: null
    });    
  }

  // 一時保存確認ダイアログでOKの場合の処理
  const handleConfirmOK = (dummy: string) => {
    setConfirm({
      message: "",
      tag: "",
      width: null
    });
    setIsLoading(true);
    saveAudits();
  }

  // 監査記録更新
  const saveAudits = async () => {
    try {
      const params = {
        status: status,
        audits: audits
      }
      const res = await updateAudits(props.projectId, params);
      if (res.status === 200){
        setSnackbar({show: true, message: "更新しました。"});
        setErr({severity: null, message: ""});
        if(!isEmpty(status)){
          navigate(`/project`);
        }
      } else {
        setErr({severity: "error", message: `プロジェクト情報更新エラー(${res.status})`});
      }
    } catch (e) {
      setErr({severity: "error", message: "プロジェクト情報更新エラー"});
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
    setStatus("");
  }

  // snackbar close処理
  const handleSnackbarClose = () => {
    setSnackbar({show: false, message: ""});
  }

  // 画面編集
  return (
    <Box component='div' sx={{ width: '100%', height: '100%' }}>

      {(err.severity) &&
        <Stack sx={{width: '100%'}} spacing={1} mb={3} >
          <Alert severity={err.severity}>{err.message}</Alert>
        </Stack>
      }

      <Box>
        <Button 
          size="small" 
          variant="contained" 
          endIcon={<ThumbDownAltIcon />} 
          onClick={(e) => handleDisapproval()}
        >
          差し戻し
        </Button>
        <Button 
          size="small" 
          variant="contained" 
          endIcon={<ThumbUpAltIcon />} 
          onClick={(e) => handleApproval()}
          style={{marginLeft:10}}
        >
          承認
        </Button>
        <Button 
          size="small"
          variant="contained" 
          endIcon={<SaveAltIcon />} 
          onClick={(e) => handleUpdate()}
          style={{marginLeft:10}}
        >
          一時保存
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2, maxHeight: '70vh', border: '0.5px #c0c0c0 solid' }}>
        <Table sx={{ width: 1100 }} stickyHeader aria-label="project table">
          <TableHead>
            <TableRow>
              <CustomCell sx={{ width: 200 }}>項目</CustomCell>
              <CustomCell sx={{ width: 320 }}>指摘内容</CustomCell>
              <CustomCell sx={{ width: 200 }}>監査</CustomCell>
              <CustomCell colSpan={2} sx={{ width: 280 }}>再確認</CustomCell>
              <CustomCell sx={{ width: 100 }}></CustomCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { audits.map((a,i) => 
              <>
                <TableRow>
                  <CustomCell rowSpan={2}>
                    <TextField
                      fullWidth
                      error={a.del}
                      multiline
                      maxRows={3}
                      minRows={1}
                      id={"title-" + i}
                      name="title"
                      label="title"
                      value={a.title}
                      variant="outlined"
                      size="small"
                      inputProps={{maxLength:20, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                      InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                      onChange={(e) => handleChangeTitle(i, e.target.value)}
                    />
                  </CustomCell>
                  <CustomCell rowSpan={2}>
                    <TextField
                      fullWidth
                      error={a.del}
                      multiline
                      maxRows={5}
                      minRows={3}
                      id={"contents-" + i}
                      name="contents"
                      label="contents"
                      value={a.contents}
                      variant="outlined"
                      size="small"
                      inputProps={{maxLength:50, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                      InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                      onChange={(e) => handleChangeContents(i, e.target.value)}
                    />
                  </CustomCell>
                  <CustomCell>
                    <Box sx={{ width: 200}}>
                      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} >
                        <DatePicker
                          label="監査日"
                          inputFormat="yyyy年MM月dd日"
                          mask='____年__月__日'
                          value={a.auditDate}
                          onChange={(value: Date | null) => handleChangeAuditDate(i, value)}
                          renderInput={(params: any) => <TextField 
                                                    {...params}
                                                    error={a.del} 
                                                    variant="outlined" 
                                                    size="small" 
                                                    InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }} 
                                                  />}
                          PaperProps={{ sx: styles.paperprops }}
                        />
                      </LocalizationProvider>
                    </Box>
                  </CustomCell>
                  <CustomCell rowSpan={2}>
                    <FormControl variant="outlined" fullWidth size="small">
                      <InputLabel id="select-result-label" sx={{verticalAlign: 'middle', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}>結果</InputLabel>
                      <Select
                        labelId="select-result-label"
                        error={a.del}
                        id="select-result"
                        label="結果"
                        value={a.result ?? ''}
                        onChange={(e) => handleChangeResult(i, e.target.value)}
                        sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily, width: 80}}
                      >
                        <MenuItem key={`result-1`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={"NG"}>NG</MenuItem>
                        <MenuItem key={`result-2`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={"OK"}>OK</MenuItem>
                      </Select>
                    </FormControl>
                  </CustomCell>
                  <CustomCell>
                    <Box sx={{ width: 200}}>
                      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} >
                        <DatePicker
                          label="再確認日"
                          inputFormat="yyyy年MM月dd日"
                          mask='____年__月__日'
                          value={a.acceptDate}
                          onChange={(value: Date | null) => handleChangeAcceptDate(i, value)}
                          renderInput={(params: any) => <TextField 
                                                    {...params}
                                                    error={a.del} 
                                                    variant="outlined" 
                                                    size="small" 
                                                    InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }} 
                                                  />}
                          PaperProps={{ sx: styles.paperprops }}
                        />
                      </LocalizationProvider>
                    </Box>
                  </CustomCell>
                  <CustomCell rowSpan={2}>
                    <IconButton aria-label="move-up" onClick={() => handleMoveUp(i)} disabled={(i === 0) ? true : false }>
                      {(i === 0) ? (
                        <MoveUpIcon color="disabled" fontSize="inherit" />
                      ) : (
                        <MoveUpIcon color="primary" fontSize="inherit" />
                      )}
                    </IconButton>
                    <IconButton aria-label="move-down" onClick={() => handleMoveDown(i)} disabled={(i === (audits.length-1)) ? true : false }>
                      {(i === (audits.length-1)) ? (
                        <MoveDownIcon color="disabled" fontSize="inherit" />
                      ) : (
                        <MoveDownIcon color="primary" fontSize="inherit" />
                      )}
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDelete(i)}>
                      { a.del ? (
                        <RestoreFromTrashIcon color="warning" fontSize="inherit" />
                      ) : (
                        <DeleteIcon color="primary" fontSize="inherit" />
                      )}
                    </IconButton>
                  </CustomCell>
                </TableRow>
                <TableRow>
                  <CustomCell>
                    <SelectEmployeeId 
                      empId={a.auditorId}
                      empGet={getFlg}
                      setEmpId={(id: number | null) => handleChangeAuditorId(i, id)}
                      setErr={setErr}
                      label="監査者"
                      error={a.del}
                      width={200}
                    />
                  </CustomCell>
                  <CustomCell>
                    <SelectEmployeeId 
                      empId={a.acceptId}
                      empGet={getFlg}
                      setEmpId={(id: number | null) => handleChangeAcceptId(i, id)}
                      setErr={setErr}
                      label="監査者"
                      error={a.del}
                      width={200}
                    />
                  </CustomCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ textAlign: 'center' }}>
        <IconButton aria-label="Add" color="primary" size="large" onClick={() => handleAdd()}>
          <AddCircleIcon sx={{ fontSize : 40 }} />
        </IconButton>
      </Box>
      <Snackbar open={snackbar.show} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <ConfirmDlg confirm={confirm} handleOK={handleConfirmOK} handleCancel={handleCofirmCancel} fullscreen={true} />
      <Loading isLoading={isLoading} />
    </Box>
  );
}
export default AuditEditPage;
