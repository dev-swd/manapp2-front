import React, { useEffect, useState } from 'react';
import { AlertType } from '../common/cmnType';
import Header from '../Header';
import Loading from '../common/Loading';
import ConfirmDlg, { ConfirmParam } from '../common/ConfirmDlg';
import { getDeps, deleteDep, deleteDiv } from '../../lib/api/organization';
import DepNewPage from './Department/DepNewPage';
import DepUpdPage from './Department/DepUpdPage';
import DepNodeTree from './OrgMain/DepNodeTree';
import DivNewPage from './Division/DivNewPage';
import DivUpdPage from './Division/DivUpdPage';
import EmpNewPage from './Employee/EmpNewPage';
import EmpAllPage from './Employee/EmpAllPage';
import EmpNotAssignPage from './Employee/EmpNotAssignPage';
import AssignmentPage from './Settings/AsssignmentPage';
import AdminRegPage from './Settings/AdminRegPage';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import GroupsIcon from '@mui/icons-material/Groups';
import { cmnProps } from '../common/cmnConst';

type Dep = {
  id: number | null;
  code: string;
  name: string;
}
type Div = {
  id: number | null;
  code: string;
  name: string;
}
type UpdParam = {
  show: boolean;
  id: number | null;
}
type DivNewParam = {
  show: boolean;
  dep: Dep;
}
type SettingParam = {
  show: boolean;
  level: string;
  id: number | null;
  name1: string;
  name2: string;
}
const initDep = { id: null, code: "", name: " "};

