import React, { useState, useEffect, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from './../App';
import { cmnProps, projectStatus } from './common/cmnConst';
import { AlertType } from './common/cmnType';
import { getProjectToDo, getAuditToDo } from '../lib/api/project';
import { formatDateZero } from '../lib/common/dateCom';
import Header from './Header';
import Box from '@mui/material/Box';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import { styled } from '@mui/material/styles';
import { red, orange } from '@mui/material/colors';
import { Padding } from '@mui/icons-material';

const cardWidth: number = 450; 
const cardHeight: number = 200;
const ErrorCard = styled(Box)({
  width: cardWidth, 
  height: cardHeight, 
  backgroundColor: '#fce4ec', 
  fontSize: cmnProps.fontSize, 
  fontFamily: cmnProps.fontFamily,
  boder: '0.5px solid #000',
  borderRadius: '3px',
  boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
  marginLeft: '5px',
  marginBottom: '5px',
  paddingTop: '5px'
});
const ErrorBar = styled(Box)({
  width: 'calc(100% - 10px)',
  marginLeft: 'auto',
  marginRight: 'auto',
  backgroundColor: '#f8bbd0',
  borderRadius: '3px',
  display: 'flex',
  alignItems: 'center',
  fontWeight: 'bold',
  color: '#f00'
});
const WarningCard = styled(Box)({
  width: cardWidth, 
  height: cardHeight, 
  backgroundColor: '#fff3e0', 
  fontSize: cmnProps.fontSize, 
  fontFamily: cmnProps.fontFamily,
  boder: '0.5px solid #000',
  borderRadius: '3px',
  boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
  marginLeft: '5px',
  marginBottom: '5px',
  paddingTop: '5px'
});
const WarningBar = styled(Box)({
  width: 'calc(100% - 10px)',
  marginLeft: 'auto',
  marginRight: 'auto',
  backgroundColor: '#ffe0b2',
  borderRadius: '3px',
  display: 'flex',
  alignItems: 'center',
});
const NormalCard = styled(Box)({
  width: cardWidth, 
  height: cardHeight, 
  backgroundColor: '#fff', 
  fontSize: cmnProps.fontSize, 
  fontFamily: cmnProps.fontFamily,
  boder: '0.5px solid #000',
  borderRadius: '3px',
  boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
  marginLeft: '5px',
  marginBottom: '5px',
  paddingTop: '5px'
});
const TextLine = styled(Box)({
  borderBottom: '1px inset #c8c8c8',
  paddingTop: '10px'
})

const today = new Date();

type ProjectToDo = {
  id: number | null;
  status: string;
  approvalDate: Date | null;
  number: string;
  name: string;
  developmentPeriodFr: Date | null;
  developmentPeriodTo: Date | null;
  scheduledToBeCompleted: Date | null;
}
const MainPage: React.FC = () => {
  const { isSignedIn, currentUser } = useContext(GlobalContext);
  const [prjToDos, setPrjToDos] = useState<ProjectToDo[]>([]);
  const [auditToDos, setAuditToDos] = useState<ProjectToDo[]>([]);

  const [isLoading1, setIsLoading1] = useState<boolean>(false);
  const [isLoading2, setIsLoading2] = useState<boolean>(false);
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });

  // 初期処理
  useEffect(() => {
    if(isSignedIn){
      setIsLoading1(true);
      handleGetPrj();
      //内部監査条件を追加想定
      setIsLoading2(true);
      handleGetAudit();
    }
  }, [isSignedIn]);
  
  // プロジェクトToDo情報取得
  const handleGetPrj = async () => {
    try {
      const res = await getProjectToDo(currentUser.id);
      setPrjToDos(res.data.projects);
    } catch (e) {
      setErr({severity: "error", message: "プロジェクトToDo取得エラー"});
    } 
    setIsLoading1(false);
  }

  // 内部監査ToDo情報取得
  const handleGetAudit = async () => {
    try {
      const res = await getAuditToDo();
      setAuditToDos(res.data.projects);
    } catch (e) {
      setErr({severity: "error", message: "内部監査ToDo取得エラー"});
    } 
    setIsLoading2(false);
  }

  return (
    <>
      <Header title='プロジェクト管理アプリ' />
      <Box component='div' sx={{ pt: 7, backgroundColor: '#e0e0e0', height: '100vh', width: '100vw', overflowX: 'hidden', overflowY: 'auto', display: 'flex', flexWrap: 'wrap' }}>
        { prjToDos ? (
          prjToDos.map((p,i) =>
            <div key={"prj-" + i}>
              <PrjToDo prj={p} />
            </div>
          )
        ): (
          <></>
        )}
        { auditToDos ? (
          auditToDos.map((a,i) =>
            <div key={"audit-" + i}>
              <AuditToDo prj={a} />
            </div>
          )
        ): (
          <></>
        )}
      </Box>
    </>
  )
}
export default MainPage;

