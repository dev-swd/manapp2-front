import { useState, useEffect } from 'react';
import { AlertType } from '../common/cmnType';
import { cmnProps } from '../common/cmnConst';
import ConfirmDlg, { ConfirmParam } from '../common/ConfirmDlg';
import Loading from '../common/Loading';
import { getApplicationTemps, createRole, RoleParams } from '../../lib/api/application';
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
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Checkbox from "@mui/material/Checkbox";

const CustomHead = styled(TableCell)({
  fontSize: cmnProps.fontSize,
  fontFamily: cmnProps.fontFamily,
  paddingLeft: 5,
  zIndex: 1
});
const CustomCell = styled(TableCell)({
  fontSize: cmnProps.fontSize,
  fontFamily: cmnProps.fontFamily,
  padding: 5,
});

// ディレイ用
const wait = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type Temp = {
  id: number | null;
  code: string;
  name: string;
}
type Props = {
  show: boolean;
  close: (refresh?: boolean) => void;
}
const RoleNewPage = (props: Props) => {
  const [temps, setTemps] = useState<Temp[]>([]);
  const [role, setRole] = useState<RoleParams>({id: null, code: "", name: "", apps: []});
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [confirm, setConfirm] = useState<ConfirmParam>( { message: "", tag: "", width: null });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 初期処理
  useEffect(() => {
    if (props.show) {
      setIsLoading(true);
      handleGetTemps();
    }
  },[props.show]);

  // 機能Temp一覧取得
  const handleGetTemps = async () => {
    // ちらつき防止のため意図的にディレイを入れる（0.5秒）
    await wait(500);
    try {
      const res = await getApplicationTemps();
      setTemps(res.data.temps);
      const tmpApps = res.data.temps.map((t:Temp) => {
        return {id: null, applicationtempId: t.id, permission: false};
      });
      setRole({
        ...role,
        apps: tmpApps
      });
    } catch (e) {
      setErr({severity: "error", message: "機能Temp情報取得エラー"});
    } 
    setIsLoading(false);
  }

  // 登録ボタン押下時の処理
  const handleSubmit = () => {
    setConfirm({
      message: "システム権限を登録します。よろしいですか？",
      tag: "",
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
    saveRole();
  }
  
  //登録処理
  const saveRole = async () => {
    try {
      const res = await createRole(role);
      if (res.data.status === 500) {
        setErr({severity: "error", message: "システム権限登録エラー(500)"});
      } else {
        props.close(true);
        setTemps([]);
        setRole({id: null, code: "", name: "", apps: []});
        setErr({severity: null, message: ""});
      }
    } catch (e) {
      setErr({severity: "error", message: "システム権限登録エラー"});
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

  // 閉じるボタン押下時の処理
  const handleClose = () => {
    props.close();
    setTemps([]);
    setRole({id: null, code: "", name: "", apps: []});
    setErr({severity: null, message: ""});
  }

  // role入力時の処理
  const handleChangeRole = (name: string, value: string) => {
    setRole({
      ...role,
      [name]: value,
    });
  }

  // apps入力時の処理
  const handleChangeApps = (i: number, value: boolean) => {
    const tmpApps = [...role.apps];
    tmpApps[i].permission = value;
    setRole({
      ...role,
      apps: tmpApps
    });
  }

  return (
    <>
      {props.show ? (
        <Box component='div' sx={{ backgroundColor: '#fff', height: '100%', border: "0.5px solid #000", boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>
          <AppBar position='static'>
            <Toolbar variant="dense">
              <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>権限新規登録</Typography>
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
            disabled={(isEmpty(role.code) || isEmpty(role.name))}
            sx={{my: 4, ml: 3}}
            onClick={(e) => handleSubmit()}
          >
            登録
          </Button>
        
          <Box component="div" sx={{ mx: 3, mb: 3 }}>
            <TextField
              required
              fullWidth
              id="code"
              name="code"
              label="Code"
              value={role.code}
              variant="outlined"
              size="small"
              autoComplete='code'
              inputProps={{maxLength:20, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              onChange={(e) => handleChangeRole("code", e.target.value)}
            />
            <TextField
              required
              fullWidth
              id="name"
              name="name"
              label="Name"
              value={role.name}
              variant="outlined"
              size="small"
              autoComplete='name'
              sx={{mt: 3}}
              inputProps={{maxLength:40, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              onChange={(e) => handleChangeRole("name", e.target.value)}
            />

            <TableContainer component={Paper} sx={{mt: 3, pl: 2}}>
              <Table sx={{ width: 700 }} stickyHeader aria-label="applications table">
                <TableHead>
                  <TableRow>
                    <CustomHead sx={{ width: 200 }}>コード</CustomHead>
                    <CustomHead sx={{ width: 400 }}>機能名</CustomHead>
                    <CustomHead sx={{ width: 100 }}>許可</CustomHead>
                  </TableRow>
                </TableHead>
                { temps.length === role.apps.length &&
                  <TableBody>
                    { temps.map((t,i) => (
                      <TableRow
                        key={i}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <CustomCell>{t.code}</CustomCell>
                        <CustomCell>{t.name}</CustomCell>
                        <CustomCell>
                          <Checkbox size="small" onChange={(e) => handleChangeApps(i, e.target.checked)} checked={role.apps[i].permission} />
                        </CustomCell>
                      </TableRow>
                    ))}
                  </TableBody>
                }
              </Table>
            </TableContainer>
          </Box>
          <ConfirmDlg confirm={confirm} handleOK={handleSubmitOK} handleCancel={handleSubmitCancel} />
          <Loading isLoading={isLoading} />
        </Box>
      ) : (
        <></>
      )}
    </>
  );
}
export default RoleNewPage;
