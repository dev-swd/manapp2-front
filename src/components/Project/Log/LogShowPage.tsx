import { useState, useEffect } from 'react';
import { AlertType } from '../../common/cmnType';
import { cmnProps } from '../../common/cmnConst';
import { getChangelogs } from '../../../lib/api/project';
import { isEmpty } from '../../../lib/common/isEmpty';
import { formatDateZero } from '../../../lib/common/dateCom';
import Loading from './../../common/Loading';

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

type Changelog = {
  changeDate: Date | null;
  contents: string;
}
type Props = {
  projectId: number | null;
}
const LogShowPage = (props: Props) => {
  const [logs, setLogs] = useState<Changelog[]>([]);
  const [err, setErr] = useState<AlertType>({severity: null, message: ""});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 初期処理
  useEffect(() => {
    if (!isEmpty(props.projectId)) {
      handleGetLogs();
    }
  },[props.projectId]);

  // 監査情報取得
  const handleGetLogs = async () => {
    try {
      const res = await getChangelogs(props.projectId);
      setLogs(res.data.changelogs);
    } catch (e) {
      setErr({severity: "error", message: "ログ取得エラー"});
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
        <Table sx={{ width: 1100 }} stickyHeader aria-label="log table">
          <TableHead>
            <TableRow>
              <CustomCell sx={{ width: 200 }}>日付</CustomCell>
              <CustomCell sx={{ width: 900 }}>変更内容</CustomCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { logs.map((l,i) => 
              <TableRow key={`log-${i}`}>
                <CustomCell>{formatDateZero(l.changeDate, dateDispForm)}</CustomCell>
                <CustomCell>
                  <Box sx={{ py: 1, whiteSpace: 'pre-wrap'}}>{l.contents}</Box>
                </CustomCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Loading isLoading={isLoading} />
    </Box>
  );
}
export default LogShowPage;