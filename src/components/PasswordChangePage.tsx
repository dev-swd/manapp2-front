import { useState } from 'react';
import { changePassword, ChangePasswordParams } from '../lib/api/deviseAuth';
import { AlertType } from './common/cmnType';
import { cmnProps } from './common/cmnConst';
import ConfirmDlg, { ConfirmParam } from './common/ConfirmDlg';
import Loading from './common/Loading';

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
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

type Props = {
  show: boolean;
  close: (refresh?: boolean) => void;
}
const PasswordsChangePage = (props: Props) => {
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [confirm, setConfirm] = useState<ConfirmParam>( { message: "", tag: "", width: null });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);
  const [passwordConShow, setPasswordConShow] = useState(false);

  // 閉じるボタン押下時の処理
  const handleClose = () => {
    setPassword("");
    setPasswordConfirmation("");
    setPasswordShow(false);
    setPasswordConShow(false);
    setErr({ severity: null,  message: ""});
    props.close();
  }

  // 登録ボタン押下時の処理
  const handleSubmit = () => {
    setConfirm({
      message: "パスワードを変更します。よろしいですか？",
      tag: "",
      width: 400,
    });
  }

  // 確認ダイアログでOK時の処理
  const handleSubmitOk = (dummy: "") => {
    setConfirm({
      message: "",
      tag: "",
      width: null,
    });
    setIsLoading(true);
    submitPassword();
  }

  // パスワード更新
  const submitPassword = async () => {
    
    const params: ChangePasswordParams = {
      password: password,
      passwordConfirmation: passwordConfirmation
    }

    try {
      const res = await changePassword(params);
      if (res === undefined) {
        setErr({severity: "error", message: "パスワード変更に失敗しました。"});
      } else {
        if (res.status === 200) {
          if(res.data.success){
            // 成功
            setErr({severity: "info", message: "パスワードを変更しました。"});
          } else {
            setErr({severity: "error", message: "パスワード変更に失敗しました。"});
          }
        } else {
          setErr({severity: "error", message: "パスワード変更APIでエラーが発生しました。"});
        }
      }
    } catch (e) {
      setErr({severity: "error", message: "パスワード変更API呼出に失敗しました。"});
    }

    setIsLoading(false);

  }

  // 確認ダイアログでCancel時の処理
  const handleSubmitCancel = () => {
    setConfirm({
      message: "",
      tag: "",
      width: null,
    });
    setIsLoading(false);
  }

  // 画面編集
  return (
    <>
      { props.show ? (
        <div className="overlay-dark">
          <Box component='div' sx={{ backgroundColor: '#fff', minHeight: '400px', border: "0.5px solid #000", boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>
            <AppBar position='static'>
              <Toolbar variant="dense">
                <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>パスワード変更</Typography>
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

              <Card sx={{ padding: '2', maxWidth: '500px', m: 5  }}>
                <CardHeader style={{ textAlign: 'center' }} title='New Password' />
                <CardContent>
                  <FormControl size="small" variant='outlined' fullWidth sx={{ mt: 2 }} required>
                    <InputLabel htmlFor="new-password" style={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>Password</InputLabel>
                    <OutlinedInput
                      id="new-password"
                      type={passwordShow ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}
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
                    <InputLabel htmlFor="new-password-confirmation" style={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>Password Confirmation</InputLabel>
                    <OutlinedInput
                      id="new-password-confirmation"
                      type={passwordConShow ? 'text' : 'password'}
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      style={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}
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
                  <Button 
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    color="primary"
                    disabled={ !password || !passwordConfirmation ? true : false}
                    onClick={(e) => handleSubmit()}
                    sx={{ mt: 2, textTransform: 'none' }}
                  >
                    Submit
                  </Button>          
                </CardContent>
              </Card>
          </Box>

          <ConfirmDlg confirm={confirm} handleOK={handleSubmitOk} handleCancel={handleSubmitCancel} />
          <Loading isLoading={isLoading} />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
export default PasswordsChangePage;
