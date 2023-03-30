import { useEffect, useState } from 'react';
import { cmnProps } from '../common/cmnConst';
import { ColProps, initColProps } from "./SalesMainPage";
import { SketchPicker, ColorResult } from 'react-color';

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
  leadColor: string;
  setLeadColor: (leadColor: string) => void;
  close: (refresh?: boolean) => void;
}
const SalesMainSettingsPage = (props: Props) => {
  const [colProps, setColProps] = useState<ColProps>(initColProps);
  const [leadValid, setLeadValid] = useState<boolean>(false);
  const [leadColor, setLeadColor] = useState<string>("");
  const [displayColorPicker,  setDisplayColorPicker] = useState<boolean>(false);

  // 初期処理
  useEffect(() => {
    if(props.show){
      if (isEmpty(props.leadColor)) {
        setLeadValid(false);
      } else {
        setLeadValid(true);
      }
      setLeadColor(props.leadColor);
      setColProps({
//        name: {
//          align: props.colProps.name.align, 
//          width: props.colProps.name.width, 
//          visible: props.colProps.name.visible, 
//          title: props.colProps.name.title
//        },
        divName: {
          align: props.colProps.divName.align, 
          width: props.colProps.divName.width, 
          visible: props.colProps.divName.visible, 
          title: props.colProps.divName.title
        },
        companyName: {
          align: props.colProps.companyName.align, 
          width: props.colProps.companyName.width, 
          visible: props.colProps.companyName.visible, 
          title: props.colProps.companyName.title
        },
        productName: {
          align: props.colProps.productName.align, 
          width: props.colProps.productName.width, 
          visible: props.colProps.productName.visible, 
          title: props.colProps.productName.title
        },
        leadName: {
          align: props.colProps.leadName.align, 
          width: props.colProps.leadName.width, 
          visible: props.colProps.leadName.visible, 
          title: props.colProps.leadName.title
        },
        period: {
          align: props.colProps.period.align, 
          width: props.colProps.period.width, 
          visible: props.colProps.period.visible, 
          title: props.colProps.period.title
        },
        orderAmount: {
          align: props.colProps.orderAmount.align, 
          width: props.colProps.orderAmount.width, 
          visible: props.colProps.orderAmount.visible, 
          title: props.colProps.orderAmount.title
        },
        mainPersonName: {
          align: props.colProps.mainPersonName.align, 
          width: props.colProps.mainPersonName.width, 
          visible: props.colProps.mainPersonName.visible, 
          title: props.colProps.mainPersonName.title
        },
        salesChannels: {
          align: props.colProps.salesChannels.align, 
          width: props.colProps.salesChannels.width, 
          visible: props.colProps.salesChannels.visible, 
          title: props.colProps.salesChannels.title
        },
        salesPerson: {
          align: props.colProps.salesPerson.align, 
          width: props.colProps.salesPerson.width, 
          visible: props.colProps.salesPerson.visible, 
          title: props.colProps.salesPerson.title
        },
        closingDate: {
          align: props.colProps.closingDate.align, 
          width: props.colProps.closingDate.width, 
          visible: props.colProps.closingDate.visible, 
          title: props.colProps.closingDate.title
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

  // リード期限切れON/OFF切替
  const handleChangeLeadColorValid = (checkd: boolean) => {
    setLeadValid(checkd);
  }

  //ピッカーをポップアップするためのスタイル
  const popover: {} = {
    position: 'absolute',
    zIndex: '2',
  }

  //ピッカー以外の領域を所をクリックした時に閉じるためのカバー
  const cover: {} = {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  }

  // カラーピッカー変更
  const handleChangeColor = (color: ColorResult) => {
    // 第一引数のcolorで選択したカラー情報を取得することができます。
//    setColorHex(color.hex);
    const { r, g, b, a } = color.rgb;
    setLeadColor(`rgba(${r}, ${g}, ${b}, ${a})`);
  }
    
  // カラーピッカーを閉じる
  const handleColorPickerClose = () => {
    setDisplayColorPicker(false);
  }

  // 設定ボタン押下
  const handleSubmit = () => {
    props.setColProps(colProps);
    if(leadValid){
      props.setLeadColor(leadColor);
    } else {
      props.setLeadColor("");
    }
    props.close();
    setColProps(initColProps);
  }

  // キャンセルボタン押下
  const handleCancel = () => {
    props.close();
    setColProps(initColProps);
    setLeadValid(false);
    setLeadColor("");
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

      <Box component='div' sx={{ m: 2, p: 1, width: 'auto', display: 'flex', alignItems: 'center', border: 'solid 0.5px #c0c0c0', borderRadius: '4px', boxShadow: '1px 2px 1px rgba(192, 192, 192, 0.5)' }}>
        <Box component='div' sx={{ width: '180px', fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>リード期限切れマーカー</Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>OFF</Typography>
            <Switch checked={leadValid} onChange={(e) => handleChangeLeadColorValid(e.target.checked)} />
            <Typography sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>ON</Typography>
          </Stack>
          { leadValid && 
            <>
            <Paper sx={{ ml: 2, height: '25px', width: '50px', backgroundColor: leadColor }} onClick={() => setDisplayColorPicker(true)} />
            { displayColorPicker &&
              <div style={ popover }>
                <div style={ cover } onClick={ handleColorPickerClose }/>
                <SketchPicker color={leadColor} onChange={ handleChangeColor } />
              </div>
            }
            </>
          }
      </Box>
      <Paper  sx={{ my: 2, mx: 2, width: 'auto', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(90vh - 150px)' }}>
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
                <CustomCell>案件名</CustomCell>
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
export default SalesMainSettingsPage;
