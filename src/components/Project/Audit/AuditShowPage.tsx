import React, { useState, useEffect } from 'react';
import { AlertType } from './../../common/cmnType';
import { cmnProps } from './../../common/cmnConst';
import { getAudits } from '../../../lib/api/project';
import { isEmpty } from '../../../lib/common/isEmpty';
import Loading from './../../common/Loading';
import { formatDateZero } from '../../../lib/common/dateCom';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';

import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';

const CustomCell = styled(TableCell)({
  fontSize: cmnProps.fontSize,
  fontFamily: cmnProps.fontFamily,
  padding: 5,
});

const dateDispForm = "YYYY年MM月DD日";

type Audit = {
  title: string;
  contents: string;
  auditorName: number | null;
  auditDate: Date | null;
  result: string;
  acceptName: string;
  acceptDate: Date | null;
}
type Props = {
  projectId: number | null;
  kinds: 'plan' | 'report';
}
const AuditShowPage = (props: Props) => {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [err, setErr] = useState<AlertType>({severity: null, message: ""});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 初期処理
  useEffect(() => {
    if (!isEmpty(props.projectId)) {
      handleGetAudits();
    }
  },[props.projectId]);

  // 監査情報取得
  const handleGetAudits = async () => {
    try {
      const res = await getAudits(props.projectId, props.kinds);
      setAudits(res.data.audits);
    } catch (e) {
      setErr({severity: "error", message: "監査報取得エラー"});
    } 
    setIsLoading(false);
  }

  // 画面編集
  return (
    <Box component='div' sx={{ width: '100%', height: '100%' }}>

      {(err.severity) &&
        <Stack sx={{width: '100%'}} spacing={1} mb={3} >
          <Alert severity={err.severity}>{err.message}</Alert>
        </Stack>
      }

      <TableContainer component={Paper} sx={{ mt: 2, maxHeight: '70vh', border: '0.5px #c0c0c0 solid' }}>
        <Table sx={{ width: 1100 }} stickyHeader aria-label="audits table">
          <TableHead>
            <TableRow>
              <CustomCell sx={{ width: 200 }}>項目</CustomCell>
              <CustomCell sx={{ width: 320 }}>指摘内容</CustomCell>
              <CustomCell sx={{ width: 200 }}>監査</CustomCell>
              <CustomCell colSpan={2} sx={{ width: 280 }}>再確認</CustomCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { audits.map((a,i) => 
              <React.Fragment key={`audit-${i}`}>
                <TableRow>
                  <CustomCell rowSpan={2}>
                    <Box sx={{ py: 1, whiteSpace: 'pre-wrap'}}>{a.title}</Box>
                  </CustomCell>
                  <CustomCell rowSpan={2}>
                    <Box sx={{ py: 1, whiteSpace: 'pre-wrap'}}>{a.contents}</Box>
                  </CustomCell>
                  <CustomCell>{formatDateZero(a.auditDate, dateDispForm)}</CustomCell>
                  <CustomCell rowSpan={2}>{a.result}</CustomCell>
                  <CustomCell>{formatDateZero(a.acceptDate, dateDispForm)}</CustomCell>
                </TableRow>
                <TableRow>
                  <CustomCell>{a.auditorName}</CustomCell>
                  <CustomCell>{a.acceptName}</CustomCell>
                </TableRow>
              </React.Fragment>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Loading isLoading={isLoading} />
    </Box>
  );
}
export default AuditShowPage;
