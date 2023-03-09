import { useState, useEffect } from 'react';
import { AlertType } from '../common/cmnType';
import { cmnProps } from '../common/cmnConst';
import ConfirmDlg, { ConfirmParam } from '../common/ConfirmDlg';
import Loading from '../common/Loading';
import { getRole, updateRole, RoleParams } from '../../lib/api/application';
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

type Application = {
  id: number | null;
  permission: boolean;
  applicationtempId: number | null;
  code: string;
  name: string;
}
type Role = {
  id: number | null;
  code: string;
  name: string;
}
type Props = {
  show: boolean;
  roleId: number | null;
  close: (refresh?: boolean) => void;
}
const RoleUpdPage = (props: Props) => {
  const [code, setCode] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [apps, setApps] = useState<Application[]>([]);
  const [role, setRole] = useState<Role>({id: null, code: "", name: ""});

  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [confirm, setConfirm] = useState<ConfirmParam>( { message: "", tag: "", width: null });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 初期処理
  useEffect(() => {
    if (props.show) {
      setIsLoading(true);
      handleGetRole();
    }
  },[props.show]);

  // ロール取得
  const handleGetRole = async () => {
    // ちらつき防止のため意図的にディレイを入れる（0.5秒）
    await wait(500);
    try {
      const res = await getRole(props.roleId);
      setCode(res.data.role.code);
      setName(res.data.role.name);
      setApps(res.data.apps);
      setRole(res.data.role);
    } catch (e) {
      setErr({severity: "error", message: "ロール取得エラーあああああ"});
    } 
    setIsLoading(false);
  }

  // 更新ボタン押下時の処理
  const handleSubmit = () => {
    setConfirm({
      message: "システム権限を更新します。よろしいですか？",
      tag: "",
      width: 400
    });
  }

  // 更新確認OK処理
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
      const appParams = apps.map((a:Application) => {
        return {id: a.id, applicationtempId: a.applicationtempId, permission: a.permission};
      });
      const params: RoleParams ={
        id: props.roleId,
        code: code,
        name: name,
        apps: appParams,
      }
      const res = await updateRole(props.roleId, params);
      if (res.data.status === 500) {
        setErr({severity: "error", message: "システム権限更新エラー(500)"});
      } else {
        props.close(true);
        setCode("");
        setName("");
        setApps([]);
        setErr({severity: null, message: ""});
      }
    } catch (e) {
      setErr({severity: "error", message: "システム権限更新エラー"});
    }
    setIsLoading(false);
  }

  // 更新確認Cancel処理
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
    setCode("");
    setName("");
    setApps([]);
    setErr({severity: null, message: ""});
  }

  // apps入力時の処理
  const handleChangeApps = (i: number, value: boolean) => {
    const tmpApps = [...apps];
    tmpApps[i].permission = value;
    setApps(tmpApps);
  }

  return (
    <>
      {props.show ? (
        <Box component='div' sx={{ backgroundColor: '#fff', height: '100%', border: "0.5px solid #000", boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>
          <AppBar position='static'>
            <Toolbar variant="dense">
              <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>権限変更</Typography>
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
            sx={{my: 4, ml: 3}}
            onClick={(e) => handleSubmit()}
          >
            更新
          </Button>
        
          <Box component="div" sx={{ mx: 3, mb: 3 }}>
            <TextField
              required
              fullWidth
              id="code"
              name="code"
              label="Code"
              value={code}
              variant="outlined"
              size="small"
              autoComplete='code'
              inputProps={{maxLength:20, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              onChange={(e) => setCode(e.target.value)}
            />
            { (code !== role.code) &&
            <Box component="div">
              <Typography variant='caption' component="div" color="primary.main" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{"[変更前] " + role.code}</Typography>
            </Box>
            }
            <TextField
              required
              fullWidth
              id="name"
              name="name"
              label="Name"
              value={name}
              variant="outlined"
              size="small"
              autoComplete='name'
              sx={{mt: 3}}
              inputProps={{maxLength:40, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
              onChange={(e) => setName(e.target.value)}
            />
            { (name !== role.name) &&
            <Box component="div">
              <Typography variant='caption' component="div" color="primary.main" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{"[変更前] " + role.name}</Typography>
            </Box>
            }

            <TableContainer component={Paper} sx={{mt: 3, pl: 2}}>
              <Table sx={{ width: 700 }} stickyHeader aria-label="applications table">
                <TableHead>
                  <TableRow>
                    <CustomHead sx={{ width: 200 }}>コード</CustomHead>
                    <CustomHead sx={{ width: 400 }}>機能名</CustomHead>
                    <CustomHead sx={{ width: 100 }}>許可</CustomHead>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { apps.map((a,i) => (
                    <TableRow
                      key={i}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <CustomCell>{a.code}</CustomCell>
                      <CustomCell>{a.name}</CustomCell>
                      <CustomCell>
                        <Checkbox size="small" onChange={(e) => handleChangeApps(i, e.target.checked)} checked={apps[i].permission} />
                      </CustomCell>
                    </TableRow>
                  ))}
                </TableBody>
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
export default RoleUpdPage;
