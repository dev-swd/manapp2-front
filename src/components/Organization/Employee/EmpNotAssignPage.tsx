import { useEffect, useState } from 'react';
import { cmnProps } from '../../common/cmnConst';
import { AlertType } from '../../common/cmnType';
import { getEmpsWhereNotAssign } from '../../../lib/api/organization';
import { zeroPadding } from '../../../lib/common/stringCom';
import PasswordResetPage from './PasswordResetPage';
import EmpUpdPage from './EmpUpdPage';
import Loading from '../../common/Loading';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import SettingsIcon from '@mui/icons-material/Settings';
import PasswordIcon from '@mui/icons-material/Password';
import { styled } from '@mui/material/styles';

const CustomCell = styled(TableCell)({
  fontSize: cmnProps.fontSize,
  fontFamily: cmnProps.fontFamily,
  zIndex: 1
});

type Emp = {
  id: number | null;
  employeeNumber: string;
  name: string;
}
type editParam = {
  show: boolean;
  id: number | null;
}
type Props = {
  show: boolean;
  close: (refresh?: boolean) => void;
}
const EmpNotAssignPage = (props: Props) => {
  const [emps, setEmps] = useState<Emp[]>([]);
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [updParam, setUpdParam] = useState<editParam>({show: false, id: null});
  const [resetParam, setResetParam] = useState<editParam>({show: false, id: null});

  // 初期処理
  useEffect(() => {
    if(props.show){
      setIsLoading(true);
      handleGetEmps();
    }
  },[props.show]);

  // 社員情報取得
  const handleGetEmps = async () => {
    try {
      const res = await getEmpsWhereNotAssign();
      setEmps(res.data.emps);
    } catch (e) {
      setErr({severity: "error", message: "社員情報取得エラー"});
    }
    setIsLoading(false);    
  }

  // 閉じるボタン押下時の処理
  const handleClose = () => {
    props.close();
    setEmps([]);
    setErr({severity: null, message: ""});
  }

  // パスワードリセット押下時の処理
  const handlePasswordReset = (empId: number | null) => {
    setResetParam({show: true, id: empId});
  }

  // パスワードリセット画面終了処理
  const closePasswordReset = () => {
    setResetParam({show: false, id: null});
  }

  // 社員情報更新押下時の処理
  const handleUpdEmp = (empId: number | null) => {
    setUpdParam({show: true, id: empId});
  }

  // 社員情報更新画面終了処理
  const closeUpdEmp = () => {
    setUpdParam({show: false, id: null});
  }

  // 画面編集
  return (
    <>
      { props.show ? (
        <Box component='div' sx={{ backgroundColor: '#fff', height: '100%', border: "0.5px solid #000", boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>
          <AppBar position='static'>
            <Toolbar variant="dense">
              <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>未所属の社員</Typography>
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

          <TableContainer component={Paper}  sx={{ maxHeight: err.severity ? 'calc(100% - 150px)' : 'calc(100% - 90px)', m: '20px', px: '20px', py: '10px', width: 'auto' }}>
            <Table sx={{ width: 800 }} stickyHeader aria-label="employees table">
              <TableHead>
                <TableRow>
                  <CustomCell component="th" sx={{ width: 100 }}>社員番号</CustomCell>
                  <CustomCell sx={{ width: 200 }}>氏名</CustomCell>
                  <CustomCell sx={{ width: 100 }}>詳細変更</CustomCell>
                  <CustomCell sx={{ width: 150 }}>パスワード</CustomCell>
                  <CustomCell sx={{ width: 250 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                { emps.map((e,i) => (
                  <TableRow
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <CustomCell>{zeroPadding(e.employeeNumber, 3)}</CustomCell>
                    <CustomCell>{e.name}</CustomCell>
                    <CustomCell>
                      <IconButton size="small" aria-label="setting" onClick={() => handleUpdEmp(e.id)}>
                        <SettingsIcon color="primary" fontSize='inherit' />
                      </IconButton>
                    </CustomCell>
                    <CustomCell>
                      <IconButton size="small" aria-label="init password" onClick={() => handlePasswordReset(e.id)}>
                        <PasswordIcon color="primary" fontSize='inherit' />
                      </IconButton>
                    </CustomCell>
                    <CustomCell />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Loading isLoading={isLoading} />
          <PasswordResetPage show={resetParam.show} empId={resetParam.id} close={closePasswordReset} />
          <EmpUpdPage show={updParam.show} empId={updParam.id} close={closeUpdEmp} />
        </Box>
      ) : (
        <></>
      )}
    </>
  );  
}
export default EmpNotAssignPage;