type PrjProps = {
  prj: ProjectToDo;
}
// プロジェクトToDo編集
const PrjToDo = (props: PrjProps) => {
  const navigate = useNavigate();

  type CardProps = {
    children: ReactNode;
  }
  const Card = (cardProps: CardProps) => {
    switch (props.prj.status) {
      case projectStatus.planNotSubmitted:
        return (
          <ErrorCard>
            <ErrorBar>
              <ErrorIcon sx={{ fontSize:20, color: red[500] }} />
              {"プロジェクト計画書が未提出です"}
            </ErrorBar>
            {cardProps.children}
          </ErrorCard>
        );
      case projectStatus.planSendBack:
        return (
          <WarningCard>
            <WarningBar>
              < WarningIcon sx={{ fontSize:20, color: orange[500] }} />
              {"プロジェクト計画書が監査差戻となっています"}
            </WarningBar>
            {cardProps.children}
          </WarningCard>
        );
      case projectStatus.projectInProgress:
        if (props.prj.scheduledToBeCompleted! < today) {
          // 完了予定日を経過している場合
          return (
            <ErrorCard>
              <ErrorBar>
                <ErrorIcon sx={{ fontSize:20, color: red[500] }} />
                {"プロジェクト完了報告書が未提出です"}
              </ErrorBar>
              {cardProps.children}
            </ErrorCard>
          );
        } else if (props.prj.developmentPeriodTo! < today) {
          // 開発期間を経過している場合
          return (
            <WarningCard>
              <WarningBar>
                < WarningIcon sx={{ fontSize:20, color: orange[500] }} />
                {"プロジェクト完了報告書の作成時期です"}
              </WarningBar>
              {cardProps.children}
            </WarningCard>
          );
        } else {
          return (
            <NormalCard>
              {cardProps.children}
            </NormalCard>
          );
        }
      case projectStatus.reportSendBack:
        return (
          <WarningCard>
            <WarningBar>
              < WarningIcon sx={{ fontSize:20, color: orange[500] }} />
              {"プロジェクト完了報告書が監査差戻となっています"}
            </WarningBar>
            {cardProps.children}
          </WarningCard>
        );
    default:
      return (<></>);
    }
  }
  // カード編集
  return (
    <Card>
      <Box component='div' sx={{ width: 'calc(100% - 10px)', mx: 'auto', display: 'grid', gridTemplateColumns: '130px auto', gridTemplateRows: 'repeat(5, 30px)' }}>
        <TextLine component='div'>(プロジェクトNo.)</TextLine>
        <TextLine component='div'>
          <button 
            className="link-style-btn" 
            type="button" 
            onClick={() => navigate(`/project/top`,{state: {id: props.prj.id, status: props.prj.status}})}
            style={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}
            >
            {props.prj.number}
          </button>
        </TextLine>
        <TextLine>(承認日)</TextLine>
        <TextLine>{formatDateZero(props.prj.approvalDate, "YYYY年MM月DD日")}</TextLine>
        <TextLine>(状態)</TextLine>
        <TextLine>{props.prj.status}</TextLine>
        <TextLine>(開発期間)</TextLine>
        <TextLine>{formatDateZero(props.prj.developmentPeriodFr, "YYYY年MM月DD日") + " 〜 " + formatDateZero(props.prj.developmentPeriodFr, "YYYY年MM月DD日")}</TextLine>
        <TextLine>(完了予定日)</TextLine>
        <TextLine>{formatDateZero(props.prj.scheduledToBeCompleted, "YYYY年MM月DD日")}</TextLine>
      </Box>
    </Card>
  );
}

// プロジェクトToDo編集
const AuditToDo = (props: PrjProps) => {
  const navigate = useNavigate();

  type CardProps = {
    children: ReactNode;
  }
  const Card = (cardProps: CardProps) => {
    switch (props.prj.status) {
      case projectStatus.planAuditing:
        return (
          <WarningCard>
            <WarningBar>
              < WarningIcon sx={{ fontSize:20, color: orange[500] }} />
              {"プロジェクト計画書が監査待ちです"}
            </WarningBar>
            {cardProps.children}
          </WarningCard>
        );
      case projectStatus.reportAuditing:
        return (
          <WarningCard>
            <WarningBar>
              < WarningIcon sx={{ fontSize:20, color: orange[500] }} />
              {"完了報告書が監査待ちです"}
            </WarningBar>
            {cardProps.children}
          </WarningCard>
        );
    default:
      return (<></>);
    }
  }
  // カード編集
  return (
    <Card>
      <Box component='div' sx={{ width: 'calc(100% - 10px)', mx: 'auto', display: 'grid', gridTemplateColumns: '130px auto', gridTemplateRows: 'repeat(5, 30px)' }}>
        <TextLine component='div'>(プロジェクトNo.)</TextLine>
        <TextLine component='div'>
          <button 
            className="link-style-btn" 
            type="button" 
            onClick={() => navigate(`/project/top`,{state: {id: props.prj.id, status: props.prj.status}})}
            style={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}
            >
            {props.prj.number}
          </button>
        </TextLine>
        <TextLine>(承認日)</TextLine>
        <TextLine>{formatDateZero(props.prj.approvalDate, "YYYY年MM月DD日")}</TextLine>
        <TextLine>(状態)</TextLine>
        <TextLine>{props.prj.status}</TextLine>
        <TextLine>(開発期間)</TextLine>
        <TextLine>{formatDateZero(props.prj.developmentPeriodFr, "YYYY年MM月DD日") + " 〜 " + formatDateZero(props.prj.developmentPeriodFr, "YYYY年MM月DD日")}</TextLine>
        <TextLine>(完了予定日)</TextLine>
        <TextLine>{formatDateZero(props.prj.scheduledToBeCompleted, "YYYY年MM月DD日")}</TextLine>
      </Box>
    </Card>
  );
}
