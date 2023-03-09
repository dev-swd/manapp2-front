import { useEffect, useState } from 'react';
import { cmnProps } from '../common/cmnConst';
import { AlertType } from '../common/cmnType';
import { getApplicationRoles, deleteRole } from '../../lib/api/application';
import Loading from '../common/Loading';
import ConfirmDlg, { ConfirmParam } from '../common/ConfirmDlg';
import RoleNewPage from './RoleNewPage';
import RoleUpdPage from './RoleUpdPage';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from "@mui/icons-material/Delete";

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

type UpdParam = {
  show: boolean;
  id: number | null;
}
type Role = {
  id: number | null;
  code: string;
  name: string;
}
type Props = {
  show: boolean;
  close: () => void;
}
const RolesMainPage = (props: Props) => {
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [leftLock, setLeftLock] = useState<boolean>(false);

  const [newRole, setNewRole] = useState<boolean>(false);
  const [updRole, setUpdRole] = useState<UpdParam>({show: false, id: null});
  const [confirm, setConfirm] = useState<ConfirmParam>( { message: "", tag: "", width: null });

  // 初期処理
  useEffect(() => {
    setIsLoading(true);
    handleGetRoles();
  }, [props.show]);
  
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

  // 閉じるボタン押下時の処理
  const handleClose = () => {
    props.close();
    setRoles([]);
    setErr({severity: null, message: ""});
  }

  // 新規作成ボタン押下
  const handleAdd = () => {
    setLeftLock(true);
    setNewRole(true);
  }

  // 新規画面終了処理
  const handleCloseNew = (refresh?: boolean) => {
    setLeftLock(false);
    setNewRole(false);
    if(refresh){
      setIsLoading(true);
      handleGetRoles();
    }
  }

  // 変更ボタン押下
  const handleUpd = (roleId: number | null) => {
    setLeftLock(true);
    setUpdRole({show: true, id: roleId});
  }

  const handleCloseUpd = (refresh?: boolean) => {
    setLeftLock(false);
    setUpdRole({show: false, id: null});
    if(refresh){
      setIsLoading(true);
      handleGetRoles();
    }
  }

  // 削除ボタン押下
  const handleDel = (role: Role) => {
    setConfirm({
      message: role.code + " を削除します。よろしいですか？",
      tag: role.id,
      width: 400
    });
  }

  // 削除確認OK処理
  const handleDelOK = (roleId :number | null) => {
    setConfirm({
      message: "",
      tag: null,
      width: null
    });
    setIsLoading(true);
    delRole(roleId);
  }

  // 削除確認Cancel処理
  const handleDelCancel = () => {
    setConfirm({
      message: "",
      tag: null,
      width: null
    });
  }

  // 削除処理
  const delRole = async (roleId: number | null) => {
    try {
      const res = await deleteRole(roleId);
      if (res.data.status === 500) {
        setErr({severity: "error", message: "システム権限削除エラー(500)"});
        setIsLoading(false);
      } else {
        handleGetRoles();
      }
    } catch (e) {
      setErr({severity: "error", message: "システム権限削除エラー"});
      setIsLoading(false);
    }
  }

  // 画面編集
  return (
    <>
      { props.show ? (
        <div className='overlay'>
          <Box component='div' sx={{ height: '100vh', width: '100vw', backgroundColor: '#e0e0e0'}}>
            <AppBar position='static'>
              <Toolbar variant="dense">
                <SettingsSuggestIcon />
                <Typography variant='caption' component="div" sx={{ ml: 1, flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>Roles 〜システム権限〜</Typography>
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

            <Box component='div' p='5px' sx={{ display: "flex" }}>
              <Box component='div' mr='5px' sx={{ border: "0.5px solid #000", boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)", backgroundColor: '#fff', width: '40%', minWidth: '365px', height: 'calc(100vh - 60px)' }}>

                {(err.severity) &&
                  <Stack sx={{width: '100%'}} spacing={1}>
                    <Alert severity={err.severity}>{err.message}</Alert>
                  </Stack>
                }

                <Box component='div' width='95%' mt={3} mx="auto" sx={{"@media screen and (max-width: 800px)": { display: 'none' }}}>
                  <Button 
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<PlaylistAddIcon />}
                    disabled={leftLock}
                    onClick={(e) => handleAdd()}
                  >
                    権限追加
                  </Button>
                </Box>

                <TableContainer component={Paper} sx={{ width: '95%', my: 3, mx: 'auto' }}>
                  <Table sx={{ width: '95%', mx: 'auto' }} stickyHeader aria-label="applications table">
                    <TableHead>
                      <TableRow>
                        <CustomHead sx={{ width: '25%' }}>コード</CustomHead>
                        <CustomHead sx={{ width: '50%' }}>機能名</CustomHead>
                        <CustomHead sx={{ width: '25%' }} />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      { roles.map((r,i) => (
                        <TableRow
                          key={i}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <CustomCell>{r.code}</CustomCell>
                          <CustomCell>{r.name}</CustomCell>
                          <CustomCell>
                            <IconButton aria-label="update" onClick={() => handleUpd(r.id)} disabled={leftLock}>
                              { leftLock ? (
                                <SettingsIcon color="disabled" fontSize="inherit" />
                              ) : (
                                <SettingsIcon color="primary" fontSize="inherit" />
                              )}
                            </IconButton>
                            <IconButton aria-label="delete" onClick={() => handleDel(r)} disabled={leftLock}>
                              { leftLock ? (
                                <DeleteIcon color="disabled" fontSize="inherit" />
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

              </Box>
              <Box component='div' sx={{ height: 'calc(100vh - 60px)', width: '60%', "@media screen and (max-width: 800px)": { display: 'none' }}}>
                <RoleNewPage show={newRole} close={handleCloseNew} />
                <RoleUpdPage show={updRole.show} roleId={updRole.id} close={handleCloseUpd} />
              </Box>
            </Box>
          </Box>
          <ConfirmDlg confirm={confirm} handleOK={handleDelOK} handleCancel={handleDelCancel} />
          <Loading isLoading={isLoading} />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
export default RolesMainPage;
