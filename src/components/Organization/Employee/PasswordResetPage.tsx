import { useState, useEffect } from 'react';
import { AlertType } from '../../common/cmnType';
import { cmnProps } from '../../common/cmnConst';
import ConfirmDlg, { ConfirmParam } from '../../common/ConfirmDlg';
import Loading from '../../common/Loading';
import { getEmp, resetPasswordParams,  updatePasswordReset } from '../../../lib/api/organization';
import { isEmpty } from '../../../lib/common/isEmpty';
import { zeroPadding } from '../../../lib/common/stringCom';

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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

type Props = {
  show: boolean;
  empId: number | null;
  close: (refresh?: boolean) => void;
}
const PasswordResetPage = (props: Props) => {
  const [employeeNumber, setEmployeeNumber] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [passwordConShow, setPasswordConShow] = useState<boolean>(false);

  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [confirm, setConfirm] = useState<ConfirmParam>( { message: "", tag: "", width: null });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 初期処理
  useEffect(() => {
    if(props.empId){
      setIsLoading(true);
      handleGetEmp();
    }
  },[props.empId]);
  
  // 社員情報取得
  const handleGetEmp = async () => {
    try {
      const res = await getEmp(props.empId);
      setEmployeeNumber(res.data.emp.employeeNumber);
      setName(res.data.emp.name);
    } catch (e) {
      setErr({severity: "error", message: "社員情報取得エラー"});
    }
    setIsLoading(false);
  }

  // 登録ボタン押下時の処理
  const handleSubmit = () => {
    setConfirm({
      message: "新しいパスワードに書き換えます。よろしいですか？",
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
    savePass();
  }

  // 登録処理
  const savePass = async () => {
    const params: resetPasswordParams = {
      password: password, 
      passwordConfirmation: passwordConfirmation,
    }
    try {
      const res = await updatePasswordReset(props.empId, params);
      if (res.status === 200){
        props.close();
        setPassword("");
        setPasswordConfirmation("");
        setPasswordShow(false);
        setPasswordConShow(false);
        setEmployeeNumber("");
        setName("");
        setErr({severity: null, message: ""});    
      } else {
        setErr({severity: "error", message: "パスワード更新エラー(500)"});
      }
    } catch (e) {
      setErr({severity: "error", message: "パスワード更新エラー"});
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
    setPassword("");
    setPasswordConfirmation("");
    setPasswordShow(false);
    setPasswordConShow(false);
    setEmployeeNumber("");
    setName("");
    setErr({severity: null, message: ""});
  }

  return (
    <>
      { props.show ? (
        <div className="overlay-dark">
          <Box component='div' sx={{ backgroundColor: '#fff', minHeight: '400px', border: "0.5px solid #000", boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>
            <AppBar position='static'>
              <Toolbar variant="dense">
                <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>パスワードリセット</Typography>
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
              disabled={(isEmpty(password) || isEmpty(passwordConfirmation))}
              style={{marginTop:20, marginLeft:20}}
              onClick={(e) => handleSubmit()}
            >
              登録
            </Button>

            <Box component="div" sx={{ marginX: "20px", mt: 4 }}>
              <Typography variant='caption' component="div" color="primary.main" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{"[社員番号] " + zeroPadding(employeeNumber, 3)}</Typography>
            </Box>

            <Box component="div" sx={{ marginX: "20px", mt: 1 }}>
              <Typography variant='caption' component="div" color="primary.main" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{"[氏名] " + name}</Typography>
            </Box>

            <Box component="div" sx={{ marginX: "20px", mt: 4 }}>
              <FormControl size="small" variant='outlined' fullWidth required>
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
            <ConfirmDlg confirm={confirm} handleOK={handleConfirmOK} handleCancel={handleCofirmCancel} />
            <Loading isLoading={isLoading} />
          </Box>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
export default PasswordResetPage;
