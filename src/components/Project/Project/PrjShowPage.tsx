import { useState, useEffect } from 'react';
import { AlertType } from './../../common/cmnType';
import { cmnProps } from './../../common/cmnConst';
import { formatDateZero } from '../../../lib/common/dateCom';
import { getProject, phaseParam, riskParam, goalParam, memberParam } from '../../../lib/api/project';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';

import { styled } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';

const CustomCell = styled(TableCell)({
  fontSize: cmnProps.fontSize,
  fontFamily: cmnProps.fontFamily,
  padding: 5,
});

const dateDispForm = "YYYY年MM月DD日";

type Props = {
  projectId: number | null;
}
const PrjShowPage = (props: Props) => {
  const [approvalName, setApprovalName] = useState<string>("");
  const [approvalDate, setApprovalDate] = useState<Date | null>(null);
  const [divName, setDivName] = useState<string>("");
  const [plName, setPlName] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [makeDate, setMakeDate] = useState<Date | null>(null);
  const [makeName, setMakeName] = useState<string>("");
  const [updateDate, setUpdateDate] = useState<Date | null>(null);
  const [updateName, setUpdateName] = useState<string>("");
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
  const [grossProfit, setGrossProfit] = useState<number | null>(null);
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

  const [err, setErr] = useState<AlertType>({severity: null, message: ""});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 初期処理
  useEffect(() => {
    if(props.projectId){
      setIsLoading(true);
      handleGetProject();
    }
  }, [props.projectId]);

  // プロジェクト取得
  const handleGetProject = async () => {
    try {
      const res = await getProject(props.projectId);
      // プロジェクト
      setApprovalName(res.data.project.approvalName ?? '');
      setApprovalDate(res.data.project.approvalDate);
      if(res.data.project.divCode==="dep"){
        setDivName(res.data.project.depName ?? '');
      } else {
        setDivName(`${res.data.project.depName ?? ''}　${res.data.project.divName ?? ''}`);
      }
      setPlName(res.data.project.plName ?? '');
      setNumber(res.data.project.number ?? '');
      setName(res.data.project.name ?? '');
      setMakeDate(res.data.project.makeDate);
      setMakeName(res.data.project.makeName ?? '');
      setUpdateDate(res.data.project.updateDate);
      setUpdateName(res.data.project.updateName ?? '');
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
      setGrossProfit(res.data.project.grossProfit);
      setWorkPlaceKbn(res.data.project.workPlaceKbn ?? '');
      setWorkPlace(res.data.project.workPlace ?? '');
      setCustomerPropertyKbn(res.data.project.customerPropertyKbn ?? '');
      setCustomerProperty(res.data.project.customerProperty ?? '');
      setCustomerEnvironment(res.data.project.customerEnvironment ?? '');
      setPurchasingGoodsKbn(res.data.project.purchasingGoodsKbn ?? '');
      setPurchasingGoods(res.data.project.purchasingGoods ?? '');
      setOutsourcingKbn(res.data.project.outsourcingKbn ?? '');
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
    setIsLoading(false);
  }

  // プロジェクトメンバー編集
  const setMember = () => {
    let ret: string = "";
    members.forEach((m,i) => {
      if (i === 0) {
        ret = m.memberName;
      } else {
        ret += `、${m.memberName}`;
      }
    });
    return ret;
  }

  // 画面編集
  return (
    <Box component='div' sx={{ width: '100%', height: '100%' }}>

      {(err.severity) &&
        <Stack sx={{width: '100%'}} spacing={1} mb={3} >
          <Alert severity={err.severity}>{err.message}</Alert>
        </Stack>
      }

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
              <CustomCell>{number}</CustomCell>
            </TableRow>
            <TableRow sx={{ height: 60, '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>プロジェクト名</CustomCell>
              <CustomCell>{name}</CustomCell>
            </TableRow>
            <TableRow sx={{ height: 60, '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>担当部門</CustomCell>
              <CustomCell>{divName}</CustomCell>
            </TableRow>
            <TableRow sx={{ height: 60, '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>PL</CustomCell>
              <CustomCell>{plName}</CustomCell>
            </TableRow>
            <TableRow sx={{ height: 60, '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>作成</CustomCell>
              <CustomCell>
                {formatDateZero(makeDate, dateDispForm) + "　" + makeName}
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: 60, '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>変更</CustomCell>
              <CustomCell>
                {formatDateZero(updateDate, dateDispForm) + "　" + updateName}
              </CustomCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>取引先</CustomCell>
              <CustomCell>
                <Box component='div' sx={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                  <Box component='div' sx={{ width: '70px' }}>会社名：</Box>
                  <Box component='div'>{companyName}</Box>
                </Box>
                <Box component='div' sx={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                  <Box component='div' sx={{ width: '70px' }}>部署名：</Box>
                  <Box component='div'>{departmentName}</Box>
                </Box>
                <Box component='div' sx={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                  <Box component='div' sx={{ width: '70px' }}>担当者：</Box>
                  <Box component='div'>{personinchargeName}</Box>
                </Box>
                <Box component='div' sx={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                  <Box component='div' sx={{ width: '70px' }}>TEL：</Box>
                  <Box component='div'>{phone}</Box>
                </Box>
                <Box component='div' sx={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                  <Box component='div' sx={{ width: '70px' }}>FAX：</Box>
                  <Box component='div'>{fax}</Box>
                </Box>
                <Box component='div' sx={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                  <Box component='div' sx={{ width: '70px' }}>Email：</Box>
                  <Box component='div'>{email}</Box>
                </Box>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: 60, '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>開発期間</CustomCell>
              <CustomCell>
                {`${formatDateZero(developmentPeriodFr, dateDispForm)}　〜　${formatDateZero(developmentPeriodTo, dateDispForm)}`}
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: 60, '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>完了予定</CustomCell>
              <CustomCell>{formatDateZero(scheduledToBeCompleted, dateDispForm)}</CustomCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>システム概要</CustomCell>
              <CustomCell>
                <Box sx={{ py: 1, whiteSpace: 'pre-wrap'}}>{systemOverview}</Box>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>開発環境</CustomCell>
              <CustomCell>
                <Box sx={{ py: 1, whiteSpace: 'pre-wrap'}}>{developmentEnvironment}</Box>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: '60px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>受注金額</CustomCell>
              <CustomCell>{"¥" + (orderAmount ?? '0').toLocaleString()}</CustomCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>計画値</CustomCell>
              <CustomCell>
                <Box component='div' sx={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                  <Box component='div' sx={{ width: '70px' }}>作業費：</Box>
                  <Box component='div' sx={{ width: '120px', textAlign: 'right' }}>{"¥" + (plannedWorkCost ?? '0').toLocaleString()}</Box>
                  <Box component='div' sx={{ ml: 2 }}>{`（${plannedWorkload} 人月）`}</Box>
                </Box>
                <Box component='div' sx={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                  <Box component='div' sx={{ width: '70px' }}>外注費：</Box>
                  <Box component='div' sx={{ width: '120px', textAlign: 'right' }}>{"¥" + (plannedOutsourcingCost ?? '0').toLocaleString()}</Box>
                  <Box component='div' sx={{ ml: 2 }}>{`（${plannedOutsourcingWorkload} 人月）`}</Box>
                </Box>
                <Box component='div' sx={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                  <Box component='div' sx={{ width: '70px' }}>仕入費：</Box>
                  <Box component='div' sx={{ width: '120px', textAlign: 'right' }}>{"¥" + (plannedPurchasingCost ?? '0').toLocaleString()}</Box>
                </Box>
                <Box component='div' sx={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                  <Box component='div' sx={{ width: '70px' }}>経費：</Box>
                  <Box component='div' sx={{ width: '120px', textAlign: 'right' }}>{"¥" + (plannedExpensesCost ?? '0').toLocaleString()}</Box>
                </Box>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: '60px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>粗利見込</CustomCell>
              <CustomCell>{"¥" + (grossProfit ?? '0').toLocaleString()}</CustomCell>
            </TableRow>
            <TableRow sx={{ height: '60px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>作業場所</CustomCell>
              <CustomCell>
                <Box component='div' sx={{ height: '40px', display: 'flex', alignItems: 'center' }} >{workPlaceKbn}</Box>
                <Box component='div' sx={{ height: '40px', display: 'flex', alignItems: 'center' }} >{workPlace}</Box>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: '60px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>顧客所有物</CustomCell>
              <CustomCell>
                <Box component='div' sx={{ height: '40px', display: 'flex', alignItems: 'center' }} >{customerPropertyKbn}</Box>
                <Box component='div' sx={{ height: '40px', display: 'flex', alignItems: 'center' }} >{customerProperty}</Box>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: '60px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>顧客環境</CustomCell>
              <CustomCell>{customerEnvironment}</CustomCell>
            </TableRow>
            <TableRow sx={{ height: '60px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>仕入品</CustomCell>
              <CustomCell>
                <Box component='div' sx={{ height: '40px', display: 'flex', alignItems: 'center' }} >{purchasingGoodsKbn}</Box>
                <Box component='div' sx={{ height: '40px', display: 'flex', alignItems: 'center' }} >{purchasingGoods}</Box>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: '60px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>外部委託</CustomCell>
              <CustomCell>
                <Box component='div' sx={{ height: '40px', display: 'flex', alignItems: 'center' }} >{outsourcingKbn}</Box>
                <Box component='div' sx={{ height: '40px', display: 'flex', alignItems: 'center' }} >{outsourcing}</Box>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: '60px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>顧客要求仕様書</CustomCell>
              <CustomCell>
                <Box component='div' sx={{ height: '40px', display: 'flex', alignItems: 'center' }} >{customerRequirementKbn}</Box>
                <Box component='div' sx={{ height: '40px', display: 'flex', alignItems: 'center' }} >{customerRequirement}</Box>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ minHeight: '100px', height: '100px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>受注範囲</CustomCell>
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
                          <CustomCell>{p.name}</CustomCell>
                          <CustomCell>{formatDateZero(p.plannedPeriodfr, dateDispForm)}</CustomCell>
                          <CustomCell>{formatDateZero(p.plannedPeriodto, dateDispForm)}</CustomCell>
                          <CustomCell>
                            <Box sx={{ py: 1, whiteSpace: 'pre-wrap'}}>{p.deliverables}</Box>
                          </CustomCell>
                          <CustomCell>
                            <Box sx={{ py: 1, whiteSpace: 'pre-wrap'}}>{p.criteria}</Box>
                          </CustomCell>
                          <CustomCell sx={{ width: 150 }}></CustomCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ minHeight: '100px', height: '100px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>リスク</CustomCell>
              <CustomCell>
                <TableContainer component={Paper}>
                  <Table sx={{ width: 1150 }} aria-label="risks table">
                    <TableBody>
                      {risks.map((r,i) => (
                        <TableRow key={`risk-${i}`} sx={{ minHeight: '50px', height: '50px', '&:last-child td, &:last-child th': { border: 0 } }}>
                          <CustomCell>
                            <Box sx={{ py: 1, whiteSpace: 'pre-wrap'}}>{r.contents}</Box>
                          </CustomCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ minHeight: '100px', height: '100px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>品質目標</CustomCell>
              <CustomCell>
                <TableContainer component={Paper}>
                  <Table sx={{ width: 1150 }} aria-label="goals table">
                    <TableBody>
                      {goals.map((g,i) => (
                        <TableRow key={`goal-${i}`} sx={{ minHeight: '50px', height: '50px', '&:last-child td, &:last-child th': { border: 0 } }}>
                          <CustomCell>
                            <Box sx={{ py: 1, whiteSpace: 'pre-wrap'}}>{g.contents}</Box>
                          </CustomCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: 60, '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>プロジェクトメンバー</CustomCell>
              <CustomCell>
                <Box sx={{ py: 1, whiteSpace: 'pre-wrap'}}>{setMember()}</Box>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>特記事項</CustomCell>
              <CustomCell>
                <Box sx={{ py: 1, whiteSpace: 'pre-wrap'}}>{remarks}</Box>
              </CustomCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

    </Box>
  );
}
export default PrjShowPage;
