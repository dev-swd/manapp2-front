import { useEffect, useState } from 'react';
import { cmnProps } from '../../common/cmnConst';
import { AlertType } from '../../common/cmnType';
import { AxiosResponse } from 'axios';
import { getEmpsWhereDepDirect, getEmpsWhereDiv, getDivWhereDepDummy, updateEmp } from '../../../lib/api/organization';
import { zeroPadding } from '../../../lib/common/stringCom';
import { isEmpty } from '../../../lib/common/isEmpty';
import SelectEmployee from '../../common/SelectEmployee';
import PasswordResetPage from '../Employee/PasswordResetPage';
import EmpUpdPage from '../Employee/EmpUpdPage';
import ConfirmDlg, { ConfirmParam } from '../../common/ConfirmDlg';
import MessageDig, { MessageParams } from '../../common/MessageDig';
import Loading from '../../common/Loading';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import PasswordIcon from '@mui/icons-material/Password';

const CustomCell = styled(TableCell)({
  fontSize: cmnProps.fontSize,
  fontFamily: cmnProps.fontFamily,
  zIndex: 1
});

type Props = {
  show: boolean;
  level: string;
  id: number | null;
  name1: string;
  name2: string;
  close: (refresh?: boolean) => void;
}
//type Emp = {
//  id: number | null;
//  employeeNumber: string;
//  name: string;
//}
type Emp = {
  id: number | null;
  employeeNumber: string;
  name: string;
  divisionId: number | null;
  depName: string;
  divName: string;
}
type editParam = {
  show: boolean;
  id: number | null;
}
const AssignmentPage = (props: Props) => {
  const [emps, setEmps] = useState<Emp[]>([]);
  const [thisDivId, setThisDivId] = useState<Number | null>(null);
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });

  const [emp, setEmp] = useState<Emp>({id: null, employeeNumber: "", name: "", depName: "", divName: "", divisionId: null});
  const [selectEmpReload, setSelectEmpReload] = useState<boolean>(false);

  const [updParam, setUpdParam] = useState<editParam>({show: false, id: null});
  const [resetParam, setResetParam] = useState<editParam>({show: false, id: null});

  const [confirm, setConfirm] = useState<ConfirmParam>({ message: "", tag: null, width: null });
  const [message, setMessage] = useState<MessageParams>({ message: "", width: null });
  const [isLoading1, setIsLoading1] = useState<boolean>(false);
  const [isLoading2, setIsLoading2] = useState<boolean>(false);

  // ????????????
  useEffect(() => {
    if(props.show){
      setIsLoading1(true);
      setIsLoading2(true);
      // ??????????????????
      handleGetEmps();
      // ???????????????divisionId?????????
      handleSetThisDivId();
    }
  },[props.show]);

  // ??????????????????
  const handleGetEmps = async () => {
    try {
      let res: AxiosResponse;
      if (props.level==='dep') {
        // ???????????????
        res = await getEmpsWhereDepDirect(props.id);
      } else {
        // ?????????
        res = await getEmpsWhereDiv(props.id);
      }
      setEmps(res.data.emps);
    } catch (e) {
      setErr({severity: "error", message: "???????????????????????????"});
    }
    setIsLoading1(false);
  }

  // ??????????????????division_id??????
  const handleSetThisDivId = async () => {
    if (props.level==="dep") {
      // ????????????????????????????????????????????????ID?????????
      try {
        const res = await getDivWhereDepDummy(props.id);
        setThisDivId(res.data.div.id);
      } catch (e) {
        setErr({severity: "error", message: "??????????????????ID???????????????"});
      }
    } else {
      // ?????????????????????????????????????????????
      setThisDivId(props.id);
    }
    setIsLoading2(false);
  }

  // ????????????????????????????????????
  const handleClose = () => {
    props.close();
    setEmps([]);
    setErr({severity: null, message: ""});
  }

  // ?????????????????????????????????????????????
  const handlePasswordReset = (empId: number | null) => {
    setResetParam({show: true, id: empId});
  }

  // ?????????????????????????????????????????????
  const closePasswordReset = () => {
    setResetParam({show: false, id: null});
  }

  // ????????????????????????????????????
  const handleUpdEmp = (empId: number | null) => {
    setUpdParam({show: true, id: empId});
  }

  // ????????????????????????????????????
  const closeUpdEmp = (refresh?: boolean) => {
    setUpdParam({show: false, id: null});
    if(refresh){
      setIsLoading1(true);
      handleGetEmps();
    }
  }

  // ????????????
  const handleAdd = () => {
    if (isEmpty(emp.divisionId)) {
      // ??????????????????
      setConfirm({
        message: "?????????????????????????????????????????????????????????",
        tag: { empId: emp.id, divId: thisDivId },
        width: 400
      });    
    } else {
      if (emp.divisionId === thisDivId) {
        setMessage({
          message: "????????????????????????????????????",
          width: 400
        });
      } else {
        // ???????????????????????????????????????????????????
        let name: string = "";
        if (emp.depName === emp.divName) {
          name = emp.depName;
        } else {
          name = emp.depName + " " + emp.divName;
        }
        setConfirm({
          message: name + "???????????????????????????????????????????????????????????????",
          tag: { empId: emp.id, divId: thisDivId },
          width: 400
        });    
      }
    }
  }

  // ????????????????????????OK??????????????????
  const handleConfirmOK = (param: any) => {
    setConfirm({
      message: "",
      tag: null,
      width: null
    });
    setIsLoading1(true);
    saveEmp(param);
  }

  // ????????????
  const saveEmp = async (param: any) => {
    try {
      const res = await updateEmp(param.empId, {divisionId: param.divId});
      if (res.data.status === 500) {
        setErr({severity: "error", message: "????????????????????????(500)"});
        setIsLoading1(false);
      } else {
        // ?????????????????????????????????
        handleGetEmps();
        // ?????????????????????????????????????????????????????????
        setSelectEmpReload(!selectEmpReload);
        setEmp({
          ...emp,
          divisionId: param.divId,
        })
      }
    } catch (e) {
      setErr({severity: "error", message: "????????????????????????"});
      setIsLoading1(false);
    }

  }

  // ?????????????????????????????????????????????????????????
  const handleCofirmCancel = () => {
    setConfirm({
      message: "",
      tag: null,
      width: null
    });
  }

  // ???????????????????????????OK???????????????????????????
  const handleMessageOK = () => {
    setMessage({
      message: "",
      width: null
    })
  }

  // ????????????
  const handleLift = (e: Emp) => {
    setConfirm({
      message: e.name + "???" + zeroPadding(e.employeeNumber, 3) + "??????????????????????????????????????????????????????????????????",
      tag: { empId: e.id, divId: null },
      width: 400
    });    
  }

  // ????????????
  return (
    <>
      { props.show ? (
        <Box component='div' sx={{ backgroundColor: '#fff', height: '100%', border: "0.5px solid #000", boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>
          <AppBar position='static'>
            <Toolbar variant="dense">
              <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>?????????????????????</Typography>
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

          <Box component="div" sx={{ marginX: "20px", mt: 4 }}>
            <Typography variant='caption' component="div" color="primary.main" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{"[????????????] " + props.name1 + " " + props.name2}</Typography>
          </Box>

          <Box component="div" sx={{ marginX: "20px", mt: 4, display: "flex", alignItems: "center" }}>
            <SelectEmployee 
              emp={emp}
              reload={selectEmpReload}
              setEmp={setEmp}
              setErr={setErr}
              label="??????"
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<PersonAddIcon />}
              sx={{ height: "30px", ml: 2 }}
              disabled={(isEmpty(emp.id) || isEmpty(thisDivId))}
              onClick={(e) => handleAdd()}
            >
              ??????
            </Button>
          </Box>
          
          <TableContainer component={Paper} sx={{ maxHeight: err.severity ? 'calc(100% - 150px)' : 'calc(100% - 90px)', m: '20px', px: '20px', py: '10px', width: 'auto' }}>
            <Table sx={{ width: 900 }} stickyHeader aria-label="employees table">
              <TableHead>
                <TableRow>
                  <CustomCell sx={{ width: 100 }}>????????????</CustomCell>
                  <CustomCell sx={{ width: 200 }}>??????</CustomCell>
                  <CustomCell sx={{ width: 150 }}>????????????</CustomCell>
                  <CustomCell sx={{ width: 150 }}>???????????????</CustomCell>
                  <CustomCell sx={{ width: 300 }} />
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
                    <CustomCell>
                      <IconButton aria-label="delete" size="small" onClick={() => handleLift(e)}>
                        <HighlightOffTwoToneIcon color="primary" fontSize="inherit" />
                      </IconButton>
                    </CustomCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </TableContainer>
          <PasswordResetPage show={resetParam.show} empId={resetParam.id} close={closePasswordReset} />
          <EmpUpdPage show={updParam.show} empId={updParam.id} close={closeUpdEmp} />
          <ConfirmDlg confirm={confirm} handleOK={handleConfirmOK} handleCancel={handleCofirmCancel} />
          <MessageDig params={message} handleOK={handleMessageOK} />         
          <Loading isLoading={(isLoading1 || isLoading2)} />
        </Box>
      ) : (
        <></>
      )}
    </>
  );
  
}
export default AssignmentPage;
