import { useEffect, useState } from 'react';
import { cmnProps } from '../common/cmnConst';
import { AlertType } from '../common/cmnType';
import { getApplicationTemps, updateApplicationTemps, updateTempParams } from '../../lib/api/application';
import Loading from '../common/Loading';
import ConfirmDlg, { ConfirmParam } from '../common/ConfirmDlg';
import { isEmpty } from '../../lib/common/isEmpty';

import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import MoveUpIcon from '@mui/icons-material/MoveUp';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';

import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const CustomHead = styled(TableCell)({
  fontSize: cmnProps.fontSize,
  fontFamily: cmnProps.fontFamily,
  paddingLeft: 5,
});
const CustomCell = styled(TableCell)({
  fontSize: cmnProps.fontSize,
  fontFamily: cmnProps.fontFamily,
  padding: 5,
});

// ディレイ用
const wait = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type Props = {
  show: boolean;
  close: () => void;
}
const ApplicationPage = (props: Props) => {
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [apps, setApps] = useState<updateTempParams>({temps: []});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [confirm, setConfirm] = useState<ConfirmParam>({ message: "", tag: null, width: null });

  // 初期処理
  useEffect(() => {
    setIsLoading(true);
    handleGetTemps();
  }, [props.show]);

  // 機能Temp一覧取得
  const handleGetTemps = async () => {
    // ちらつき防止のため意図的にディレイを入れる（0.5秒）
    await wait(500);
    try {
      const res = await getApplicationTemps();
      setApps({
        temps: res.data.temps});
    } catch (e) {
      setErr({severity: "error", message: "機能Temp情報取得エラー"});
    } 
    setIsLoading(false);
  }

  // 閉じるボタン押下時の処理
  const handleClose = () => {
    props.close();
    setApps({temps: []});
    setErr({severity: null, message: ""});
  }

  // 追加ボタン押下時の処理
  const handleAdd = () => {
    setApps({
      ...apps,
      temps : [...apps.temps,
      {id: null,
      code: "",
      name: "",
      del: false,
      }]});
  }

  // Code入力時処理
  const handleChangeCode = (i: number, value: string) => {
    const tmpTemps = [...apps.temps];
    tmpTemps[i].code = value;
    setApps({
      ...apps,
      temps: tmpTemps
    })
  }

  // Name入力時処理
  const handleChangeName= (i: number, value: string) => {
    const tmpTemps = [...apps.temps];
    tmpTemps[i].name = value;
    setApps({
      ...apps,
      temps: tmpTemps
    });
  }

  // MoveUp処理
  const handleMoveUp = (i: number) => {
    if (i !== 0) {
      let _tmpTemps = apps.temps.slice(0, i-1);
      let _tmpTemp = apps.temps[i-1];
      let tmpTemp = apps.temps[i];
      let tmpTemps_ = apps.temps.slice(i+1);

      let tmpTemps = _tmpTemps.concat(tmpTemp, _tmpTemp, tmpTemps_);
      setApps({
        ...apps,
        temps: tmpTemps
      });
    }
  }

  // MoveDown処理
  const handleMoveDown = (i: number) => {
    if (i !== (apps.temps.length - 1)) {
      let _tmpTemps = apps.temps.slice(0, i);
      let tmpTemp = apps.temps[i];
      let tmpTemp_ = apps.temps[i+1];
      let tmpTemps_ = apps.temps.slice(i+2);

      let tmpTemps = _tmpTemps.concat(tmpTemp_, tmpTemp, tmpTemps_);
      setApps({
        ...apps,
        temps: tmpTemps
      });
    }
  }

  // Delete処理
  const handleDelete = (i: number) => {
    const tmpTemps = [...apps.temps];
    tmpTemps[i].del = !tmpTemps[i].del;
    setApps({
      ...apps,
      temps: tmpTemps
    });
  }

  // 保存ボタン活性判断
  const setDisabled = () => {
    if(!apps.temps.length){
      return true;
    }
    let ret: boolean = false;
    apps.temps.forEach(t => {
      if(!t.del){
        if((isEmpty(t.code) || isEmpty(t.name))){
          ret = true;
        }
      }
    });
    return ret;
  }

  // 保存ボタン押下時処理
  const handleSubmit = () => {
    setConfirm({
      message: "現在の情報で保存します。よろしいですか。",
      tag: null,
      width: 400
    });
  }

  // 登録確認OK処理
  const handleSubmitOK = (dummy :null) => {
    setConfirm({
      message: "",
      tag: null,
      width: null
    });
    setIsLoading(true);
    saveTemps();
  }

  //登録処理
  const saveTemps = async () => {
    try {
      const res = await updateApplicationTemps(apps);
      if (res.data.status === 500) {
        setErr({severity: "error", message: "機能Temp保存エラー(500)"});
      } else {
        props.close();
        setApps({temps: []});
        setErr({severity: null, message: ""});
      }
    } catch (e) {
      setErr({severity: "error", message: "機能Temp保存エラー"});
    }
    setIsLoading(false);
  }

  // 登録確認Cancel処理
  const handleSubmitCancel = () => {
    setConfirm({
      message: "",
      tag: null,
      width: null
    });
  }

  // 画面編集
  return (
    <>
      { props.show ? (
        <div className='overlay'>
          <Box component='div' sx={{ height: '100vh', width: '100vw', backgroundColor: '#fff'}}>
            <AppBar position='static'>
              <Toolbar variant="dense">
                <SettingsSuggestIcon />
                <Typography variant='caption' component="div" sx={{ ml: 1, flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>Applications 〜機能制御項目〜</Typography>
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

            <Box component='div' sx={{ mx: 5 }}>

              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<SaveAltIcon />}
                disabled={setDisabled()}
                style={{marginTop:20, marginBottom:30}}
                onClick={(e) => handleSubmit()}
              >
                保存
              </Button>
              
              <TableContainer component={Paper}>
                <Table sx={{ width: 800 }} stickyHeader aria-label="applications table">
                  <TableHead>
                    <TableRow>
                      <CustomHead sx={{ width: 200 }}>コード</CustomHead>
                      <CustomHead sx={{ width: 400 }}>機能名</CustomHead>
                      <CustomHead sx={{ width: 200 }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    { apps.temps.map((t,i) => (
                      <TableRow
                        key={i}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <CustomCell>
                          <TextField
                            required
                            fullWidth
                            error={(t.del)}
                            id={"code" + i}
                            name="code"
                            label="Code"
                            value={t.code}
                            variant="standard"
                            size="small"
                            inputProps={{maxLength:20, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                            InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                            onChange={(e) => handleChangeCode(i, e.target.value)}
                          />
                        </CustomCell>
                        <CustomCell>
                          <TextField
                            required
                            fullWidth
                            error={(t.del)}
                            id={"name" + i}
                            name="name"
                            label="Name"
                            value={t.name}
                            variant="standard"
                            size="small"
                            inputProps={{maxLength:40, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                            InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                            onChange={(e) => handleChangeName(i, e.target.value)}
                          />
                        </CustomCell>
                        <CustomCell>
                          <IconButton aria-label="move-up" onClick={() => handleMoveUp(i)} disabled={(i === 0) ? true : false }>
                            {(i === 0) ? (
                              <MoveUpIcon color="disabled" fontSize="inherit" />
                            ) : (
                              <MoveUpIcon color="primary" fontSize="inherit" />
                            )}
                          </IconButton>
                          <IconButton aria-label="move-down" onClick={() => handleMoveDown(i)} disabled={(i === (apps.temps.length-1)) ? true : false }>
                            {(i === (apps.temps.length-1)) ? (
                              <MoveDownIcon color="disabled" fontSize="inherit" />
                            ) : (
                              <MoveDownIcon color="primary" fontSize="inherit" />
                            )}
                          </IconButton>
                          <IconButton aria-label="move-down" onClick={() => handleDelete(i)}>
                            { t.del ? (
                              <RestoreFromTrashIcon color="warning" fontSize="inherit" />
                            ) : (
                              <DeleteIcon color="primary" fontSize="inherit" />
                            )}
                          </IconButton>
                        </CustomCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ textAlign: 'center' }}>
                <IconButton aria-label="Add" color="primary" size="large" onClick={() => handleAdd()}>
                  <AddCircleIcon sx={{ fontSize : 40 }} />
                </IconButton>
              </Box>
            </Box>
            <ConfirmDlg confirm={confirm} handleOK={handleSubmitOK} handleCancel={handleSubmitCancel} />
            <Loading isLoading={isLoading} />
          </Box>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
export default ApplicationPage;
