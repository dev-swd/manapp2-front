import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from './../../../App';
import { AlertType } from './../../common/cmnType';
import { cmnProps, projectStatus } from './../../common/cmnConst';
import ConfirmDlg, { ConfirmParam } from './../../common/ConfirmDlg';
import Loading from './../../common/Loading';
import { decimalOnly, phoneOnly } from '../../../lib/common/inputRegulation';
import { getDivs } from '../../../lib/api/organization';
import SelectEmployeeId from '../../common/SelectEmployeeId';
import InputNumber from '../../common/InputNumber';
import { getProject, updateProject, projectUpdParam, phaseParam, riskParam, goalParam, memberParam } from '../../../lib/api/project';
import EmpSelectDialog from './EmpSelectDialog';
import { formatDateZero } from '../../../lib/common/dateCom';
import { isEmpty } from '../../../lib/common/isEmpty';
import LogEditPage from '../Log/LogEditPage';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from "@mui/material/MenuItem";
import { LocalizationProvider, DatePicker } from  '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import ja from 'date-fns/locale/ja'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import MoveUpIcon from '@mui/icons-material/MoveUp';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import Chip from '@mui/material/Chip';
import DoneIcon from '@mui/icons-material/Done';
import Snackbar from '@mui/material/Snackbar';
import Drawer from '@mui/material/Drawer';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Typography from '@mui/material/Typography';

import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';

// DatePickerのためのStyle
const styles = {
  paperprops: {
    'div[role=presentation]': {
      display: 'flex',
      '& .PrivatePickersFadeTransitionGroup-root:first-of-type': {
        order: 2
      },
      '& .PrivatePickersFadeTransitionGroup-root:nth-of-type(2)': {
        order: 1,
        '& div::after':{
          content: '"年"'
        }
      },
      '& .MuiButtonBase-root': {
        order: 3
      }
    }
  }
}

