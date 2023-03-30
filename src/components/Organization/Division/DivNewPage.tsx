import { useState } from 'react';
import { AlertType } from '../../common/cmnType';
import { cmnProps } from '../../common/cmnConst';
import ConfirmDlg, { ConfirmParam } from '../../common/ConfirmDlg';
import Loading from '../../common/Loading';
import { integerOnly } from '../../../lib/common/inputRegulation';
import { createDiv } from '../../../lib/api/organization';

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
import { isEmpty } from '../../../lib/common/isEmpty';

type Dep = {
  id: number | null;
  code: string;
  name: string;
}
type Props = {
  show: boolean;
  dep: Dep;
  close: (refresh?: boolean) => void;
}
const DivNewPage = (props: Props) => {
  const [code, setCode] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [confirm, setConfirm] = useState<ConfirmParam>( { message: "", tag: "", width: null });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 登録ボタン押下時の処理
  const handleSubmit = () => {
    setConfirm({
      message: "課を登録します。よろしいですか？",
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
    saveDiv();
  }

  // 登録処理
  const saveDiv = async () => {
    try {
      const res = await createDiv({department_id: props.dep.id, code: code, name: name})
      if (res.data.status === 500) {
        setErr({severity: "error", message: "課情報登録エラー(500)"});
      } else {
        props.close(true);
        setCode("");
        setName("");
        setErr({severity: null, message: ""});
      }
    } catch (e) {
      setErr({severity: "error", message: "課情報登録エラー"});
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
    setCode("");
    setName("");
    setErr({severity: null, message: ""});
  }

  // 画面編集
  return (
    <>
      { props.show ? (
        <Box component='div' sx={{ backgroundColor: '#fff', height: '100%', border: "0.5px solid #000", boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>
          <AppBar position='static'>
            <Toolbar variant="dense">
              <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>課新規作成</Typography>
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
            disabled={(isEmpty(code) || isEmpty(name))}
            style={{marginTop:20, marginLeft:20}}
            onClick={(e) => handleSubmit()}
          >
            登録
          </Button>

          <Box component="div" sx={{ marginX: "20px", mt: 4 }}>
            <Typography variant='caption' component="div" color="primary.main" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{"[上位部門] " + props.dep.code + ": " + props.dep.name}</Typography>
          </Box>

          <Box component="div" sx={{ marginX: "20px", mt: 4 }}>
            <TextField
              required
              id="code"
              name="code"
              label="コード"
              value={code}
              variant="outlined"
              size="small"
              style={{width:"80px"}}
              inputProps={{maxLength:3, style: {textAlign:"center", fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              onChange={(e) => setCode(integerOnly(e.target.value))}
            />
          </Box>
          <Box component="div" sx={{ marginX: "20px", mt: 4 }}>
            <TextField
              required
              id="name"
              name="name"
              label="課名"
              value={name}
              variant="outlined"
              size="small"
              fullWidth
              inputProps={{maxLength:15, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              onChange={(e) => setName(e.target.value)}
            />
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
export default DivNewPage;

