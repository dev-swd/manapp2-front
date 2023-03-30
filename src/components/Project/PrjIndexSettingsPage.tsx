import { useEffect, useState } from 'react';
import { cmnProps } from '../common/cmnConst';
import { ColProps, initColProps } from "./PrjIndexPage";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';

import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { isEmpty } from '../../lib/common/isEmpty';

const CustomCell = styled(TableCell)({
  fontSize: cmnProps.fontSize,
  fontFamily: cmnProps.fontFamily,
  zIndex: 1
});

type Props = {
  show: boolean;
  colProps: ColProps;
  setColProps: (ColProps: ColProps) => void;
  close: (refresh?: boolean) => void;
}
const PrjIndexSettingsPage = (props: Props) => {
  const [colProps, setColProps] = useState<ColProps>(initColProps);

  // 初期処理
  useEffect(() => {
    if(props.show){
      setColProps({
        name: {
          align: props.colProps.name.align, 
          width: props.colProps.name.width, 
          visible: props.colProps.name.visible, 
          title: props.colProps.name.title
        },
        approvalDate: {
          align: props.colProps.approvalDate.align, 
          width: props.colProps.approvalDate.width, 
          visible: props.colProps.approvalDate.visible, 
          title: props.colProps.approvalDate.title
        },
        divName: {
          align: props.colProps.divName.align, 
          width: props.colProps.divName.width, 
          visible: props.colProps.divName.visible, 
          title: props.colProps.divName.title
        },
        plName: {
          align: props.colProps.plName.align, 
          width: props.colProps.plName.width, 
          visible: props.colProps.plName.visible, 
          title: props.colProps.plName.title
        },
        status: {
          align: props.colProps.status.align, 
          width: props.colProps.status.width, 
          visible: props.colProps.status.visible, 
          title: props.colProps.status.title
        },
        makeDate: {
          align: props.colProps.makeDate.align, 
          width: props.colProps.makeDate.width, 
          visible: props.colProps.makeDate.visible, 
          title: props.colProps.makeDate.title
        },
        makeName: {
          align: props.colProps.makeName.align, 
          width: props.colProps.makeName.width, 
          visible: props.colProps.makeName.visible, 
          title: props.colProps.makeName.title
        },
        updateDate: {
          align: props.colProps.updateDate.align, 
          width: props.colProps.updateDate.width, 
          visible: props.colProps.updateDate.visible, 
          title: props.colProps.updateDate.title
        },
        updateName: {
          align: props.colProps.updateName.align, 
          width: props.colProps.updateName.width, 
          visible: props.colProps.updateName.visible, 
          title: props.colProps.updateName.title
        },
        companyName: {
          align: props.colProps.companyName.align, 
          width: props.colProps.companyName.width, 
          visible: props.colProps.companyName.visible, 
          title: props.colProps.companyName.title
        },
        departmentName: {
          align: props.colProps.departmentName.align, 
          width: props.colProps.departmentName.width, 
          visible: props.colProps.departmentName.visible, 
          title: props.colProps.departmentName.title
        },
        personinchargeName: {
          align: props.colProps.personinchargeName.align, 
          width: props.colProps.personinchargeName.width, 
          visible: props.colProps.personinchargeName.visible, 
          title: props.colProps.personinchargeName.title
        },
        developmentPeriod: {
          align: props.colProps.developmentPeriod.align, 
          width: props.colProps.developmentPeriod.width, 
          visible: props.colProps.developmentPeriod.visible, 
          title: props.colProps.developmentPeriod.title
        },
        scheduledToBeCompleted: {
          align: props.colProps.scheduledToBeCompleted.align, 
          width: props.colProps.scheduledToBeCompleted.width, 
          visible: props.colProps.scheduledToBeCompleted.visible, 
          title: props.colProps.scheduledToBeCompleted.title
        },
        createdAt: {
          align: props.colProps.createdAt.align, 
          width: props.colProps.createdAt.width, 
          visible: props.colProps.createdAt.visible, 
          title: props.colProps.createdAt.title
        },
        updatedAt: {
          align: props.colProps.updatedAt.align, 
          width: props.colProps.updatedAt.width, 
          visible: props.colProps.updatedAt.visible, 
          title: props.colProps.updatedAt.title
        },
      });
    }
  },[props.show]);

  // 表示・非表示変更
  const handleChange = (key: string, checked: boolean) => {
    let tmp = colProps[key as keyof ColProps];
    tmp.visible = checked;
    setColProps({
      ...colProps,
      [key as keyof ColProps]: tmp,
    });
  }

  // 設定ボタン押下
  const handleSubmit = () => {
    props.setColProps(colProps);
    props.close();
    setColProps(initColProps);
  }

  // キャンセルボタン押下
  const handleCancel = () => {
    props.close();
    setColProps(initColProps);
  }

  // 画面編集
  return (
    <Box component='div' sx={{ backgroundColor: '#fff', height: 'auto', width: 430, minWidth: '400px', overflow: 'hidden', pt: 6 }}>

      <Box component='div' sx={{ mt: 3, mx: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          color="primary"
          variant="outlined" 
          startIcon={<SettingsIcon />}
          onClick={() => handleSubmit()}
        >
          Set
        </Button>
        <Button
          color="primary"
          endIcon={<KeyboardArrowRightIcon />}
          onClick={() => handleCancel()}
        >
          Close
        </Button>
      </Box>

      <Paper  sx={{ my: 2, mx: 2, width: 'auto', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(90vh - 100px)' }}>
          <Table stickyHeader aria-label="prospects table">
            <TableHead>
              <TableRow>
                <CustomCell sx={{ width: 200 }}>項目</CustomCell>
                <CustomCell sx={{ width: 200 }}>表示／非表示</CustomCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <CustomCell>プロジェクトNo.</CustomCell>
                <CustomCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>非表示</Typography>
                    <Switch checked={true} disabled/>
                    <Typography sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>表示</Typography>
                  </Stack>
                </CustomCell>
              </TableRow>
              { Object.keys(colProps).map((key,i) => (
                <TableRow
                  key={`row-${i}`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <CustomCell>{colProps[key as keyof ColProps]["title"]}</CustomCell>
                  <CustomCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>非表示</Typography>
                      <Switch checked={colProps[key as keyof ColProps]["visible"]} onChange={(e) => handleChange(key, e.target.checked)} />
                      <Typography sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>表示</Typography>
                    </Stack>
                  </CustomCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
export default PrjIndexSettingsPage;