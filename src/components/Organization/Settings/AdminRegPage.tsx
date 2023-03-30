import { useEffect, useState } from 'react';
import { cmnProps } from '../../common/cmnConst';
import { AlertType } from '../../common/cmnType';
import { AxiosResponse } from 'axios';
import { getApprovalsWhereDepDirect, getApprovalsWhereDiv, getDivWhereDepDummy, createApproval, createApprovalParams, deleteApproval  } from '../../../lib/api/organization';
import { zeroPadding } from '../../../lib/common/stringCom';
import { isEmpty } from '../../../lib/common/isEmpty';
import SelectEmployee from '../../common/SelectEmployee';
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
type Approval = {
  id: number | null;
  userId: number | null;
  employeeNumber: string;
  employeeName: string;
}
type Emp = {
  id: number | null;
  employeeNumber: string;
  name: string;
  divisionId: number | null;
  depName: string;
  divName: string;
}
const AdminRegPage = (props: Props) => {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [thisDivId, setThisDivId] = useState<Number | null>(null);
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });

  const [emp, setEmp] = useState<Emp>({id: null, employeeNumber: "", name: "", depName: "", divName: "", divisionId: null});

  const [message, setMessage] = useState<MessageParams>({ message: "", width: null });
  const [addConfirm, setAddConfirm] = useState<ConfirmParam>({ message: "", tag: null, width: null });
  const [liftConfirm, setLiftConfirm] = useState<ConfirmParam>({ message: "", tag: null, width: null });
  const [isLoading1, setIsLoading1] = useState<boolean>(false);
  const [isLoading2, setIsLoading2] = useState<boolean>(false);

  // 初期処理
  useEffect(() => {
    if(props.show){
      setIsLoading1(true);
      setIsLoading2(true);
      // 管理者一覧取得
      handleGetApprovals();
      // 処理対象のdivisionIdを取得
      handleSetThisDivId();
    }
  },[props.show]);

  // 承認者情報取得
  const handleGetApprovals = async () => {
    try {
      let res: AxiosResponse;
      if (props.level==='dep') {
        // 事業部直轄
        res = await getApprovalsWhereDepDirect(props.id);
      } else {
        // 課所属
        res = await getApprovalsWhereDiv(props.id);
      }
      setApprovals(res.data.approvals);
    } catch (e) {
      setErr({severity: "error", message: "承認者情報取得エラー"});
    }
    setIsLoading1(false);
  }

  // 当処理対象のdivision_id設定
  const handleSetThisDivId = async () => {
    if (props.level==="dep") {
      // 事業部の場合は、事業部ダミー課のIDを取得
      try {
        const res = await getDivWhereDepDummy(props.id);
        setThisDivId(res.data.div.id);
      } catch (e) {
        setErr({severity: "error", message: "事業部直結課ID取得エラー"});
      }
    } else {
      // 課の場合は、パラメータから設定
      setThisDivId(props.id);
    }
    setIsLoading2(false);
  }

  // 閉じるボタン押下時の処理
  const handleClose = () => {
    props.close();
    setApprovals([]);
    setErr({severity: null, message: ""});
  }

  // 管理者追加
  const handleAdd = () => {
    // 重複チェック
    const res = approvals.find((a) => a.userId === emp.id);
    if (!isEmpty(res)) {
      setMessage({
        message: "既にこの部門の管理者になっています",
        width: 400
      })
    } else {
      // 重複していなければ登録
      setAddConfirm({
        message: emp.name + "（" + zeroPadding(emp.employeeNumber, 3) + "）をこの部門の承認者に追加します。よろしいですか？",
        tag: emp.id,
        width: 400
      });    
    }
  }

  // 追加確認ダイアログでOKの場合の処理
  const handleAddConfirmOK = (empId: number) => {
    setAddConfirm({
      message: "",
      tag: null,
      width: null
    });
    setIsLoading1(true);
    addApp(empId);
  }

  // 登録処理
  const addApp = async (empId: number) => {
    try {
      const params: createApprovalParams = {
        userId: empId,
        divisionId: thisDivId
      }
      const res = await createApproval(params);
      if (res.data.status === 500) {
        setErr({severity: "error", message: "承認権限登録エラー(500)"});
        setIsLoading1(false);
      } else {
        // 登録正常時は一覧再表示
        handleGetApprovals();
      }
    } catch (e) {
      setErr({severity: "error", message: "承認権限登録エラー"});
      setIsLoading1(false);
    }
  }

  // 追加確認ダイアログでキャンセルの場合の処理
  const handleAddCofirmCancel = () => {
    setAddConfirm({
      message: "",
      tag: null,
      width: null
    });
  }

  // モーダルメッセージOKボタン押下時の処理
  const handleMessageOK = () => {
    setMessage({
      message: "",
      width: null
    })
  }

  // 管理者解除
  const handleLift = (a: Approval) => {
    setLiftConfirm({
      message: a.employeeName + "（" + zeroPadding(a.employeeNumber, 3) + "）をこの部門の管理者から解除します。よろしいですか？",
      tag: a.id,
      width: 400
    });    
  }

  // 解除確認ダイアログでOKの場合の処理
  const handleLiftConfirmOK = async (id: number) => {
    setLiftConfirm({
      message: "",
      tag: null,
      width: null
    });
    setIsLoading1(true);
    delApp(id);
  }

  // 削除処理
  const delApp = async (id: number) => {
    try {
      const res = await deleteApproval(id);
      if (res.data.status === 500) {
        setErr({severity: "error", message: "承認権限削除エラー(500)"});
        setIsLoading1(false);
      } else {
        // 削除正常時は一覧再表示
        handleGetApprovals();
      }
    } catch (e) {
      setErr({severity: "error", message: "承認権限削除エラー"});
      setIsLoading1(false);
    }
  }

  // 解除確認ダイアログでキャンセルの場合の処理
  const handleLiftCofirmCancel = () => {
    setLiftConfirm({
      message: "",
      tag: null,
      width: null
    });
  }

  // 画面編集
  return (
    <>
      { props.show ? (
        <Box component='div' sx={{ backgroundColor: '#fff', height: '100%', border: "0.5px solid #000", boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>
          <AppBar position='static'>
            <Toolbar variant="dense">
              <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>承認者設定</Typography>
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
            <Typography variant='caption' component="div" color="primary.main" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{"[設定部門] " + props.name1 + " " + props.name2}</Typography>
          </Box>

          <Box component="div" sx={{ marginX: "20px", mt: 4, display: "flex", alignItems: "center" }}>
            <SelectEmployee 
              emp={emp}
              reload={true}
              setEmp={setEmp}
              setErr={setErr}
              label="社員"
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
              追加
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ maxHeight: err.severity ? 'calc(100% - 150px)' : 'calc(100% - 90px)', m: '20px', px: '20px', py: '10px', width: 'auto' }}>
            <Table sx={{ width: 900 }} stickyHeader aria-label="employees table">
              <TableHead>
                <TableRow>
                  <CustomCell sx={{ width: 100 }}>社員番号</CustomCell>
                  <CustomCell sx={{ width: 200 }}>氏名</CustomCell>
                  <CustomCell sx={{ width: 600 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                { approvals.map((a,i) => (
                  <TableRow
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <CustomCell>{zeroPadding(a.employeeNumber, 3)}</CustomCell>
                    <CustomCell>{a.employeeName}</CustomCell>
                    <CustomCell>
                      <IconButton aria-label="delete" size="small" onClick={() => handleLift(a)}>
                        <HighlightOffTwoToneIcon color="primary" fontSize="inherit" />
                      </IconButton>
                    </CustomCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </TableContainer>
          <ConfirmDlg confirm={addConfirm} handleOK={handleAddConfirmOK} handleCancel={handleAddCofirmCancel} />
          <ConfirmDlg confirm={liftConfirm} handleOK={handleLiftConfirmOK} handleCancel={handleLiftCofirmCancel} />
          <MessageDig params={message} handleOK={handleMessageOK} />
          <Loading isLoading={(isLoading1 || isLoading2)} />
        </Box>
      ) : (
        <></>
      )}
    </>
  )
}
export default AdminRegPage;
