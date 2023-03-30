import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from './../../App';
import { AlertType } from './../common/cmnType';
import { cmnProps, projectStatus } from './../common/cmnConst';
import ConfirmDlg, { ConfirmParam } from './../common/ConfirmDlg';
import Loading from './../common/Loading';
import { createProject, projectNewParam } from '../../lib/api/project';
import { getDivs } from '../../lib/api/organization';
import SelectEmployeeId from '../common/SelectEmployeeId';
import { formatDateTimeZero } from '../../lib/common/dateCom';

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
import { isEmpty } from '../../lib/common/isEmpty';

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

type Div = {
  id: number;
  depCode: string;
  depName: string;
  code: string;
  name: string;
}
type Props = {
  show: boolean;
  close: (refresh?: boolean) => void;
}
const PrjNewPage = (props: Props) => {
  const { currentUser } = useContext(GlobalContext);
  const [number, setNumber] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [divisionId, setDivisionId] = useState<number | null>(null);
  const [plId, setPlId] = useState<number | null>(null);
  const [approvalDate, setApprovalDate] = useState<Date | null>(null);
  const [approvalId, setApprovalId] = useState<number | null>(null);

  const [divs, setDivs] = useState<Div[]>([]);
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [confirm, setConfirm] = useState<ConfirmParam>( { message: "", tag: "", width: null });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 初期処理
  useEffect(() => {
    if(props.show){
      setIsLoading(true);
      handleGetDivs();  
    }
  }, [props.show]);
  
  // マスター情報取得
  const handleGetDivs = async () => {
    try {
      const res = await getDivs();
      setDivs(res.data.divs);
    } catch (e) {
      setErr({severity: "error", message: "課情報取得エラー"});
    } 
    setIsLoading(false);
  }

  // 登録ボタン押下時の処理
  const handleSubmit = () => {
    setConfirm({
      message: "プロジェクト情報を登録します。よろしいですか？",
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
    saveProject();
  }

  // 登録処理
  const saveProject = async () => {
    const params: projectNewParam = {
      project: {
        number: number,
        name: name,
        divisionId: divisionId,
        plId: plId,
        approvalId: approvalId,
// JavascriptのDateをJSONに変換するとUTC(世界標準時間)に変換される事象への対策
//        approvalDate: approvalDate,
        approvalDate: formatDateTimeZero(approvalDate, 'YYYY-MM-DDTHH:MI:SS.000'),
        status: projectStatus.planNotSubmitted,
        createdId: currentUser.id,
        updatedId: currentUser.id,
      }
    }
    try {
      const res = await createProject(params);
      if (res.status === 200){
        props.close(true);
        setNumber("");
        setName("");
        setDivisionId(null);
        setPlId(null);
        setApprovalDate(null);
        setApprovalId(null);
        setErr({severity: null, message: ""});
      } else {
        setErr({severity: "error", message: "プロジェクト情報登録エラー(" + res.status + ")"});
      }
    } catch (e) {
      setErr({severity: "error", message: "プロジェクト情報登録エラー"});
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

  // 閉じるボタン押下時の処理
  const handleClose = () => {
    props.close();
    setNumber("");
    setName("");
    setDivisionId(null);
    setPlId(null);
    setApprovalDate(null);
    setApprovalId(null);
    setErr({severity: null, message: ""});
  }

  // 画面編集
  return (
    <>
      { props.show ? (
        <div className="overlay-dark">
          <Box component='div' sx={{ backgroundColor: '#fff', height: '550px', width: '50%', minWidth: '400px', border: "0.5px solid #000", boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>
            <AppBar position='static'>
              <Toolbar variant="dense">
                <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>プロジェクト情報登録</Typography>
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
                disabled={isEmpty(number) || isEmpty(name) || isEmpty(divisionId) || isEmpty(plId) || isEmpty(approvalDate || isEmpty(approvalId))}
                style={{marginTop:20, marginLeft:20, marginBottom:30}}
                onClick={(e) => handleSubmit()}
              >
                登録
              </Button>

              <Box component="div" sx={{ mx: 2 }}>
                <TextField
                  required
                  fullWidth
                  id="number"
                  name="number"
                  label="プロジェクトNo."
                  value={number}
                  variant="outlined"
                  size="small"
                  inputProps={{maxLength:10, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setNumber(e.target.value)}
                />
                <TextField
                  required
                  fullWidth
                  id="name"
                  name="name"
                  label="プロジェクト名"
                  value={name}
                  variant="outlined"
                  size="small"
                  sx={{mt: 2}}
                  inputProps={{maxLength:30, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setName(e.target.value)}
                />
                <Box component="div" sx={{mt: 2}}>
                  <FormControl variant="outlined" fullWidth size="small">
                    <InputLabel required id="select-division-label" sx={{verticalAlign: 'middle', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}>担当部門</InputLabel>
                    <Select
                      labelId="select-division-label"
                      id="select-division"
                      label="担当部門"
                      value={divisionId ?? ''}
                      onChange={(e) => setDivisionId(Number(e.target.value))}
                      sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}
                    >
                      { divs.map((d,i) =>
                      <MenuItem key={`division-${i}`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={d.id}>{d.code === "dep" ? d.depName : d.depName + " " + d.name}</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Box>
                <Box component="div" sx={{mt: 2}}>
                  <SelectEmployeeId 
                    empId={plId}
                    empGet={true}
                    setEmpId={setPlId}
                    setErr={setErr}
                    label="PL"
                    required={true}
                    width={230}
                  />
                </Box>
                <Box component="div" sx={{mt: 2, display: 'flex'}}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} locale={ja} adapterLocale={ja} >
                    <DatePicker
                      label="承認日"
                      inputFormat="yyyy年MM月dd日"
                      mask='____年__月__日'
                      value={approvalDate}
                      onChange={(value: Date | null) => setApprovalDate(value)}
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
                  <SelectEmployeeId 
                    empId={approvalId}
                    empGet={true}
                    setEmpId={setApprovalId}
                    setErr={setErr}
                    label="承認者"
                    required={true}
                    width={230}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          <ConfirmDlg confirm={confirm} handleOK={handleConfirmOK} handleCancel={handleCofirmCancel} />
          <Loading isLoading={isLoading} />
        </div>
      ) : (
        <></>
      )}
    </>
  )
}
export default PrjNewPage;
