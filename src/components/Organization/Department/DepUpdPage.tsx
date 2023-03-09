import { useState, useEffect } from 'react';
import { AlertType } from '../../common/cmnType';
import { cmnProps } from '../../common/cmnConst';
import ConfirmDlg, { ConfirmParam } from '../../common/ConfirmDlg';
import Loading from '../../common/Loading';
import { integerOnly } from '../../../lib/common/inputRegulation';
import { getDep, updateDep } from '../../../lib/api/organization';

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

type Props = {
  show: boolean;
  depId: number | null;
  close: (refresh?: boolean) => void;
}
type Data = {
  code: string;
  name: string;
}
const DepUpdPage = (props: Props) => {
  const [code, setCode] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [data, setData] = useState<Data>({code: "", name: ""});
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [confirm, setConfirm] = useState<ConfirmParam>( { message: "", tag: "", width: null });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 初期処理
  useEffect(() => {
    if (!isEmpty(props.depId)) {
      // パラメータ設定ありの場合のみ事業部情報取得
      setIsLoading(true);
      handleGetDep(props.depId);
    } 
  }, [props.depId]);

  // 事業部情報取得
  const handleGetDep = async (id: number | null) => {
    try {
      const res = await getDep(id);
      setData({
        code: res.data.dep.code,
        name: res.data.dep.name,
      });
      setCode(res.data.dep.code);
      setName(res.data.dep.name);
    } catch (e) {
      setErr({severity: "error", message: "事業部情報取得エラー"});
    }
    setIsLoading(false);    
  }

  // 更新ボタン制御
  const setDisabledSubmit = () => {
    if (code==="" || name==="") {
      return true;
    } else {
      if (code===data.code && name===data.name) {
        return true;
      } else {
        return false;
      }
    }
  }

  // 更新ボタン押下時の処理
  const handleSubmit = () => {
    setConfirm({
      message: "事業部を更新します。よろしいですか？",
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
    saveDep();
  }

  // 更新処理
  const saveDep = async () => {
    try {
      const res = await updateDep(props.depId, {code: code, name: name})
      if (res.data.status === 500) {
        setErr({severity: "error", message: "事業部情報更新エラー(500)"});
      } else {
        props.close(true);
        setCode("");
        setName("");
        setData({code: "", name: ""});
        setErr({severity: null, message: ""});
      }
    } catch (e) {
      setErr({severity: "error", message: "事業部情報更新エラー"});
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
    setData({code: "", name: ""});
    setErr({severity: null, message: ""});
  }

  // 画面編集
  return (
    <>
      { props.show ? (
        <Box component='div' sx={{ backgroundColor: '#fff', height: '100%', border: "0.5px solid #000", boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>
          <AppBar position='static'>
            <Toolbar variant="dense">
              <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>事業部変更</Typography>
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
            disabled={setDisabledSubmit()}
            style={{marginTop:20, marginLeft:20}}
            onClick={(e) => handleSubmit()}
          >
            更新
          </Button>

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
          { (code !== data.code) &&
          <Box component="div" sx={{ marginX: "20px" }}>
            <Typography variant='caption' component="div" color="primary.main" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{"[変更前] " + data.code}</Typography>
          </Box>
          }
          <Box component="div" sx={{ marginX: "20px", mt: 4 }}>
            <TextField
              required
              id="name"
              name="name"
              label="事業部名"
              value={name}
              variant="outlined"
              size="small"
              fullWidth
              inputProps={{maxLength:15, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              onChange={(e) => setName(e.target.value)}
            />
          </Box>
          { (name !== data.name) &&
          <Box component="div" sx={{ marginX: "20px" }}>
            <Typography variant='caption' component="div" color="primary.main" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{"[変更前] " + data.name}</Typography>
          </Box>
          }
          <ConfirmDlg confirm={confirm} handleOK={handleConfirmOK} handleCancel={handleCofirmCancel} />
          <Loading isLoading={isLoading} />
        </Box>
      ) : (
        <></>
      )}
    </>
  );
}
export default DepUpdPage;
