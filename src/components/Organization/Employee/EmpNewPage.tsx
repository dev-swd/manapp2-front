import { useState, useEffect } from 'react';
import { AlertType } from '../../common/cmnType';
import { cmnProps } from '../../common/cmnConst';
import ConfirmDlg, { ConfirmParam } from '../../common/ConfirmDlg';
import Loading from '../../common/Loading';
import { integerOnly, phoneOnly } from '../../../lib/common/inputRegulation';
import { signUp, SignUpParams } from '../../../lib/api/deviseAuth';
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
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Select from '@mui/material/Select';
import MenuItem from "@mui/material/MenuItem";
import { LocalizationProvider, DatePicker } from  '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import ja from 'date-fns/locale/ja'

import { isEmpty } from '../../../lib/common/isEmpty';

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

type Role = {
  id: number;
  code: string;
  name: string;
}
type Props = {
  show: boolean;
  close: (refresh?: boolean) => void;
}
const EmpNewPage = (props: Props) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [passwordConShow, setPasswordConShow] = useState<boolean>(false);

  const [employeeNumber, setEmployeeNumber] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [nameKana, setNameKana] = useState<string>("");
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [joiningDate, setJoiningDate] = useState<Date | null>(null);
  const [authorityId, setAuthorityId] = useState<number | null>(null);

  const [roles, setRoles] = useState<Role[]>([]);

  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [confirm, setConfirm] = useState<ConfirmParam>( { message: "", tag: "", width: null });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 初期処理
  useEffect(() => {
    setIsLoading(true);
    handleGetRoles();
  }, []);

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
    setIsLoading(false);    
  }

  // 登録ボタン押下時の処理
  const handleSubmit = () => {
    setConfirm({
      message: "社員を登録します。よろしいですか？",
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
    saveEmp();
  }

  // 登録処理
  const saveEmp = async () => {
    const params: SignUpParams = {
      email: email, 
      password: password, 
      passwordConfirmation: passwordConfirmation,
      employeeNumber: String(Number(employeeNumber)),
      name: name, 
      nameKana: nameKana,
      birthday: birthday,
      address: address,
      phone: phone,
      joiningDate: joiningDate,
      authorityId: 0
    }
    try {
      const res = await signUp(params);
      if (res.status === 200){
        props.close();
        setEmail("");
        setPassword("");
        setPasswordConfirmation("");
        setPasswordShow(false);
        setPasswordConShow(false);
        setEmployeeNumber("");
        setName("");
        setNameKana("");
        setBirthday(null);
        setAddress("");
        setPhone("");
        setJoiningDate(null);
        setAuthorityId(null);
        setErr({severity: null, message: ""});    
      } else {
        setErr({severity: "error", message: "社員情報登録エラー(" + res.status + ")"});
      }
    } catch (e) {
      setErr({severity: "error", message: "社員情報登録エラー"});
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
    setEmail("");
    setPassword("");
    setPasswordConfirmation("");
    setPasswordShow(false);
    setPasswordConShow(false);
    setEmployeeNumber("");
    setName("");
    setNameKana("");
    setBirthday(null);
    setAddress("");
    setPhone("");
    setJoiningDate(null);
    setAuthorityId(null);
    setErr({severity: null, message: ""});
  }

  return (
    <>
      { props.show ? (
        <Box component='div' sx={{ overflow: 'auto', backgroundColor: '#fff', height: '100%', border: "0.5px solid #000", boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>
          <AppBar position='static'>
            <Toolbar variant="dense">
              <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>社員新規登録</Typography>
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
            disabled={(isEmpty(email) || isEmpty(password) || isEmpty(passwordConfirmation) || isEmpty(employeeNumber) || isEmpty(name))}
            style={{marginTop:20, marginLeft:20, marginBottom:30}}
            onClick={(e) => handleSubmit()}
          >
            登録
          </Button>

          <Box component="div" sx={{ marginX: "20px" }}>
            <TextField
              required
              fullWidth
              id="email"
              name="email"
              label="Email"
              value={email}
              variant="outlined"
              size="small"
              type="email"
              autoComplete='username'
              inputProps={{maxLength:255, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormControl size="small" variant='outlined' fullWidth sx={{ mt: 2 }} required>
              <InputLabel htmlFor="new-password" style={{ fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily }}>Password</InputLabel>
              <OutlinedInput
                id="new-password"
                type={passwordShow ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={(e) => setPasswordShow(!passwordShow)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {passwordShow ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            <FormControl size="small" variant='outlined' fullWidth sx={{ mt: 2 }} required>
              <InputLabel htmlFor="new-password-confirmation" style={{ fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily }}>Password Confirmation</InputLabel>
              <OutlinedInput
                id="new-password-confirmation"
                type={passwordConShow ? 'text' : 'password'}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                style={{ fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password confirmation visibility"
                      onClick={(e) => setPasswordConShow(!passwordConShow)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {passwordConShow ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password Confirmation"
              />
            </FormControl>
          </Box>

          <Box component="div" sx={{ marginX: "20px", marginTop: "30px" }}>
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
            <TextField
              required
              fullWidth
              id="name"
              name="name"
              label="氏名"
              value={name}
              variant="outlined"
              size="small"
              sx={{ mt: 2 }}
              inputProps={{maxLength:20, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              fullWidth
              id="nameKana"
              name="nameKana"
              label="氏名（カナ）"
              value={nameKana}
              variant="outlined"
              size="small"
              sx={{ mt: 2 }}
              inputProps={{maxLength:20, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              onChange={(e) => setNameKana(e.target.value)}
            />
            <TextField
              fullWidth
              id="address"
              name="address"
              label="住所"
              value={address}
              variant="outlined"
              size="small"
              sx={{ mt: 2 }}
              inputProps={{maxLength:40, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              onChange={(e) => setAddress(e.target.value)}
            />
            <TextField
              fullWidth
              id="phone"
              name="phone"
              label="電話番号"
              value={phone}
              variant="outlined"
              type="tel"
              size="small"
              sx={{ mt: 2 }}
              inputProps={{maxLength:15, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              onChange={(e) => setPhone(phoneOnly(e.target.value))}
            />
            <Box component="div" sx={{mt: 2}}>
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
            <Box component="div" sx={{mt: 2}}>
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
            <Box component="div" sx={{my: 2}}>
              <FormControl variant="outlined" fullWidth size="small">
                <InputLabel id="select-role-label" sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}>システム権限</InputLabel>
                <Select
                  labelId="select-role-label"
                  id="select-role"
                  label="システム権限"
                  value={authorityId}
                  onChange={(e) => setAuthorityId(Number(e.target.value))}
                  sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}
                >
                  { roles.map((r,i) =>
                  <MenuItem sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={r.id}>{r.name}</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <ConfirmDlg confirm={confirm} handleOK={handleConfirmOK} handleCancel={handleCofirmCancel} />
          <Loading isLoading={isLoading} />
        </Box>
      ) : (
        <></>
      )}
    </>
  );
}
export default EmpNewPage;