// ディレイ用
const wait = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const OrgMainPage: React.FC = () => {
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [deps, setDeps] = useState<Dep[]>([]);

  const [newDep, setNewDep] = useState<boolean>(false);
  const [updDep, setUpdDep] = useState<UpdParam>({show: false, id: null});
  const [newDiv, setNewDiv] = useState<DivNewParam>({show: false, dep: initDep});
  const [updDiv, setUpdDiv] = useState<UpdParam>({show: false, id: null});
  const [delDepConfirm, setDelDepConfirm] = useState<ConfirmParam>({ message: "", tag: null, width: null });
  const [delDivConfirm, setDelDivConfirm] = useState<ConfirmParam>({ message: "", tag: null, width: null });
  const [newEmp, setNewEmp] = useState<boolean>(false);
  const [allEmp, setAllEmp] = useState<boolean>(false);
  const [notAssignEmp, setNotAssignEmp] = useState<boolean>(false);
  const [assign, setAssign] = useState<SettingParam>({ show: false, level: "", id: null, name1: "", name2: "" });
  const [adminReg, setAdminReg] = useState<SettingParam>({ show: false, level: "", id: null, name1: "", name2: "" });

  const [leftLock, setLeftLock] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 初期処理
  useEffect(() => {
    setIsLoading(true);
    handleGetDeps();
  }, [setDeps]);

  // 事業部情報取得
  const handleGetDeps = async () => {
    // ちらつき防止のため意図的にディレイを入れる（0.5秒）
    await wait(500);
    try {
      const res = await getDeps();
      setDeps(res.data.deps);
    } catch (e) {
      setErr({severity: "error", message: "事業部情報取得エラー"});
    } 
    setIsLoading(false);
  }

  // 事業部新規作成
  const handleNewDep = () => {
    setLeftLock(true);
    setNewDep(true);
  }

  // 事業部新規作成画面終了
  const closeNewDep = (refresh?: boolean) => {
    setLeftLock(false);
    setNewDep(false);
    if(refresh){
      setIsLoading(true);
      handleGetDeps();
    }
  }

  // 事業部変更
  const handleUpdDep = (id: number | null) => {
    setLeftLock(true);
    setUpdDep({show: true, id: id});
  }

  // 事業部変更画面終了
  const closeUpdDep = (refresh?: boolean) => {
    setLeftLock(false);
    setUpdDep({show: false, id: null});
    if(refresh){
      setIsLoading(true);
      handleGetDeps();
    }
  }

  // 事業部削除ボタン押下
  const handleDelDep = (dep: Dep) => {
    setDelDepConfirm({
      message: dep.name + "（" + dep.code + "）を削除します。よろしいですか。",
      tag: dep.id,
      width: 400
    });
  }

  // 事業部削除確認ダイアログでOKの場合の処理
  const handleDelDepOk = (depId: number) => {
    setDelDepConfirm({
      message: "",
      tag: null,
      width: null
    });
    setIsLoading(true);
    delDep(depId);
  }

  // 事業部削除確認ダイアログでキャンセルの場合の処理
  const handleDelDepCancel = () => {
    setDelDepConfirm({
      message: "",
      tag: null,
      width: null
    });
  }

  // 事業部削除
  const delDep = async (depId: number | null) => {
    try {
      const res = await deleteDep(depId);
      if (res.data.status === 500) {
        setErr({severity: "error", message: "事業部情報削除エラー(500)"});
        setIsLoading(false);
      } else {
        handleGetDeps();
      }
    } catch (e) {
      setErr({severity: "error", message: "事業部情報削除エラー"});
      setIsLoading(false);
    }
  }

  // 課削除ボタン押下
  const handleDelDiv = (div: Div) => {
    setDelDivConfirm({
      message: div.name + "（" + div.code + "）を削除します。よろしいですか。",
      tag: div.id,
      width: 400
    });
  }

  // 課削除確認ダイアログでOKの場合の処理
  const handleDelDivOk = (divId: number) => {
    setDelDivConfirm({
      message: "",
      tag: null,
      width: null
    });
    setIsLoading(true);
    delDiv(divId);
  }

  // 課削除確認ダイアログでキャンセルの場合の処理
  const handleDelDivCancel = () => {
    setDelDivConfirm({
      message: "",
      tag: null,
      width: null
    });
  }

  // 課削除処理
  const delDiv = async (divId: number | null) => {
    try {
      const res = await deleteDiv(divId);
      if (res.data.status === 500) {
        setErr({severity: "error", message: "課情報削除エラー(500)"});
        setIsLoading(false);
      } else {
        handleGetDeps();
      }
    } catch (e) {
      setErr({severity: "error", message: "課情報削除エラー"});
      setIsLoading(false);
    }    
  }

  // 課新規作成
  const handleNewDiv = (dep: Dep) => {
    setLeftLock(true);
    setNewDiv({show: true, dep: dep});
  }

  // 課新規作成画面終了
  const closeNewDiv = (refresh?: boolean) => {
    setLeftLock(false);
    setNewDiv({show: false, dep: initDep});
    if(refresh){
      setIsLoading(true);
      handleGetDeps();
    }
  }

  // 課変更
  const handleUpdDiv = (id: number | null) => {
    setLeftLock(true);
    setUpdDiv({show: true, id: id});
  }

  // 課変更画面終了
  const closeUpdDiv = (refresh?: boolean) => {
    setLeftLock(false);
    setUpdDiv({show: false, id: null});
    if(refresh){
      setIsLoading(true);
      handleGetDeps();
    }
  }

  // 社員新規登録
  const handleNewEmp = () => {
    setLeftLock(true);
    setNewEmp(true);
  }

  // 社員新規登録画面終了
  const closeNewEmp = (refresh?: boolean) => {
    setLeftLock(false);
    setNewEmp(false);
    if(refresh){
      setIsLoading(true);
      handleGetDeps();
    }
  }

  // 全ての社員表示
  const handleAllEmp = () => {
    setLeftLock(true);
    setAllEmp(true);
  }

  // 全ての社員画面終了
  const closeAllEmp = (refresh?: boolean) => {
    setLeftLock(false);
    setAllEmp(false);
  }

  // 未所属の社員表示
  const handleNotAssignEmp = () => {
    setLeftLock(true);
    setNotAssignEmp(true);
  }

  // 未所属の社員画面終了
  const closeNotAssignEmp = (refresh?: boolean) => {
    setLeftLock(false);
    setNotAssignEmp(false);
  }
  
  // 社員追加／解除画面表示
  const handleAssignment = (level: string, id: number | null, name1: string, name2: string) => {
    setLeftLock(true);
    setAssign({
      show: true,
      level: level,
      id: id,
      name1: name1,
      name2: name2
    });
  }

  // 社員追加／解除画面終了
  const closeAssignment = (refresh?: boolean) => {
    setLeftLock(false);
    setAssign({
      show: false,
      level: "",
      id: null,
      name1: "",
      name2: ""
    });
  }

  // 承認者設定画面表示
  const handleAdminReg = (level: string, id: number | null, name1: string, name2: string) => {
    setLeftLock(true);
    setAdminReg({
      show: true,
      level: level,
      id: id,
      name1: name1,
      name2: name2
    });
  }

  // 社員追加／解除画面終了
  const closeAdminReg = (refresh?: boolean) => {
    setLeftLock(false);
    setAdminReg({
      show: false,
      level: "",
      id: null,
      name1: "",
      name2: ""
    });
  }

  // 画面編集
  return (
    <Box component='div' sx={{ height: '100vh', backgroundColor: '#e0e0e0'}}>

      <Header title='組織管理'/>

      <Box component='div' sx={{ pt: 6 }}>

        <Box component='div' p='5px' sx={{ display: "flex" }}>
          <Box component='div' mr='5px' sx={{ border: "0.5px solid #000", boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)", backgroundColor: '#fff', width: '40%', minWidth: '365px', height: 'calc(100vh - 60px)' }}>

            {(err.severity) &&
              <Stack sx={{width: '100%'}} spacing={1}>
                <Alert severity={err.severity}>{err.message}</Alert>
              </Stack>
            }

            <Box component='div' mt='20px' mx='5px' sx={{"@media screen and (max-width: 800px)": { display: 'none' }}}>
              <Button 
                variant="contained"
                color="primary"
                size="small"
                startIcon={<GroupAddIcon />}
                disabled={leftLock}
                style={{marginRight:10}}
                onClick={(e) => handleNewDep()}
              >
                組織追加
              </Button>
              <Button 
                variant="contained"
                color="primary"
                size="small"
                startIcon={<PersonAddAlt1Icon />}
                disabled={leftLock}
                onClick={(e) => handleNewEmp()}
              >
                社員追加
              </Button>
            </Box>

            <Box mt='20px' mx='5px' sx={{ height: err.severity ? 'calc(100% - 150px)' : 'calc(100% - 90px)', overflowY: 'auto'}}>
              <Box component='div'>
                <Button 
                  variant='contained'
                  size='small'
                  startIcon={<GroupsIcon />}
                  fullWidth
                  disabled={leftLock}
                  style={{ justifyContent: "flex-start" }}
                  sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily, height: '36px', color: '#000', backgroundColor: '#c9e9f1', borderRadius: '0px', border: '3px outset #c9e9f1', boxShadow: 'none', ":hover": { backgroundColor: '#aaddff', boxShadow: 'none' }, ":disabled": { backgroundColor: '#c9e9f1' }, "@media screen and (max-width: 800px)": { pointerEvents: 'none', color: '#a1b0c0' }}}
                  onClick={(e) => handleAllEmp()}
                >
                  全ての社員
                </Button>
              </Box>
              <Box component='div'>
                <Button 
                  variant='contained'
                  size='small'
                  startIcon={<GroupsIcon />}
                  fullWidth
                  disabled={leftLock}
                  style={{ justifyContent: "flex-start" }}
                  sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily, height: '36px', color: '#000', backgroundColor: '#c9e9f1', borderRadius: '0px', border: '3px outset #c9e9f1', boxShadow: 'none', ":hover": { backgroundColor: '#aaddff', boxShadow: 'none' }, ":disabled": { backgroundColor: '#c9e9f1' }, "@media screen and (max-width: 800px)": { pointerEvents: 'none', color: '#a1b0c0' }}}
                  onClick={(e) => handleNotAssignEmp()}
                >
                  未所属の社員
                </Button>
              </Box>
              <Box component='div'>
                { deps.length ? (
                  deps.map((d,i) => (
                    <DepNodeTree key={i} dep={d} updDep={handleUpdDep} delDep={handleDelDep} newDiv={handleNewDiv} updDiv={handleUpdDiv} delDiv={handleDelDiv} assign={handleAssignment} admin={handleAdminReg} setErr={setErr} leftLock={leftLock} />                
                  ))
                ) : (
                  <></>
                )}
              </Box>
            </Box>
            <Loading isLoading={isLoading} />
            <ConfirmDlg confirm={delDepConfirm} handleOK={handleDelDepOk} handleCancel={handleDelDepCancel} />
            <ConfirmDlg confirm={delDivConfirm} handleOK={handleDelDivOk} handleCancel={handleDelDivCancel} />
          </Box>

          <Box component='div' sx={{ height: 'calc(100vh - 60px)', width: '60%', "@media screen and (max-width: 800px)": { display: 'none' }}}>
            <DepNewPage show={newDep} close={closeNewDep} />
            <DepUpdPage show={updDep.show} depId={updDep.id} close={closeUpdDep} />
            <DivNewPage show={newDiv.show} dep={newDiv.dep} close={closeNewDiv} />
            <DivUpdPage show={updDiv.show} divId={updDiv.id} close={closeUpdDiv} />
            <EmpNewPage show={newEmp} close={closeNewEmp} />
            <EmpAllPage show={allEmp} close={closeAllEmp} />
            <EmpNotAssignPage show={notAssignEmp} close={closeNotAssignEmp} />
            <AssignmentPage show={assign.show} level={assign.level} id={assign.id} name1={assign.name1} name2={assign.name2} close={closeAssignment} />
            <AdminRegPage show={adminReg.show} level={adminReg.level} id={adminReg.id} name1={adminReg.name1} name2={adminReg.name2} close={closeAdminReg} />
          </Box>

        </Box>

      </Box>
    </Box>

  );
}
export default OrgMainPage;