const CustomCell = styled(TableCell)({
  fontSize: cmnProps.fontSize,
  fontFamily: cmnProps.fontFamily,
  padding: 5,
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const dateDispForm = "YYYY年MM月DD日";

type Div = {
  id: number;
  depCode: string;
  depName: string;
  code: string;
  name: string;
}
type Props = {
  projectId: number | null;
  kbn: number;
}
const PrjEditPage = (props: Props) => {
  const { currentUser } = useContext(GlobalContext);
  const [beforeStatus, setBeforeStatus] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [approvalName, setApprovalName] = useState<string>("");
  const [approvalDate, setApprovalDate] = useState<Date | null>(null);
  const [divisionId, setDivisionId] = useState<number | null>(null);
  const [plId, setPlId] = useState<{id:number | null, flg: boolean}>({id: null, flg: false});
  const [number, setNumber] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [makeDate, setMakeDate] = useState<Date | null>(null);
  const [makeId, setMakeId] = useState<{id:number | null, flg: boolean}>({id: null, flg: false});
  const [updateDate, setUpdateDate] = useState<Date | null>(null);
  const [updateId, setUpdateId] = useState<{id:number | null, flg: boolean}>({id: null, flg: false});
  const [companyName, setCompanyName] = useState<string>("");
  const [departmentName, setDepartmentName] = useState<string>("");
  const [personinchargeName, setPersoninchargeName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [fax, setFax] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [developmentPeriodFr, setDevelopmentPeriodFr] = useState<Date | null>(null);
  const [developmentPeriodTo, setDevelopmentPeriodTo] = useState<Date | null>(null);
  const [scheduledToBeCompleted, setScheduledToBeCompleted] = useState<Date | null>(null);
  const [systemOverview, setSystemOverview] = useState<string>("");
  const [developmentEnvironment, setDevelopmentEnvironment] = useState<string>("");
  const [orderAmount, setOrderAmount] = useState<number | null>(null);
  const [plannedWorkCost, setPlannedWorkCost] = useState<number | null>(null);
  const [plannedWorkload, setPlannedWorkload] = useState<string>("");
  const [plannedPurchasingCost, setPlannedPurchasingCost] = useState<number | null>(null);
  const [plannedOutsourcingCost, setPlannedOutsourcingCost] = useState<number | null>(null);
  const [plannedOutsourcingWorkload, setPlannedOutsourcingWorkload] = useState<string>("");
  const [plannedExpensesCost, setPlannedExpensesCost] = useState<number | null>(null);
  const [workPlaceKbn, setWorkPlaceKbn] = useState<string>("自社内");
  const [workPlace, setWorkPlace] = useState<string>("");
  const [customerPropertyKbn, setCustomerPropertyKbn] = useState<string>("無");
  const [customerProperty, setCustomerProperty] = useState<string>("");
  const [customerEnvironment, setCustomerEnvironment] = useState<string>("無");
  const [purchasingGoodsKbn, setPurchasingGoodsKbn] = useState<string>("無");
  const [purchasingGoods, setPurchasingGoods] = useState<string>("");
  const [outsourcingKbn, setOutsourcingKbn] = useState<string>("無");
  const [outsourcing, setOutsourcing] = useState<string>("");
  const [customerRequirementKbn, setCustomerRequirementKbn] = useState<string>("無");
  const [customerRequirement, setCustomerRequirement] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [phases, setPhases] = useState<phaseParam[]>([]);
  const [risks, setRisks] = useState<riskParam[]>([]);
  const [goals, setGoals] = useState<goalParam[]>([]);
  const [members, setMembers] = useState<memberParam[]>([]);
  const [divs, setDivs] = useState<Div[]>([]);
  const [log, setLog] = useState<string>("");

  const [err, setErr] = useState<AlertType>({severity: null, message: ""});
  const [isLoading1, setIsLoading1] = useState<boolean>(false);
  const [isLoading2, setIsLoading2] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<ConfirmParam>( { message: "", tag: "", width: null });
  const [snackbar, setSnackbar] = useState<{show: boolean, message: string}>({show: false, message: ""});
  const [inputErr, setInputErr] = useState<AlertType[]>([]);
  const [showErr, setShowErr] = useState<boolean>(false);

  const [showMemberAdd, setShowMemberAdd] = useState<boolean>(false);
  const [modify, setModify] = useState<boolean>(false);

  // 初期処理
  useEffect(() => {
    if(props.projectId){
      setIsLoading1(true);
      handleGetDivs();
      setIsLoading2(true);
      handleGetProject();
    }
  }, [props.projectId]);
  
  // 課情報取得
  const handleGetDivs = async () => {
    try {
      const res = await getDivs();
      setDivs(res.data.divs);
    } catch (e) {
      setErr({severity: "error", message: "課情報取得エラー"});
    } 
    setIsLoading1(false);
  }
  
  // プロジェクト取得
  const handleGetProject = async () => {
    try {
      const res = await getProject(props.projectId);
      // プロジェクト
      setBeforeStatus(res.data.project.status ?? '')
      setStatus(res.data.project.status ?? '');
      setApprovalName(res.data.project.approvalName ?? '');
      setApprovalDate(res.data.project.approvalDate);
      setDivisionId(res.data.project.divisionId);
      setPlId({id: res.data.project.plId, flg: true});
      setNumber(res.data.project.number ?? '');
      setName(res.data.project.name ?? '');
      setMakeDate(res.data.project.makeDate);
      setMakeId({id: res.data.project.makeId, flg: true});
      setUpdateDate(res.data.project.updateDate);
      setUpdateId({id: res.data.project.updateId, flg: true});
      setCompanyName(res.data.project.companyName ?? '');
      setDepartmentName(res.data.project.departmentName ?? '');
      setPersoninchargeName(res.data.project.personinchargeName ?? '');
      setPhone(res.data.project.phone ?? '');
      setFax(res.data.project.fax ?? '');
      setEmail(res.data.project.email ?? '');
      setDevelopmentPeriodFr(res.data.project.developmentPeriodFr);
      setDevelopmentPeriodTo(res.data.project.developmentPeriodTo);
      setScheduledToBeCompleted(res.data.project.scheduledToBeCompleted);
      setSystemOverview(res.data.project.systemOverview ?? '');
      setDevelopmentEnvironment(res.data.project.developmentEnvironment ?? '');
      setOrderAmount(res.data.project.orderAmount);
      setPlannedWorkCost(res.data.project.plannedWorkCost);
      setPlannedWorkload(res.data.project.plannedWorkload ?? '');
      setPlannedPurchasingCost(res.data.project.plannedPurchasingCost);
      setPlannedOutsourcingCost(res.data.project.plannedOutsourcingCost);
      setPlannedOutsourcingWorkload(res.data.project.plannedOutsourcingWorkload ?? '');
      setPlannedExpensesCost(res.data.project.plannedExpensesCost);
      setWorkPlaceKbn(res.data.project.workPlaceKbn ?? '自社内');
      setWorkPlace(res.data.project.workPlace ?? '');
      setCustomerPropertyKbn(res.data.project.customerPropertyKbn ?? '無');
      setCustomerProperty(res.data.project.customerProperty ?? '');
      setCustomerEnvironment(res.data.project.customerEnvironment ?? '無');
      setPurchasingGoodsKbn(res.data.project.purchasingGoodsKbn ?? '無');
      setPurchasingGoods(res.data.project.purchasingGoods ?? '');
      setOutsourcingKbn(res.data.project.outsourcingKbn ?? '無');
      setOutsourcing(res.data.project.outsourcing ?? '');
      setCustomerRequirementKbn(res.data.project.customerRequirementKbn ?? '無');
      setCustomerRequirement(res.data.project.customerRequirement ?? '');
      setRemarks(res.data.project.remarks ?? '');
      // 工程
      const tmpPhases = res.data.phases.map((p: phaseParam) => {
        const tmpPhase: phaseParam = {
          id: p.id,
          projectId: p.projectId,
          number: p.number,
          name: p.name,
          plannedPeriodfr: p.plannedPeriodfr,
          plannedPeriodto: p.plannedPeriodto,
          deliverables: p.deliverables,
          criteria: p.criteria,
          del: false
        }
        return tmpPhase;
      });
      setPhases(tmpPhases);
      // リスク
      const tmpRisks = res.data.risks.map((r: riskParam) => {
        const tmpRisk: riskParam = {
          id: r.id,
          projectId: r.projectId,
          number: r.number,
          contents: r.contents,
          del: false
        }
        return tmpRisk;
      });
      setRisks(tmpRisks);
      // 品質目標
      const tmpGoals = res.data.goals.map((g: goalParam) => {
        const tmpGoal: goalParam = {
          id: g.id,
          projectId: g.projectId,
          number: g.number,
          contents: g.contents,
          del: false
        }
        return tmpGoal;
      });
      setGoals(tmpGoals);
      // プロジェクトメンバー
      const tmpMembers = res.data.members.map((m: memberParam) => {
        const tmpMember: memberParam = {
          id: m.id,
          projectId: m.projectId,
          number: m.number,
          level: m.level,
          memberId: m.memberId,
          memberName: m.memberName,
          tag: m.tag,
          del: false
        }
        return tmpMember;
      });
      setMembers(tmpMembers);
    } catch (e) {
      setErr({severity: "error", message: "プロジェクト情報取得エラー"});
    } 
    setIsLoading2(false);
  }

  // PL変更時の処理
  const handleChangePlId = (id: number | null) => {
    setPlId({id: id, flg: true});
  }

  // 作成者変更時の処理
  const handleChangeMakeId = (id: number | null) => {
    setMakeId({id: id, flg: true});
  }

  // 作成者変更時の処理
  const handleChangeUpdateId = (id: number | null) => {
    setUpdateId({id: id, flg: true});
  }

  // 粗利計算
  const calcGrossProfit = () => {
    let oa: number = orderAmount ? orderAmount : 0;
    let pwc: number = plannedWorkCost ? plannedWorkCost : 0;
    let ppc: number = plannedPurchasingCost ? plannedPurchasingCost : 0;
    let poc: number = plannedOutsourcingCost ? plannedOutsourcingCost : 0;
    let pec: number = plannedExpensesCost ? plannedExpensesCost : 0;
    return oa - pwc - ppc - poc - pec;
  }

  // 工程追加
  const handleAddPhase = () => {
    setPhases([...phases,
      {id: null,
      projectId: null,
      number: null,
      name: "",
      plannedPeriodfr: null,
      plannedPeriodto: null,
      deliverables: "",
      criteria: "",
      del: false
    }]);
  }

  // 工程名称入力
  const handleChangePhaseName = (i: number, value: string) => {
    const tmpPhases = [...phases];
    tmpPhases[i].name = value;
    setPhases(tmpPhases);
  }

  // 工程開始予定入力
  const handleChangePhasePeriodFr = (i: number, value: Date | null) => {
    const tmpPhases = [...phases];
    tmpPhases[i].plannedPeriodfr = value;
    setPhases(tmpPhases);
  }

  // 工程終了予定入力
  const handleChangePhasePeriodTo = (i: number, value: Date | null) => {
    const tmpPhases = [...phases];
    tmpPhases[i].plannedPeriodto = value;
    setPhases(tmpPhases);
  }

  // 工程成果物入力
  const handleChangePhaseDeliverables = (i: number, value: string) => {
    const tmpPhases = [...phases];
    tmpPhases[i].deliverables = value;
    setPhases(tmpPhases);
  }

  // 工程合否判定基準入力
  const handleChangePhaseCriteria = (i: number, value: string) => {
    const tmpPhases = [...phases];
    tmpPhases[i].criteria = value;
    setPhases(tmpPhases);
  }

  // 工程MoveUp処理
  const handleMoveUpPhase = (i: number) => {
    if (i !== 0) {
      let _tmpPhases = phases.slice(0, i-1);
      let _tmpPhase = phases[i-1];
      let tmpPhase = phases[i];
      let tmpPhases_ = phases.slice(i+1);
      let tmpPhases = _tmpPhases.concat(tmpPhase, _tmpPhase, tmpPhases_);
      setPhases(tmpPhases);
    }
  }

  // 工程MoveDown処理
  const handleMoveDownPhase = (i: number) => {
    if (i !== (phases.length - 1)) {
      let _tmpPhases = phases.slice(0, i);
      let tmpPhase = phases[i];
      let tmpPhase_ = phases[i+1];
      let tmpPhases_ = phases.slice(i+2);
      let tmpPhases = _tmpPhases.concat(tmpPhase_, tmpPhase, tmpPhases_);
      setPhases(tmpPhases);
    }
  }

  // 工程削除
  const handleDeletePhase = (i: number) => {
    const tmpPhases = [...phases];
    tmpPhases[i].del = !tmpPhases[i].del;
    setPhases(tmpPhases);
  }

  // リスク追加
  const handleAddRisk = () => {
    setRisks([...risks,
      {id: null,
      projectId: null,
      number: null,
      contents: "",
      del: false
    }]);
  }

  // リスク入力
  const handleChangeRisk = (i: number, value: string) => {
    const tmpRisks = [...risks];
    tmpRisks[i].contents = value;
    setRisks(tmpRisks);
  }

  // リスクMoveUp処理
  const handleMoveUpRisk = (i: number) => {
    if (i !== 0) {
      let _tmpRisks = risks.slice(0, i-1);
      let _tmpRisk = risks[i-1];
      let tmpRisk = risks[i];
      let tmpRisks_ = risks.slice(i+1);
      let tmpRisks = _tmpRisks.concat(tmpRisk, _tmpRisk, tmpRisks_);
      setRisks(tmpRisks);
    }
  }

  // リスクMoveDown処理
  const handleMoveDownRisk = (i: number) => {
    if (i !== (risks.length - 1)) {
      let _tmpRisks = risks.slice(0, i);
      let tmpRisk = risks[i];
      let tmpRisk_ = risks[i+1];
      let tmpRisks_ = risks.slice(i+2);
      let tmpRisks = _tmpRisks.concat(tmpRisk_, tmpRisk, tmpRisks_);
      setRisks(tmpRisks);
    }
  }

  // リスク削除
  const handleDeleteRisk = (i: number) => {
    const tmpRisks = [...risks];
    tmpRisks[i].del = !tmpRisks[i].del;
    setRisks(tmpRisks);
  }

  // 品質目標追加
  const handleAddGoal = () => {
    setGoals([...goals,
      {id: null,
      projectId: null,
      number: null,
      contents: "",
      del: false
    }]);
  }

  // 品質目標入力
  const handleChangeGoal = (i: number, value: string) => {
    const tmpGoals = [...goals];
    tmpGoals[i].contents = value;
    setGoals(tmpGoals);
  }

  // 品質目標MoveUp処理
  const handleMoveUpGoal = (i: number) => {
    if (i !== 0) {
      let _tmpGoals = goals.slice(0, i-1);
      let _tmpGoal = goals[i-1];
      let tmpGoal = goals[i];
      let tmpGoals_ = goals.slice(i+1);
      let tmpGoals = _tmpGoals.concat(tmpGoal, _tmpGoal, tmpGoals_);
      setGoals(tmpGoals);
    }
  }

  // 品質目標MoveDown処理
  const handleMoveDownGoal = (i: number) => {
    if (i !== (goals.length - 1)) {
      let _tmpGoals = goals.slice(0, i);
      let tmpGoal = goals[i];
      let tmpGoal_ = goals[i+1];
      let tmpGoals_ = goals.slice(i+2);
      let tmpGoals = _tmpGoals.concat(tmpGoal_, tmpGoal, tmpGoals_);
      setGoals(tmpGoals);
    }
  }

  // 品質目標削除
  const handleDeleteGoal = (i: number) => {
    const tmpGoals = [...goals];
    tmpGoals[i].del = !tmpGoals[i].del;
    setGoals(tmpGoals);
  }
  
  // メンバー追加画面表示
  const handleAddMember = () => {
    setShowMemberAdd(true);
  }

  // メンバー追加
  const handleAddMemberSubmit = (id: number | null, name: string) => {
    setMembers([...members,
      {id: null,
      projectId: null,
      number: null,
      level: "emp",
      memberId: id,
      memberName: name,
      tag: "",
      del: false
    }]);
  }

  // メンバー追加画面終了
  const handleCloseAddMember = () => {
    setShowMemberAdd(false);
  }

  // メンバー削除
  const handleDeleteMem = (i: number) => {
    const tmpMembers = [...members];
    tmpMembers[i].del = !tmpMembers[i].del;
    setMembers(tmpMembers);
  }

  // 入力チェック
  const checkInput = () => {
    let err: AlertType[] = [];

    // 作成日
    if (isEmpty(makeDate)) {
      err[err.length] = {severity: 'error', message: "作成日が未入力です。"};
    }

    // 作成者
    if (isEmpty(makeId)) {
      err[err.length] = {severity: 'error', message: "作成者が未選択です。"};
    }

    // 変更の場合
    if (props.kbn===1){
      // 変更日
      if (isEmpty(updateDate)) {
        err[err.length] = {severity: 'error', message: "変更日が未入力です。"};
      }
  
      // 変更者
      if (isEmpty(updateId)) {
        err[err.length] = {severity: 'error', message: "変更者が未選択です。"};
      }  
    }

    // 取引先会社名
    if (isEmpty(companyName)) {
      // いずれか未入力の場合エラー
      err[err.length] = {severity: 'error', message: "取引先会社名が未入力です。"};
    }

    // 開発期間
    if (isEmpty(developmentPeriodFr) || isEmpty(developmentPeriodTo)) {
      // いずれか未入力の場合エラー
      err[err.length] = {severity: 'error', message: "開発期間（自・至）が未入力です。"};
    } else {
      if (developmentPeriodFr! > developmentPeriodTo!) {
        // 開始＞終了の場合エラー
        err[err.length] = {severity: 'error', message: "開発期間が不正です（自＜至）"};
      }
    }

    // 完了予定日
    if (isEmpty(scheduledToBeCompleted)) {
      err[err.length] = {severity: 'error', message: "完了予定日が未入力です。"};
    }

    // システム概要
    if (isEmpty(systemOverview)) {
      err[err.length] = {severity: 'error', message: "システム概要が未入力です。"};
    }

    // 開発環境
    if (isEmpty(developmentEnvironment)) {
      err[err.length] = {severity: 'error', message: "開発環境が未入力です。"};
    }

    // 作業場所
    if (workPlaceKbn==="社外") {
      if (isEmpty(workPlace)) {
        err[err.length] = {severity: 'error', message: "作業場所「社外」が選択されていますが、作業場所概略が未入力です。"};
      }
    }

    // 顧客所有物
    if (customerPropertyKbn==="有") {
      if (isEmpty(customerProperty)) {
        err[err.length] = {severity: 'error', message: "顧客所有物「有」が選択されていますが、顧客所有物概略が未入力です。"};
      }  
    }

    // 仕入品
    if (purchasingGoodsKbn==="有") {
      if (isEmpty(purchasingGoods)) {
        err[err.length] = {severity: 'error', message: "仕入品「有」が選択されていますが、仕入品概略が未入力です。"};
      }  
    }

    // 外部委託
    if (outsourcingKbn==="有") {
      if (isEmpty(outsourcing)) {
        err[err.length] = {severity: 'error', message: "外部委託「有」が選択されていますが、外部委託先が未入力です。"};
      }  
    }

    // 顧客要求仕様書
    if (customerRequirementKbn==="有") {
      if (isEmpty(customerRequirement)) {
        err[err.length] = {severity: 'error', message: "顧客要求仕様書「有」が選択されていますが、文書名が未入力です。"};
      }  
    }

    // 受注範囲
    const phaseCnt = phases.reduce((total,item) => {
      return total + (!(item.del) ? 1 : 0);
    },0);
    if (phaseCnt === 0) {
      err[err.length] = {severity: 'error', message: "受注範囲が１件も入力されていません。"};  
    }
    phases.forEach((phase,i) => {
      if (!(phase.del)) {
        if (isEmpty(phase.name) || isEmpty(phase.plannedPeriodfr) || isEmpty(phase.plannedPeriodto) || isEmpty(phase.deliverables) || isEmpty(phase.criteria)) {
          // いずれか未入力の場合エラー
          err[err.length] = {severity: 'error', message: `受注範囲に未入力があります。（${i + 1}行目）`};  
        }
        if (!isEmpty(phase.plannedPeriodfr) && !isEmpty(phase.plannedPeriodto)) {
          if (phase.plannedPeriodfr! > phase.plannedPeriodto!) {
            // 開始＞終了の場合エラー
            err[err.length] = {severity: 'error', message: `受注範囲の開始予定・終了予定が不正です。（開始＜終了）（${i + 1}行目）`};    
          }
        }
      }
    });

    // リスク
    const riskCnt = risks.reduce((total,item) => {
      return total + (!(item.del) ? 1 : 0);
    },0);
    if (riskCnt === 0) {
      err[err.length] = {severity: 'error', message: "リスクが１件も入力されていません。"};  
    }
    risks.forEach((risk,i) => {
      if (!(risk.del)) {
        if (isEmpty(risk.contents)) {
          err[err.length] = {severity: 'error', message: `リスクが未入力です。（${i + 1}行目）`};  
        }
      }
    });

    // 品質目標
    const goalCnt = goals.reduce((total,item) => {
      return total + (!(item.del) ? 1 : 0);
    },0);
    if (goalCnt === 0) {
      err[err.length] = {severity: 'error', message: "品質目標が１件も入力されていません。"};  
    }
    goals.forEach((goal,i) => {
      if (!(goal.del)) {
        if (isEmpty(goal.contents)) {
          err[err.length] = {severity: 'error', message: `品質目標が未入力です。（${i + 1}行目）`};  
        }
      }
    });

    // プロジェクトメンバー
    const memCnt = members.reduce((total,item) => {
      return total + (!(item.del) ? 1 : 0);
    },0);
    if (memCnt === 0) {
      err[err.length] = {severity: 'error', message: "プロジェクトメンバーが１人も設定されていません。"};  
    }

    if (err.length > 0) {
      setInputErr(err);
      return true;
    } else {
      return false;
    }
  }

  // 一時保存
  const handleUpdate = () => {
    setConfirm({
      message: "この内容で一時保存します。よろしいですか？",
      tag: "",
      width: null
    });
  }

  // 提出
  const handleSubmit = () => {
    // 入力チェック
    if (!checkInput()) {
      setStatus(projectStatus.planAuditing);
      setConfirm({
        message: "この内容でプロジェクト計画書を提出します。よろしいですか？",
        tag: "",
        width: null
      });
    } else {
      setErr({severity: "error", message: "入力内容に誤りがあります。（クリックすると詳細が確認できます）"});
    }
  }

  // 確認ダイアログでOKの場合の処理
  const handleConfirmOK = (dummy: string) => {
    setConfirm({
      message: "",
      tag: "",
      width: null
    });
    setIsLoading2(true);
    saveProject();
  }

  // 変更登録
  const handleModify = () => {
    // 入力チェック
    if (!checkInput()) {
      setModify(true);
    } else {
      setErr({severity: "error", message: "入力内容に誤りがあります。（クリックすると詳細が確認できます）"});
    }
  }

  // 変更ログ画面でOKボタン押下時の処理
  const handleModifyOK = () => {
    setModify(false);
    setIsLoading2(true);
    saveProject();
  }

  // プロジェクト更新
  const saveProject = async () => {
    try {
      const res = await updateProject(props.projectId, updateParams);
      if (res.status === 200 && res.data.status === 200){
        setSnackbar({show: true, message: "更新しました。"});
        setInputErr([]);
        setErr({severity: null, message: ""});
        // データリフレッシュ
        handleGetProject();
      } else {
        setErr({severity: "error", message: `プロジェクト情報更新エラー(${res.status})`});
        setIsLoading2(false);    
      }
    } catch (e) {
      setErr({severity: "error", message: "プロジェクト情報更新エラー"});
      setIsLoading2(false);    
    }
  }

  // 更新パラメータセット
  const updateParams: projectUpdParam = {
    project: {
      id: null,
      status: status,
      divisionId: divisionId,
      plId: plId.id,
      number: number,
      name: name,
      makeDate: makeDate,
      makeId: makeId.id,
      updateDate: updateDate,
      updateId: updateId.id,
      companyName: companyName,
      departmentName: departmentName,
      personinchargeName: personinchargeName,
      phone: phone,
      fax: fax,
      email: email,
      developmentPeriodFr: developmentPeriodFr,
      developmentPeriodTo: developmentPeriodTo,
      scheduledToBeCompleted: scheduledToBeCompleted,
      systemOverview: systemOverview,
      developmentEnvironment: developmentEnvironment,
      orderAmount: orderAmount,
      plannedWorkCost: plannedWorkCost,
      plannedWorkload: Number(plannedWorkload),
      plannedPurchasingCost: plannedPurchasingCost,
      plannedOutsourcingCost: plannedOutsourcingCost,
      plannedOutsourcingWorkload: Number(plannedOutsourcingWorkload),
      plannedExpensesCost: plannedExpensesCost,
      grossProfit: calcGrossProfit(),
      workPlaceKbn: workPlaceKbn,
      workPlace: workPlace,
      customerPropertyKbn: customerPropertyKbn,
      customerProperty: customerProperty,
      customerEnvironment: customerEnvironment,
      purchasingGoodsKbn: purchasingGoodsKbn,
      purchasingGoods: purchasingGoods,
      outsourcingKbn: outsourcingKbn,
      outsourcing: outsourcing,
      customerRequirementKbn: customerRequirementKbn,
      customerRequirement: customerRequirement,
      remarks: remarks,
      updatedId: currentUser.id      
    },
    phases: phases,
    risks: risks,
    goals: goals,
    members: members,
    log: { changerId: props.kbn===0 ? null : currentUser.id, contents: log }
  }
  
  // 確認ダイアログでキャンセルの場合の処理
  const handleCofirmCancel = () => {
    setConfirm({
      message: "",
      tag: "",
      width: null
    });
    setStatus(beforeStatus);
  }

  // 変更ログ画面でキャンセルの場合の処理
  const handleModifyCancel = () => {
    setModify(false);
    setLog("");
  }

  // snackbar close処理
  const handleSnackbarClose = () => {
    setSnackbar({show: false, message: ""});
  }

  // 画面編集
  return (
    <Box component='div' sx={{ width: '100%', height: '100%' }}>

      {(err.severity && !showErr) &&
        <Stack sx={{width: '100%'}} spacing={1} mb={3} >
          {inputErr.length ? (
            <Alert severity={err.severity} onClick={(e) => setShowErr(true)}>{err.message}</Alert>
          ) : (
            <Alert severity={err.severity}>{err.message}</Alert>
          )}
        </Stack>
      }

      <Drawer
        anchor={'right'}
        open={showErr}
        variant="persistent"
      >
        <Box component='div' sx={{ mt: 6, backgroundColor: '#fff', height: 'inherit', width: '40vw', borderLeft: '1px solid #000' }}>
          <Box component='div' sx={{ mt: 3, mr: 2, textAlign: 'right' }}>
            <Button
                color="primary"
                endIcon={<KeyboardArrowRightIcon />}
                onClick={() => setShowErr(false)}
              >
                Close
            </Button>
          </Box>
          <Box component='div' sx={{ height: '80vh', m: 2, overflowY: 'auto' }}>
            {inputErr.map((e,i) => (
              <Stack sx={{p: 1}} key={`err-${i}`}>
                <Alert severity={e.severity ? e.severity! : 'error'}>{e.message}</Alert>
              </Stack>
            ))}
          </Box>
        </Box>
      </Drawer>

      { props.kbn===0 ? (
        <>
          <Button 
            size="small" 
            variant="contained" 
            endIcon={<SaveAltIcon />} 
            onClick={(e) => handleUpdate()} 
            style={{marginRight:10}}
            disabled={isEmpty(number) || isEmpty(name) || isEmpty(divisionId) || isEmpty(plId.id)}
          >
            一時保存
          </Button>
          <Button 
            size="small" 
            variant="contained" 
            endIcon={<SendIcon />} 
            onClick={(e) => handleSubmit()}
            disabled={isEmpty(number) || isEmpty(name) || isEmpty(divisionId) || isEmpty(plId.id)}
          >
            提出
          </Button>
        </>
      ) : (
        <Button 
          size="small" 
          variant="contained" 
          endIcon={<SaveAltIcon />} 
          onClick={(e) => handleModify()}
          disabled={isEmpty(number) || isEmpty(name) || isEmpty(divisionId) || isEmpty(plId.id)}
        >
          変更登録
        </Button>
      )}

      <TableContainer component={Paper} sx={{ mt: 2, height: '95%', border: '0.5px #c0c0c0 solid' }}>
        <Table sx={{ width: '100%' }} stickyHeader aria-label="project table">
          <TableBody>
            <TableRow sx={{ height: 60, '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell sx={{ width: 180 }}>承認</CustomCell>
              <CustomCell sx={{ width: 'auto' }}>
                {formatDateZero(approvalDate, dateDispForm) + "　" + approvalName}
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: 60, '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>プロジェクトNo.</CustomCell>
              <CustomCell>
                <TextField
                  required
                  fullWidth
                  id="number"
                  name="number"
                  label="プロジェクトNo."
                  value={number}
                  variant="outlined"
                  size="small"
                  inputProps={{maxLength:10, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setNumber(e.target.value)}
                />
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: 60, '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>プロジェクト名</CustomCell>
              <CustomCell>
                <TextField
                  required
                  fullWidth
                  id="name"
                  name="name"
                  label="プロジェクト名"
                  value={name}
                  variant="outlined"
                  size="small"
                  inputProps={{maxLength:30, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setName(e.target.value)}
                />
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: 60, '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>担当部門</CustomCell>
              <CustomCell>
                <FormControl variant="outlined" fullWidth size="small">
                  <InputLabel required id="select-division-label" sx={{verticalAlign: 'middle', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}>担当部門</InputLabel>
                  <Select
                    labelId="select-division-label"
                    id="select-division"
                    label="担当部門"
                    value={divisionId ?? ''}
                    onChange={(e) => setDivisionId(Number(e.target.value))}
                    sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}
                  >
                    { divs.map((d,i) =>
                    <MenuItem key={`division-${i}`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={d.id}>{d.code === "dep" ? d.depName : d.depName + " " + d.name}</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: 60, '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>PL</CustomCell>
              <CustomCell>
                <SelectEmployeeId 
                  empId={plId.id}
                  empGet={plId.flg}
                  setEmpId={handleChangePlId}
                  setErr={setErr}
                  label="PL"
                  required={true}
                  width={230}
                />
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: 60, '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>作成</CustomCell>
              <CustomCell>
                <Box component='div' sx={{ display: 'flex', alignItems: 'center'}}>
                  <Box component='div' sx={{ mr: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} >
                      <DatePicker
                        label="作成日"
                        inputFormat="yyyy年MM月dd日"
                        mask='____年__月__日'
                        value={makeDate}
                        onChange={(value: Date | null) => setMakeDate(value)}
                        renderInput={(params: any) => <TextField 
                                                  {...params}
                                                  error={false} 
                                                  variant="outlined" 
                                                  size="small" 
                                                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }} 
                                                />}
                        PaperProps={{ sx: styles.paperprops }}
                      />
                    </LocalizationProvider>
                  </Box>
                  <SelectEmployeeId 
                    empId={makeId.id}
                    empGet={makeId.flg}
                    setEmpId={handleChangeMakeId}
                    setErr={setErr}
                    label="作成者"
                    width={230}
                  />
                </Box>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: 60, '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>変更</CustomCell>
              <CustomCell>
                <Box component='div' sx={{ display: 'flex', alignItems: 'center'}}>
                  <Box component='div' sx={{ mr: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} >
                      <DatePicker
                        label="変更日"
                        inputFormat="yyyy年MM月dd日"
                        mask='____年__月__日'
                        value={updateDate}
                        onChange={(value: Date | null) => setUpdateDate(value)}
                        renderInput={(params: any) => <TextField 
                                                  {...params}
                                                  error={false} 
                                                  variant="outlined" 
                                                  size="small" 
                                                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }} 
                                                />}
                        PaperProps={{ sx: styles.paperprops }}
                      />
                    </LocalizationProvider>
                  </Box>
                  <SelectEmployeeId 
                    empId={updateId.id}
                    empGet={updateId.flg}
                    setEmpId={handleChangeUpdateId}
                    setErr={setErr}
                    label="変更者"
                    width={230}
                  />
                </Box>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>取引先</CustomCell>
              <CustomCell>
                <TextField
                  fullWidth
                  id="companyName"
                  name="companyName"
                  label="会社名"
                  value={companyName}
                  variant="outlined"
                  size="small"
                  sx={{ mt: 0.7 }}
                  inputProps={{maxLength:30, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                <TextField
                  fullWidth
                  id="departmentName"
                  name="departmentName"
                  label="部署名"
                  value={departmentName}
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1.5 }}
                  inputProps={{maxLength:30, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setDepartmentName(e.target.value)}
                />
                <TextField
                  fullWidth
                  id="personinchargeName"
                  name="personinchargeName"
                  label="担当者"
                  value={personinchargeName}
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1.5 }}
                  inputProps={{maxLength:30, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setPersoninchargeName(e.target.value)}
                />
                <TextField
                  fullWidth
                  id="phone"
                  name="phone"
                  label="TEL"
                  value={phone}
                  variant="outlined"
                  type="tel"
                  size="small"
                  sx={{ mt: 1.5 }}
                  inputProps={{maxLength:15, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setPhone(phoneOnly(e.target.value))}
                />
                <TextField
                  fullWidth
                  id="fax"
                  name="fax"
                  label="FAX"
                  value={fax}
                  variant="outlined"
                  type="tel"
                  size="small"
                  sx={{ mt: 1.5 }}
                  inputProps={{maxLength:15, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setFax(phoneOnly(e.target.value))}
                />
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  value={email}
                  variant="outlined"
                  size="small"
                  type="email"
                  sx={{ mt: 1.5, mb: 0.5 }}
                  inputProps={{maxLength:255, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: 60, '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>開発期間</CustomCell>
              <CustomCell>
                <Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} >
                    <DatePicker
                      label="開発期間（自）"
                      inputFormat="yyyy年MM月dd日"
                      mask='____年__月__日'
                      value={developmentPeriodFr}
                      onChange={(value: Date | null) => setDevelopmentPeriodFr(value)}
                      renderInput={(params: any) => <TextField 
                                                {...params}
                                                error={false} 
                                                variant="outlined" 
                                                size="small" 
                                                InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }} 
                                              />}
                      PaperProps={{ sx: styles.paperprops }}
                    />
                  </LocalizationProvider>
                  <Box component="span" sx={{alignSelf: 'center', textAlign: 'center', width: '30px', height: '20px' }}>〜</Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} >
                    <DatePicker
                      label="開発期間（至）"
                      inputFormat="yyyy年MM月dd日"
                      mask='____年__月__日'
                      value={developmentPeriodTo}
                      onChange={(value: Date | null) => setDevelopmentPeriodTo(value)}
                      renderInput={(params: any) => <TextField 
                                                {...params}
                                                error={false} 
                                                variant="outlined" 
                                                size="small" 
                                                InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }} 
                                              />}
                      PaperProps={{ sx: styles.paperprops }}
                    />
                  </LocalizationProvider>
                </Box>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: 60, '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>完了予定</CustomCell>
              <CustomCell>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} >
                  <DatePicker
                    label="完了予定日"
                    inputFormat="yyyy年MM月dd日"
                    mask='____年__月__日'
                    value={scheduledToBeCompleted}
                    onChange={(value: Date | null) => setScheduledToBeCompleted(value)}
                    renderInput={(params: any) => <TextField 
                                              {...params}
                                              error={false} 
                                              variant="outlined" 
                                              size="small" 
                                              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }} 
                                            />}
                    PaperProps={{ sx: styles.paperprops }}
                  />
                </LocalizationProvider>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>システム概要</CustomCell>
              <CustomCell>
                <TextField
                  fullWidth
                  multiline
                  maxRows={5}
                  minRows={3}
                  id="systemOverview"
                  name="systemOverview"
                  label="概要"
                  value={systemOverview}
                  variant="outlined"
                  size="small"
                  sx={{ my: 0.7 }}
                  inputProps={{maxLength:255, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setSystemOverview(e.target.value)}
                />
              </CustomCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>開発環境</CustomCell>
              <CustomCell>
                <TextField
                  fullWidth
                  multiline
                  maxRows={5}
                  minRows={3}
                  id="developmentEnvironment"
                  name="developmentEnvironment"
                  label="開発環境"
                  value={developmentEnvironment}
                  variant="outlined"
                  size="small"
                  sx={{ my: 0.7 }}
                  inputProps={{maxLength:255, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setDevelopmentEnvironment(e.target.value)}
                />
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: '60px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>受注金額</CustomCell>
              <CustomCell>
                <InputNumber 
                  value={orderAmount}
                  setValue={setOrderAmount}
                  label="受注金額"
                  maxLength={10}
                  width="230px"
                  id="orderAmount"
                  name="orderAmount"
                  startChar='¥'
                />
              </CustomCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>計画値</CustomCell>
              <CustomCell>
                <Box component="div" sx={{ mt: 0.7, display: 'flex', alignItems: 'center' }}>
                  <InputNumber 
                    value={plannedWorkCost}
                    setValue={setPlannedWorkCost}
                    label="作業費"
                    maxLength={10}
                    width="230px"
                    id="plannedWorkCost"
                    name="plannedWorkCost"
                    startChar='¥'
                  />
                  <Box component="span" sx={{ alignSelf: 'center', textAlign: 'center', width: '30px', height: '20px' }}>（</Box>
                  <TextField
                    id="plannedWorkload"
                    name="plannedWorkload"
                    label="作業工数"
                    value={plannedWorkload}
                    variant="outlined"
                    size="small"
                    sx={{ width: '90px' }}
                    inputProps={{maxLength:6, style: {textAlign: 'right', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                    InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                    onChange={(e) => setPlannedWorkload(decimalOnly(e.target.value))}
                  />
                  <Box component="span" sx={{ alignSelf: 'center', textAlign: 'center', width: '50px', height: '20px' }}>人月）</Box>
                </Box>
                <Box component="div" sx={{ mt: 1.5, display: 'flex', alignItems: 'center' }}>
                  <InputNumber 
                    value={plannedOutsourcingCost}
                    setValue={setPlannedOutsourcingCost}
                    label="外注費"
                    maxLength={10}
                    width="230px"
                    id="plannedOutsourcingCost"
                    name="plannedOutsourcingCost"
                    startChar='¥'
                  />
                  <Box component="span" sx={{alignSelf: 'center', textAlign: 'center', width: '30px', height: '20px' }}>（</Box>
                  <TextField
                    id="plannedOutsourcingWorkload"
                    name="plannedOutsourcingWorkload"
                    label="外注工数"
                    value={plannedOutsourcingWorkload}
                    variant="outlined"
                    size="small"
                    sx={{ width: '90px' }}
                    inputProps={{maxLength:6, style: {textAlign: 'right', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                    InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                    onChange={(e) => setPlannedOutsourcingWorkload(decimalOnly(e.target.value))}
                  />
                  <Box component="span" sx={{alignSelf: 'center', textAlign: 'center', width: '50px', height: '20px' }}>人月）</Box>
                </Box>
                <Box component="div" sx={{ mt: 1.5 }}>
                  <InputNumber 
                    value={plannedPurchasingCost}
                    setValue={setPlannedPurchasingCost}
                    label="仕入費"
                    maxLength={10}
                    width="230px"
                    id="plannedPurchasingCost"
                    name="plannedPurchasingCost"
                    startChar='¥'
                  />
                </Box>
                <Box component="div" sx={{ mt: 1.5, mb: 0.7 }}>
                  <InputNumber 
                    value={plannedExpensesCost}
                    setValue={setPlannedExpensesCost}
                    label="経費"
                    maxLength={10}
                    width="230px"
                    id="plannedExpensesCost"
                    name="plannedExpensesCost"
                    startChar='¥'
                  />
                </Box>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: '60px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>粗利見込</CustomCell>
              <CustomCell>
                <TextField
                  id="grossProfit"
                  name="grossProfit"
                  label="粗利見込"
                  value={"¥" + calcGrossProfit().toLocaleString()}
                  variant="outlined"
                  size="small"
                  sx={{ width: '230px', backgroundColor: '#f5f5f5' }}
                  inputProps={{ readOnly: true, style: {textAlign: 'right', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                />
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: '60px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>作業場所</CustomCell>
              <CustomCell>
                <RadioGroup
                  row
                  name="workPlaceKbn"
                  value={workPlaceKbn}
                  onChange={(e) => setWorkPlaceKbn(e.target.value)}
                >
                  <FormControlLabel value="自社内" control={<Radio size="small" />} label={<Typography sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}}>自社内</Typography>} />
                  <FormControlLabel value="社外" control={<Radio size="small" />} label={<Typography sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}}>社外</Typography>} />
                </RadioGroup>
                <TextField
                  fullWidth
                  id="workPlace"
                  name="workPlace"
                  label="作業場所概略"
                  value={workPlace}
                  variant="outlined"
                  size="small"
                  sx={{ my: 0.5 }}
                  inputProps={{maxLength:30, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setWorkPlace(e.target.value)}
                />
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: '60px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>顧客所有物</CustomCell>
              <CustomCell>
                <RadioGroup
                  row
                  name="customerPropertyKbn"
                  value={customerPropertyKbn}
                  onChange={(e) => setCustomerPropertyKbn(e.target.value)}
                >
                  <FormControlLabel value="無" control={<Radio size="small" />} label={<Typography sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}}>無</Typography>} />
                  <FormControlLabel value="有" control={<Radio size="small" />} label={<Typography sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}}>有</Typography>} />
                </RadioGroup>
                <TextField
                  fullWidth
                  id="customerProperty"
                  name="customerProperty"
                  label="顧客所有物概略"
                  value={customerProperty}
                  variant="outlined"
                  size="small"
                  sx={{ my: 0.5 }}
                  inputProps={{maxLength:30, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setCustomerProperty(e.target.value)}
                />
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: '60px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>顧客環境</CustomCell>
              <CustomCell>
                <RadioGroup
                  row
                  name="customerEnvironment"
                  value={customerEnvironment}
                  onChange={(e) => setCustomerEnvironment(e.target.value)}
                >
                  <FormControlLabel value="無" control={<Radio size="small" />} label={<Typography sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}}>無</Typography>} />
                  <FormControlLabel value="有" control={<Radio size="small" />} label={<Typography sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}}>有</Typography>} />
                </RadioGroup>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: '60px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>仕入品</CustomCell>
              <CustomCell>
                <RadioGroup
                  row
                  name="purchasingGoodsKbn"
                  value={purchasingGoodsKbn}
                  onChange={(e) => setPurchasingGoodsKbn(e.target.value)}
                >
                  <FormControlLabel value="無" control={<Radio size="small" />} label={<Typography sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}}>無</Typography>} />
                  <FormControlLabel value="有" control={<Radio size="small" />} label={<Typography sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}}>有</Typography>} />
                </RadioGroup>
                <TextField
                  fullWidth
                  id="purchasingGoods"
                  name="purchasingGoods"
                  label="仕入品概略"
                  value={purchasingGoods}
                  variant="outlined"
                  size="small"
                  sx={{ my: 0.5 }}
                  inputProps={{maxLength:30, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setPurchasingGoods(e.target.value)}
                />
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: '60px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>外部委託</CustomCell>
              <CustomCell>
                <RadioGroup
                  row
                  name="outsourcingKbn"
                  value={outsourcingKbn}
                  onChange={(e) => setOutsourcingKbn(e.target.value)}
                >
                  <FormControlLabel value="無" control={<Radio size="small" />} label={<Typography sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}}>無</Typography>} />
                  <FormControlLabel value="有" control={<Radio size="small" />} label={<Typography sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}}>有</Typography>} />
                </RadioGroup>
                <TextField
                  fullWidth
                  id="outsourcing"
                  name="outsourcing"
                  label="外部委託先"
                  value={outsourcing}
                  variant="outlined"
                  size="small"
                  sx={{ my: 0.5 }}
                  inputProps={{maxLength:30, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setOutsourcing(e.target.value)}
                />
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: '60px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>顧客要求仕様書</CustomCell>
              <CustomCell>
                <RadioGroup
                  row
                  name="customerRequirementKbn"
                  value={customerRequirementKbn}
                  onChange={(e) => setCustomerRequirementKbn(e.target.value)}
                >
                  <FormControlLabel value="無" control={<Radio size="small" />} label={<Typography sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}}>無</Typography>} />
                  <FormControlLabel value="有" control={<Radio size="small" />} label={<Typography sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}}>有</Typography>} />
                </RadioGroup>
                <TextField
                  fullWidth
                  id="customerRequirement"
                  name="customerRequirement"
                  label="文書名"
                  value={customerRequirement}
                  variant="outlined"
                  size="small"
                  sx={{ my: 0.5 }}
                  inputProps={{maxLength:30, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setCustomerRequirement(e.target.value)}
                />
              </CustomCell>
            </TableRow>
            <TableRow sx={{ minHeight: '100px', height: '100px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>
                <Typography sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}}>受注範囲</Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={(e) => handleAddPhase()}
                >
                  追加
                </Button>
              </CustomCell>
              <CustomCell>
                <TableContainer component={Paper}>
                  <Table sx={{ width: 1150 }} aria-label="phases table">
                    <TableHead>
                      <TableRow>
                        <CustomCell sx={{ width: 200 }}>工程</CustomCell>
                        <CustomCell sx={{ width: 200 }}>開始予定</CustomCell>
                        <CustomCell sx={{ width: 200 }}>終了予定</CustomCell>
                        <CustomCell sx={{ width: 200 }}>成果物</CustomCell>
                        <CustomCell sx={{ width: 200 }}>合否判定基準</CustomCell>
                        <CustomCell sx={{ width: 150 }}></CustomCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {phases.map((p,i) => (
                        <TableRow key={`phase-${i}`} sx={{ minHeight: '50px', height: '50px', '&:last-child td, &:last-child th': { border: 0 } }}>
                          <CustomCell>
                            <TextField
                              fullWidth
                              error={p.del}
                              id={`phaseName-${i}`}
                              name="phaseName"
                              value={p.name}
                              variant="outlined"
                              size="small"
                              inputProps={{maxLength:15, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                              onChange={(e) => handleChangePhaseName(i, e.target.value)}
                            />
                          </CustomCell>
                          <CustomCell>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} >
                              <DatePicker
                                inputFormat="yyyy年MM月dd日"
                                mask='____年__月__日'
                                value={p.plannedPeriodfr}
                                onChange={(value: Date | null) => handleChangePhasePeriodFr(i, value)}
                                renderInput={(params: any) => <TextField 
                                                          {...params}
                                                          error={p.del} 
                                                          variant="outlined" 
                                                          size="small" 
                                                          InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }} 
                                                        />}
                                PaperProps={{ sx: styles.paperprops }}
                              />
                            </LocalizationProvider>
                          </CustomCell>
                          <CustomCell>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} >
                              <DatePicker
                                inputFormat="yyyy年MM月dd日"
                                mask='____年__月__日'
                                value={p.plannedPeriodto}
                                onChange={(value: Date | null) => handleChangePhasePeriodTo(i, value)}
                                renderInput={(params: any) => <TextField 
                                                          {...params}
                                                          error={p.del} 
                                                          variant="outlined" 
                                                          size="small" 
                                                          InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }} 
                                                        />}
                                PaperProps={{ sx: styles.paperprops }}
                              />
                            </LocalizationProvider>
                          </CustomCell>
                          <CustomCell>
                            <TextField
                              fullWidth
                              error={p.del}
                              id={`phaseDeliverables-${i}`}
                              name="phaseDeliverables"
                              value={p.deliverables}
                              variant="outlined"
                              size="small"
                              multiline
                              minRows={1}
                              maxRows={5}
                              inputProps={{maxLength:50, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                              onChange={(e) => handleChangePhaseDeliverables(i, e.target.value)}
                            />
                          </CustomCell>
                          <CustomCell>
                            <TextField
                              fullWidth
                              error={p.del}
                              id={`phaseCriteria-${i}`}
                              name="phaseCriteria"
                              value={p.criteria}
                              variant="outlined"
                              size="small"
                              multiline
                              minRows={1}
                              maxRows={5}
                              inputProps={{maxLength:50, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                              onChange={(e) => handleChangePhaseCriteria(i, e.target.value)}
                            />
                          </CustomCell>
                          <CustomCell>
                            <IconButton aria-label="move-up" onClick={() => handleMoveUpPhase(i)} disabled={(i === 0) ? true : false }>
                              {(i === 0) ? (
                                <MoveUpIcon color="disabled" fontSize="inherit" />
                              ) : (
                                <MoveUpIcon color="primary" fontSize="inherit" />
                              )}
                            </IconButton>
                            <IconButton aria-label="move-down" onClick={() => handleMoveDownPhase(i)} disabled={(i === (phases.length-1)) ? true : false }>
                              {(i === (phases.length-1)) ? (
                                <MoveDownIcon color="disabled" fontSize="inherit" />
                              ) : (
                                <MoveDownIcon color="primary" fontSize="inherit" />
                              )}
                            </IconButton>
                            <IconButton aria-label="delete" onClick={() => handleDeletePhase(i)}>
                              { p.del ? (
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
              </CustomCell>
            </TableRow>
            <TableRow sx={{ minHeight: '100px', height: '100px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>
                <Typography sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}}>リスク</Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={(e) => handleAddRisk()}
                >
                  追加
                </Button>
              </CustomCell>
              <CustomCell>
                <TableContainer component={Paper}>
                  <Table sx={{ width: 1150 }} aria-label="risks table">
                    <TableBody>
                      {risks.map((r,i) => (
                        <TableRow key={`risk-${i}`} sx={{ minHeight: '50px', height: '50px', '&:last-child td, &:last-child th': { border: 0 } }}>
                          <CustomCell sx={{ width: 'auto' }}>
                            <TextField
                              fullWidth
                              error={r.del}
                              id={`risk-${i}`}
                              name="risk"
                              value={r.contents}
                              variant="outlined"
                              size="small"
                              multiline
                              minRows={2}
                              maxRows={5}
                              inputProps={{maxLength:50, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                              onChange={(e) => handleChangeRisk(i, e.target.value)}
                            />
                          </CustomCell>
                          <CustomCell sx={{ width: 150 }}>
                            <IconButton aria-label="move-up" onClick={() => handleMoveUpRisk(i)} disabled={(i === 0) ? true : false }>
                              {(i === 0) ? (
                                <MoveUpIcon color="disabled" fontSize="inherit" />
                              ) : (
                                <MoveUpIcon color="primary" fontSize="inherit" />
                              )}
                            </IconButton>
                            <IconButton aria-label="move-down" onClick={() => handleMoveDownRisk(i)} disabled={(i === (risks.length-1)) ? true : false }>
                              {(i === (risks.length-1)) ? (
                                <MoveDownIcon color="disabled" fontSize="inherit" />
                              ) : (
                                <MoveDownIcon color="primary" fontSize="inherit" />
                              )}
                            </IconButton>
                            <IconButton aria-label="delete" onClick={() => handleDeleteRisk(i)}>
                              { r.del ? (
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
              </CustomCell>
            </TableRow>
            <TableRow sx={{ minHeight: '100px', height: '100px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>
                <Typography sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}}>品質目標</Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={(e) => handleAddGoal()}
                >
                  追加
                </Button>
              </CustomCell>
              <CustomCell>
                <TableContainer component={Paper}>
                  <Table sx={{ width: 1150 }} aria-label="goals table">
                    <TableBody>
                      {goals.map((g,i) => (
                        <TableRow key={`goal-${i}`} sx={{ minHeight: '50px', height: '50px', '&:last-child td, &:last-child th': { border: 0 } }}>
                          <CustomCell sx={{ width: 'auto' }}>
                            <TextField
                              fullWidth
                              error={g.del}
                              id={`goal-${i}`}
                              name="goal"
                              value={g.contents}
                              variant="outlined"
                              size="small"
                              multiline
                              minRows={2}
                              maxRows={5}
                              inputProps={{maxLength:50, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                              onChange={(e) => handleChangeGoal(i, e.target.value)}
                            />
                          </CustomCell>
                          <CustomCell sx={{ width: 150 }}>
                            <IconButton aria-label="move-up" onClick={() => handleMoveUpGoal(i)} disabled={(i === 0) ? true : false }>
                              {(i === 0) ? (
                                <MoveUpIcon color="disabled" fontSize="inherit" />
                              ) : (
                                <MoveUpIcon color="primary" fontSize="inherit" />
                              )}
                            </IconButton>
                            <IconButton aria-label="move-down" onClick={() => handleMoveDownGoal(i)} disabled={(i === (goals.length-1)) ? true : false }>
                              {(i === (goals.length-1)) ? (
                                <MoveDownIcon color="disabled" fontSize="inherit" />
                              ) : (
                                <MoveDownIcon color="primary" fontSize="inherit" />
                              )}
                            </IconButton>
                            <IconButton aria-label="delete" onClick={() => handleDeleteGoal(i)}>
                              { g.del ? (
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
              </CustomCell>
            </TableRow>
            <TableRow sx={{ minHeight: '100px', height: '100px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>
                <Typography sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}}>プロジェクトメンバー</Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={(e) => handleAddMember()}
                >
                  追加
                </Button>
              </CustomCell>
              <CustomCell>
                { members.map((m,i) => (
                  <React.Fragment key={`member-${i}`}>
                    {m.del ? (
                      <Chip
                        label={m.memberName}
                        color="error"
                        sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}
                        deleteIcon={<DoneIcon />}
                        onDelete={() => handleDeleteMem(i)}
                      />
                    ) : (
                      <Chip
                        label={m.memberName}
                        variant="outlined"
                        sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}
                        onDelete={() => handleDeleteMem(i)}
                      />
                    )}
                  </React.Fragment>
                ))}
              </CustomCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>特記事項</CustomCell>
              <CustomCell>
                <TextField
                  fullWidth
                  multiline
                  maxRows={5}
                  minRows={3}
                  id="remarks"
                  name="remarks"
                  label="特記事項"
                  value={remarks}
                  variant="outlined"
                  size="small"
                  sx={{ my: 0.7 }}
                  inputProps={{maxLength:255, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </CustomCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar open={snackbar.show} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <ConfirmDlg confirm={confirm} handleOK={handleConfirmOK} handleCancel={handleCofirmCancel} />
      <Loading isLoading={isLoading1 || isLoading2} />
      <EmpSelectDialog show={showMemberAdd} submit={handleAddMemberSubmit} close={handleCloseAddMember} />
      <LogEditPage show={modify} log={log} setLog={setLog} submit={handleModifyOK} cancel={handleModifyCancel} />
    </Box>
  );
}
export default PrjEditPage;