import { useState, useEffect } from 'react';
import { AlertType } from '../../common/cmnType';
import { cmnProps } from '../../common/cmnConst';
import ConfirmDlg, { ConfirmParam } from '../../common/ConfirmDlg';
import Loading from '../../common/Loading';
import { getEmp, updateEmp, updateEmpParams } from '../../../lib/api/organization';
import { isEmpty } from '../../../lib/common/isEmpty';
import { integerOnly, phoneOnly } from '../../../lib/common/inputRegulation';
import { zeroPadding } from '../../../lib/common/stringCom';
import { formatDateZero } from '../../../lib/common/dateCom';
import { getApplicationRoles } from '../../../lib/api/application';

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
import Select, {SelectChangeEvent} from '@mui/material/Select';
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

const dateFormat = "YYYY年MM月DD日";
// ディレイ用
const wait = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type Role = {
  id: number;
  code: string;
  name: string;
}
type Props = {
  show: boolean;
  empId: number | null;
  close: (refresh?: boolean) => void;
}
type Data = {
  employeeNumber: string;
  name: string;
  nameKana: string;
  birthday: Date | null;
  address: string;
  phone: string;
  joiningDate: Date | null;
  authorityId: Number | null;
  roleName: string;
}
const initData = {
  employeeNumber: "",
  name: "",
  nameKana: "",
  birthday: null,
  address: "",
  phone: "",
  joiningDate: null,
  authorityId: null,
  roleName: ""
}
const EmpUpdPage = (props: Props) => {
  const [employeeNumber, setEmployeeNumber] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [nameKana, setNameKana] = useState<string>("");
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [joiningDate, setJoiningDate] = useState<Date | null>(null);
  const [authorityId, setAuthorityId] = useState<number | null>(null);

  const [data, setData] = useState<Data>(initData);
  const [roles, setRoles] = useState<Role[]>([]);

  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [confirm, setConfirm] = useState<ConfirmParam>( { message: "", tag: "", width: null });
  const [isLoading1, setIsLoading1] = useState<boolean>(false);
  const [isLoading2, setIsLoading2] = useState<boolean>(false);

  // 初期処理
  useEffect(() => {
    if(props.empId){
      setIsLoading1(true);
      handleGetEmp();
      setIsLoading2(true);
      handleGetRoles();
    }
  },[props.empId]);
  
  // 社員情報取得
  const handleGetEmp = async () => {
    try {
      const res = await getEmp(props.empId);
      setData({
        employeeNumber: zeroPadding(res.data.emp.employeeNumber,3),
        name: res.data.emp.name,
        nameKana: res.data.emp.nameKana,
        address: res.data.emp.address,
        phone: res.data.emp.phone,
        joiningDate: res.data.emp.joiningDate,
        birthday: res.data.emp.birthday,
        authorityId: res.data.emp.authorityId,
        roleName: res.data.emp.roleName
      });
      setEmployeeNumber(zeroPadding(res.data.emp.employeeNumber,3));
      setName(res.data.emp.name);
      setNameKana(res.data.emp.nameKana);
      setAddress(res.data.emp.address);
      setPhone(res.data.emp.phone);
      setJoiningDate(res.data.emp.joiningDate);
      setBirthday(res.data.emp.birthday);
      setAuthorityId(res.data.emp.authorityId);
    } catch (e) {
      setErr({severity: "error", message: "社員情報取得エラー"});
    }
    setIsLoading1(false);
  }

  // ロール一覧取得
  const handleGetRoles = async () => {
    // ちらつき防止のため意図的にディレイを入れる（0.5秒）
    await wait(500);
    try {
      const res = await getApplicationRoles();
      setRoles(res.data.roles);
    } catch (e) {
      setErr({severity: "error", message: "ロール情報取得エラー"});
    } 
    setIsLoading2(false);    
  }

  // 登録ボタン押下時の処理
  const handleSubmit = () => {
    setConfirm({
      message: "社員情報を変更します。よろしいですか？",
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
    saveEmp();
  }

  // 更新処理
  const saveEmp = async () => {
    const params: updateEmpParams = {
      employeeNumber: String(Number(employeeNumber)),
      name: name, 
      nameKana: nameKana,
      birthday: birthday,
      address: address,
      phone: phone,
      joiningDate: joiningDate,
      authorityId: authorityId
    }
    try {
      const res = await updateEmp(props.empId, params);
      if (res.status === 200){
        props.close(true);
        setEmployeeNumber("");
        setName("");
        setNameKana("");
        setBirthday(null);
        setAddress("");
        setPhone("");
        setJoiningDate(null);
        setAuthorityId(null);
        setData(initData);
        setErr({severity: null, message: ""});    
      } else {
        setErr({severity: "error", message: "社員情報更新エラー(500)"});
      }
    } catch (e) {
      setErr({severity: "error", message: "社員情報更新エラー"});
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
    setEmployeeNumber("");
    setName("");
    setNameKana("");
    setBirthday(null);
    setAddress("");
    setPhone("");
    setJoiningDate(null);
    setAuthorityId(null);
    setData(initData);
    setErr({severity: null, message: ""});
  }

  // 権限選択
  const handleChangeRole = (e: SelectChangeEvent ) => {
    setAuthorityId(Number(e.target.value));
  }

  return (
    <>
      { props.show ? (
        <div className="overlay-dark">
          <Box component='div' sx={{ backgroundColor: '#fff', minHeight: '700px', minWidth: '600px',border: "0.5px solid #000", boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>
            <AppBar position='static'>
              <Toolbar variant="dense">
                <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>社員情報変更</Typography>
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

            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<SaveAltIcon />}
              disabled={(isEmpty(employeeNumber) || isEmpty(name))}
              style={{marginTop:20, marginLeft:20, marginBottom:30}}
              onClick={(e) => handleSubmit()}
            >
              更新
            </Button>

            <Box component="div" sx={{ marginX: "20px" }}>
              <Box component="div">
                <TextField
                  required
                  fullWidth
                  id="employeeNumber"
                  name="employeeNumber"
                  label="社員番号"
                  value={employeeNumber}
                  variant="outlined"
                  size="small"
                  inputProps={{maxLength:20, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setEmployeeNumber(integerOnly(e.target.value))}
                />
              </Box>
              { (employeeNumber !== data.employeeNumber) &&
              <Box component="div" >
                <Typography variant='caption' component="div" color="primary.main" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{"[変更前] " + data.employeeNumber}</Typography>
              </Box>
              }
              <Box component="div" sx={{mt: 3}}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  name="name"
                  label="氏名"
                  value={name}
                  variant="outlined"
                  size="small"
                  inputProps={{maxLength:20, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setName(e.target.value)}
                />
              </Box>
              { (name !== data.name) &&
              <Box component="div">
                <Typography variant='caption' component="div" color="primary.main" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{"[変更前] " + data.name}</Typography>
              </Box>
              }
              <Box component="div" sx={{mt: 3}}>
                <TextField
                  fullWidth
                  id="nameKana"
                  name="nameKana"
                  label="氏名（カナ）"
                  value={nameKana}
                  variant="outlined"
                  size="small"
                  inputProps={{maxLength:20, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setNameKana(e.target.value)}
                />
              </Box>
              { (nameKana !== data.nameKana) &&
              <Box component="div">
                <Typography variant='caption' component="div" color="primary.main" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{"[変更前] " + data.nameKana}</Typography>
              </Box>
              }
              <Box component="div" sx={{mt: 3}}>
                <TextField
                  fullWidth
                  id="address"
                  name="address"
                  label="住所"
                  value={address}
                  variant="outlined"
                  size="small"
                  inputProps={{maxLength:40, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Box>
              { (address !== data.address) &&
              <Box component="div">
                <Typography variant='caption' component="div" color="primary.main" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{"[変更前] " + data.address}</Typography>
              </Box>
              }
              <Box component="div" sx={{mt: 3}}>
                <TextField
                  fullWidth
                  id="phone"
                  name="phone"
                  label="電話番号"
                  value={phone}
                  variant="outlined"
                  type="tel"
                  size="small"
                  inputProps={{maxLength:15, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setPhone(phoneOnly(e.target.value))}
                />
              </Box>
              { (phone !== data.phone) &&
              <Box component="div">
                <Typography variant='caption' component="div" color="primary.main" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{"[変更前] " + data.phone}</Typography>
              </Box>
              }
              <Box component="div" sx={{mt: 3}}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} >
                  <DatePicker
                    label="入社年月日"
                    inputFormat="yyyy年MM月dd日"
                    mask='____年__月__日'
                    value={joiningDate}
                    onChange={(value: Date | null) => setJoiningDate(value)}
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
              { (formatDateZero(joiningDate, dateFormat) !== formatDateZero(data.joiningDate, dateFormat)) &&
              <Box component="div">
                <Typography variant='caption' component="div" color="primary.main" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{"[変更前] " + formatDateZero(data.joiningDate, dateFormat)}</Typography>
              </Box>
              }
              <Box component="div" sx={{mt: 3}}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} >
                  <DatePicker
                    label="生年月日"
                    inputFormat="yyyy年MM月dd日"
                    mask='____年__月__日'
                    value={birthday}
                    onChange={(value: Date | null) => setBirthday(value)}
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
              { (formatDateZero(birthday, dateFormat) !== formatDateZero(data.birthday, dateFormat)) &&
              <Box component="div" sx={{ marginBottom: '10px' }}>
                <Typography variant='caption' component="div" color="primary.main" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{"[変更前] " + formatDateZero(data.birthday, dateFormat)}</Typography>
              </Box>
              }
              <Box component="div" sx={{mt: 3}}>
                <FormControl variant="outlined" fullWidth size="small">
                  <InputLabel id="select-role-label" sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}>システム権限</InputLabel>
                  <Select
                    labelId="select-role-label"
                    id="select-role"
                    label="システム権限"
                    value={String(authorityId)}
                    onChange={handleChangeRole}
                    sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}
                  >
                    { roles.map((r,i) =>
                    <MenuItem sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={r.id}>{r.name}</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Box>
              { (authorityId !== data.authorityId) ?
              <Box component="div" sx={{ marginBottom: '10px' }}>
                <Typography variant='caption' component="div" color="primary.main" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{"[変更前] " + (isEmpty(data.roleName) ? "" : data.roleName)}</Typography>
              </Box>
              :
              <Box component="div" sx={{ marginBottom: '10px' }} />
              }
            </Box>
            <ConfirmDlg confirm={confirm} handleOK={handleConfirmOK} handleCancel={handleCofirmCancel} />
            <Loading isLoading={isLoading1 || isLoading2} />
          </Box>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
export default EmpUpdPage;
