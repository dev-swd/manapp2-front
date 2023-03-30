import { useState, useEffect } from 'react';
import { AlertType } from './../../common/cmnType';
import { cmnProps } from './../../common/cmnConst';
import { formatDateZero } from '../../../lib/common/dateCom';
import { getReport, actualPhaseParam } from '../../../lib/api/project';

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
const RepShowPage = (props: Props) => {
  // プロジェクト情報
  const [number, setNumber] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [developmentPeriodFr, setDevelopmentPeriodFr] = useState<Date | null>(null);
  const [developmentPeriodTo, setDevelopmentPeriodTo] = useState<Date | null>(null);
  const [orderAmount, setOrderAmount] = useState<number | null>(null);
  // 完了報告書
  const [makeDate, setMakeDate] = useState<Date | null>(null);
  const [makeName, setMakeName] = useState<string>("");
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [actualWorkCost, setActualWorkCost] = useState<number | null>(null);
  const [actualWorkload, setActualWorkload] = useState<string>("");
  const [actualPurchasingCost, setActualPurchasingCost] = useState<number | null>(null);
  const [actualOutsourcingCost, setActualOutsourcingCost] = useState<number | null>(null);
  const [actualOutsourcingWorkload, setActualOutsourcingWorkload] = useState<string>("");
  const [actualExpensesCost, setActualExpensesCost] = useState<number | null>(null);
  const [grossProfit, setGrossProfit] = useState<number | null>(null);
  const [customerPropertyAcceptResult, setCustomerPropertyAcceptResult] = useState<string>("");
  const [customerPropertyAcceptRemarks, setCustomerPropertyAcceptRemarks] = useState<string>("");
  const [customerPropertyUsedResult, setCustomerPropertyUsedResult] = useState<string>("");
  const [customerPropertyUsedRemarks, setCustomerPropertyUsedRemarks] = useState<string>("");
  const [purchasingGoodsAcceptResult, setPurchasingGoodsAcceptResult] = useState<string>("");
  const [purchasingGoodsAcceptRemarks, setPurchasingGoodsAcceptRemarks] = useState<string>("");
  const [outsourcingEvaluate1, setOutsourcingEvaluate1] = useState<string>("");
  const [outsourcingEvaluateRemarks1, setOutsourcingEvaluateRemarks1] = useState<string>("");
  const [outsourcingEvaluate2, setOutsourcingEvaluate2] = useState<string>("");
  const [outsourcingEvaluateRemarks2, setOutsourcingEvaluateRemarks2] = useState<string>("");
  const [communicationCount, setCommunicationCount] = useState<number | null>(null);
  const [meetingCount, setMeetingCount] = useState<number | null>(null);
  const [phoneCount, setPhoneCount] = useState<number | null>(null);
  const [mailCount, setMailCount] = useState<number | null>(null);
  const [faxCount, setFaxCount] = useState<number | null>(null);
  const [designChangesCount, setDesignChangesCount] = useState<number | null>(null);
  const [specificationChangeCount, setSpecificationChangeCount] = useState<number | null>(null);
  const [designErrorCount, setDesignErrorCount] = useState<number | null>(null);
  const [othersCount, setOthersCount] = useState<number | null>(null);
  const [improvementCount, setImprovementCount] = useState<number | null>(null);
  const [correctiveActionCount, setCorrectiveActionCount] = useState<number | null>(null);
  const [preventiveMeasuresCount, setPreventiveMeasuresCount] = useState<number | null>(null);
  const [projectMeetingCount, setProjectMeetingCount] = useState<number | null>(null);
  const [statisticalConsideration, setStatisticalConsideration] = useState<string>("");
  const [qualitygoalsEvaluate, setQualitygoalsEvaluate] = useState<string>("");
  const [totalReport, setTotalReport] = useState<string>("");
  // 工程実績
  const [phases, setPhases] = useState<actualPhaseParam[]>([]);

  const [err, setErr] = useState<AlertType>({severity: null, message: ""});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 初期処理
  useEffect(() => {
    if(props.projectId){
      setIsLoading(true);
      handleGetReport();
    }
  }, [props.projectId]);

  // 完了報告書取得
  const handleGetReport = async () => {
    try {
      const res = await getReport(props.projectId);
      // プロジェクト情報
      setNumber(res.data.project.number ?? '');
      setName(res.data.project.name ?? '');
      setDevelopmentPeriodFr(res.data.project.developmentPeriodFr);
      setDevelopmentPeriodTo(res.data.project.developmentPeriodTo);
      setOrderAmount(res.data.project.orderAmount);
      // 完了報告書情報
      if(res.data.report){
        setMakeDate(res.data.report.makeDate);
        setMakeName(res.data.project.makeName);
        setDeliveryDate(res.data.report.deliveryDate);
        setActualWorkCost(res.data.report.actualWorkCost);
        setActualWorkload(res.data.report.actualWorkload ?? '');
        setActualPurchasingCost(res.data.report.actualPurchasingCost);
        setActualOutsourcingCost(res.data.report.actualOutsourcingCost);
        setActualOutsourcingWorkload(res.data.report.actualOutsourcingWorkload ?? '');
        setActualExpensesCost(res.data.report.actualExpensesCost);
        setGrossProfit(res.data.report.grossProfit);
        setCustomerPropertyAcceptResult(res.data.report.customerPropertyAcceptResult);
        setCustomerPropertyAcceptRemarks(res.data.report.customerPropertyAcceptRemarks);
        setCustomerPropertyUsedResult(res.data.report.customerPropertyUsedResult);
        setCustomerPropertyUsedRemarks(res.data.report.customerPropertyUsedRemarks)
        setPurchasingGoodsAcceptResult(res.data.report.purchasingGoodsAcceptResult)
        setPurchasingGoodsAcceptRemarks(res.data.report.purchasingGoodsAcceptRemarks);
        setOutsourcingEvaluate1(res.data.report.outsourcingEvaluate1);
        setOutsourcingEvaluateRemarks1(res.data.report.outsourcingEvaluateRemarks1);
        setOutsourcingEvaluate2(res.data.report.outsourcingEvaluate2);
        setOutsourcingEvaluateRemarks2(res.data.report.outsourcingEvaluateRemarks2);
        setCommunicationCount(res.data.report.communicationCount);
        setMeetingCount(res.data.report.meetingCount);
        setPhoneCount(res.data.report.phoneCount);
        setMailCount(res.data.report.mailCount);
        setFaxCount(res.data.report.faxCount);
        setDesignChangesCount(res.data.report.designChangesCount);
        setSpecificationChangeCount(res.data.report.specificationChangeCount);
        setDesignErrorCount(res.data.report.designErrorCount);
        setOthersCount(res.data.report.othersCount);
        setImprovementCount(res.data.report.improvementCount)
        setCorrectiveActionCount(res.data.report.correctiveActionCount);
        setPreventiveMeasuresCount(res.data.report.preventiveMeasuresCount);
        setProjectMeetingCount(res.data.report.projectMeetingCount);
        setStatisticalConsideration(res.data.report.statisticalConsideration);
        setQualitygoalsEvaluate(res.data.report.qualitygoalsEvaluate);
        setTotalReport(res.data.report.totalReport);
      }
      // 工程実績
      setPhases(res.data.phases);
    } catch (e) {
      setErr({severity: "error", message: "完了報告書取得エラー"});
    } 
    setIsLoading(false);
  }

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
              <CustomCell sx={{ width: 180 }}>プロジェクトNo.</CustomCell>
              <CustomCell sx={{ width: 'auto' }}>{number}</CustomCell>
            </TableRow>
            <TableRow sx={{ height: 60, '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>プロジェクト名</CustomCell>
              <CustomCell>{name}</CustomCell>
            </TableRow>
            <TableRow sx={{ height: 60, '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>開発期間</CustomCell>
              <CustomCell>
                {`${formatDateZero(developmentPeriodFr, dateDispForm)}　〜　${formatDateZero(developmentPeriodTo, dateDispForm)}`}
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: 60, '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>作成</CustomCell>
              <CustomCell>
                {formatDateZero(makeDate, dateDispForm) + "　" + makeName}
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: 60, '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>納品日</CustomCell>
              <CustomCell>
                {formatDateZero(deliveryDate, dateDispForm)}
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: '60px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>受注金額</CustomCell>
              <CustomCell>{"¥" + (orderAmount ?? '0').toLocaleString()}</CustomCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>実績値</CustomCell>
              <CustomCell>
                <Box component='div' sx={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                  <Box component='div' sx={{ width: '70px' }}>作業費：</Box>
                  <Box component='div' sx={{ width: '120px', textAlign: 'right' }}>{"¥" + (actualWorkCost ?? '0').toLocaleString()}</Box>
                  <Box component='div' sx={{ ml: 2 }}>{`（${actualWorkload} 人月）`}</Box>
                </Box>
                <Box component='div' sx={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                  <Box component='div' sx={{ width: '70px' }}>外注費：</Box>
                  <Box component='div' sx={{ width: '120px', textAlign: 'right' }}>{"¥" + (actualOutsourcingCost ?? '0').toLocaleString()}</Box>
                  <Box component='div' sx={{ ml: 2 }}>{`（${actualOutsourcingWorkload} 人月）`}</Box>
                </Box>
                <Box component='div' sx={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                  <Box component='div' sx={{ width: '70px' }}>仕入費：</Box>
                  <Box component='div' sx={{ width: '120px', textAlign: 'right' }}>{"¥" + (actualPurchasingCost ?? '0').toLocaleString()}</Box>
                </Box>
                <Box component='div' sx={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                  <Box component='div' sx={{ width: '70px' }}>経費：</Box>
                  <Box component='div' sx={{ width: '120px', textAlign: 'right' }}>{"¥" + (actualExpensesCost ?? '0').toLocaleString()}</Box>
                </Box>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: '60px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>粗利</CustomCell>
              <CustomCell>{"¥" + (grossProfit ?? '0').toLocaleString()}</CustomCell>
            </TableRow>
            <TableRow sx={{ height: '60px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>顧客所有物</CustomCell>
              <CustomCell>
                <Box component="div" sx={{ mt: 0.7, alignItems: 'center' }}>
                  {`受入結果：${customerPropertyAcceptResult}　備考：${customerPropertyAcceptRemarks}`}
                </Box>
                <Box component="div" sx={{ mt: 0.7, alignItems: 'center' }}>
                  {`使用結果：${customerPropertyUsedResult}　備考：${customerPropertyUsedRemarks}`}
                </Box>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ height: '60px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>仕入品</CustomCell>
              <CustomCell>
                <Box component="div" sx={{ mt: 0.7, alignItems: 'center' }}>
                  {`受入結果：${purchasingGoodsAcceptResult}　備考：${purchasingGoodsAcceptRemarks}`}
                </Box>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>外注評価</CustomCell>
              <CustomCell>
                <Box component="div" sx={{ mt: 0.7, alignItems: 'center' }}>
                  {`外注先：${outsourcingEvaluate1}　評価：${outsourcingEvaluateRemarks1}`}
                </Box>
                <Box component="div" sx={{ mt: 0.7, alignItems: 'center' }}>
                  {`外注先：${outsourcingEvaluate2}　評価：${outsourcingEvaluateRemarks2}`}
                </Box>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ minHeight: '100px', height: '100px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>受注範囲</CustomCell>
              <CustomCell>
                <TableContainer component={Paper}>
                  <Table sx={{ width: 1200 }} aria-label="phases table">
                    <TableHead>
                      <TableRow>
                        <CustomCell sx={{ width: 200 }}>工程</CustomCell>
                        <CustomCell sx={{ width: 200 }}>成果物</CustomCell>
                        <CustomCell sx={{ width: 110 }}>レビュー回数</CustomCell>
                        <CustomCell sx={{ width: 180 }}>予定金額</CustomCell>
                        <CustomCell sx={{ width: 180 }}>実績金額</CustomCell>
                        <CustomCell sx={{ width: 230 }}>検収日</CustomCell>
                        <CustomCell sx={{ width: 100 }}>No.</CustomCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {phases.map((p,i) => (
                        <TableRow key={`phase-${i}`} sx={{ minHeight: '50px', height: '50px', '&:last-child td, &:last-child th': { border: 0 } }}>
                          <CustomCell>{p.name}</CustomCell>
                          <CustomCell>
                            <Box sx={{ py: 1, whiteSpace: 'pre-wrap'}}>{p.deliverables}</Box>
                          </CustomCell>
                          <CustomCell>{`${p.reviewCount}回`}</CustomCell>
                          <CustomCell>{p.plannedCost ? `¥${p.plannedCost?.toLocaleString()}` : ''}</CustomCell>
                          <CustomCell>{p.actualCost ? `¥${p.actualCost?.toLocaleString()}` : ''}</CustomCell>
                          <CustomCell>{formatDateZero(p.acceptCompDate, dateDispForm)}</CustomCell>
                          <CustomCell>{p.shipNumber}</CustomCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ minHeight: '100px', height: '100px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>統計数値</CustomCell>
              <CustomCell>
                <TableContainer component={Paper}>
                  <Table sx={{ width: 1200 }} aria-label="phases table">
                    <TableBody>
                      <TableRow sx={{ height: '50px', '&:last-child td, &:last-child th': { border: 0 } }}>
                        <CustomCell sx={{ width: 200 }}>コミュニケーション記録</CustomCell>
                        <CustomCell sx={{ width: 1000 }}>
                          <Box component="div" sx={{ my: 0.7, alignItems: 'center' }}>
                            {`${communicationCount?.toLocaleString()}件　（会議：${meetingCount?.toLocaleString()}件　電話：${phoneCount?.toLocaleString()}件　メール：${mailCount?.toLocaleString()}件　FAX：${faxCount?.toLocaleString()}件）`}
                          </Box>
                        </CustomCell>
                      </TableRow>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <CustomCell>設計変更票</CustomCell>
                        <CustomCell>
                          <Box component="div" sx={{ my: 0.7, alignItems: 'center' }}>
                            {`${designChangesCount?.toLocaleString()}件　（仕変：${specificationChangeCount?.toLocaleString()}件　設計ミス：${designErrorCount?.toLocaleString()}件　その他：${othersCount?.toLocaleString()}件）`}
                          </Box>
                        </CustomCell>
                      </TableRow>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <CustomCell>改善一覧</CustomCell>
                        <CustomCell>
                          <Box component="div" sx={{ my: 0.7, alignItems: 'center' }}>
                            {`${improvementCount?.toLocaleString()}件　（是正処置：${correctiveActionCount?.toLocaleString()}件　予防措置：${preventiveMeasuresCount?.toLocaleString()}件）`}
                          </Box>
                        </CustomCell>
                      </TableRow>
                      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <CustomCell>プロジェクトミーティング</CustomCell>
                        <CustomCell>
                          <Box component="div" sx={{ my: 0.7, alignItems: 'center' }}>
                            {`${projectMeetingCount?.toLocaleString()}件`}
                          </Box>
                        </CustomCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ minHeight: '100px', height: '100px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>統計的考察</CustomCell>
              <CustomCell>
                <Box sx={{ py: 1, whiteSpace: 'pre-wrap'}}>{statisticalConsideration}</Box>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ minHeight: '100px', height: '100px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>品質目標達成度</CustomCell>
              <CustomCell>
                <Box sx={{ py: 1, whiteSpace: 'pre-wrap'}}>{qualitygoalsEvaluate}</Box>
              </CustomCell>
            </TableRow>
            <TableRow sx={{ minHeight: '100px', height: '100px', '&:last-child td, &:last-child th': { border: 0 } }}>
              <CustomCell>完了報告</CustomCell>
              <CustomCell>
                <Box sx={{ py: 1, whiteSpace: 'pre-wrap'}}>{totalReport}</Box>
              </CustomCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
export default RepShowPage;
