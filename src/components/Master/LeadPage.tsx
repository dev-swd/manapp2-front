import { useEffect, useState } from 'react';
import { cmnProps } from '../common/cmnConst';
import { AlertType } from '../common/cmnType';
import { getLeads, updateLeads, updateLeadParams } from '../../lib/api/prospect';
import { integerOnly } from '../../lib/common/inputRegulation';
import { isEmpty } from '../../lib/common/isEmpty';

import Loading from '../common/Loading';
import ConfirmDlg, { ConfirmParam } from '../common/ConfirmDlg';
import { SketchPicker, ColorResult } from 'react-color';

import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import MoveUpIcon from '@mui/icons-material/MoveUp';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';

import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from "@mui/material/MenuItem";

const CustomHead = styled(TableCell)({
  fontSize: cmnProps.fontSize,
  fontFamily: cmnProps.fontFamily,
  paddingLeft: 5,
});
const CustomCell = styled(TableCell)({
  fontSize: cmnProps.fontSize,
  fontFamily: cmnProps.fontFamily,
  padding: 5,
});

// ディレイ用
const wait = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type Props = {
  show: boolean;
  close: () => void;
}
const LeadPage = (props: Props) => {
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [data, setData] = useState<updateLeadParams>({leads: []});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [confirm, setConfirm] = useState<ConfirmParam>({ message: "", tag: null, width: null });

  // 初期処理
  useEffect(() => {
    setIsLoading(true);
    handleGetLeads();
  }, [props.show]);
  
  // 商材一覧取得
  const handleGetLeads = async () => {
    // ちらつき防止のため意図的にディレイを入れる（0.5秒）
    await wait(500);
    try {
      const res = await getLeads();
      setData({
        leads: res.data.leads});
    } catch (e) {
      setErr({severity: "error", message: "リードレベル取得エラー"});
    } 
    setIsLoading(false);
  }

  // 閉じるボタン押下時の処理
  const handleClose = () => {
    props.close();
    setData({leads: []});
    setErr({severity: null, message: ""});
  }

  // 追加ボタン押下時の処理
  const handleAdd = () => {
    setData({ ...data,
      leads : [...data.leads,
      {id: null, 
      name: "", 
      periodKbn: "",
      period: null,
      colorR: 51,
      colorG: 51,
      colorB: 255,
      colorA: 0.5,
      del: false,
      }]});
  }

  // Name入力時処理
  const handleChangeName= (i: number, value: string) => {
    const tmpLeads = [...data.leads];
    tmpLeads[i].name = value;
    setData({
      ...data,
      leads: tmpLeads
    });
  }

  // 期間区分入力時処理
  const handleChangePeriodKbn= (i: number, value: string) => {
    const tmpLeads = [...data.leads];
    tmpLeads[i].periodKbn = value;
    if (value === "n") {
      tmpLeads[i].period = null;
    }
    setData({
      ...data,
      leads: tmpLeads
    });
  }

  // 期間入力時処理
  const handleChangePeriod= (i: number, value: number) => {
    const tmpLeads = [...data.leads];
    tmpLeads[i].period = value;
    setData({
      ...data,
      leads: tmpLeads
    });
  }

  // MoveUp処理
  const handleMoveUp = (i: number) => {
    if (i !== 0) {
      let _tmpLeads = data.leads.slice(0, i-1);
      let _tmpLead = data.leads[i-1];
      let tmpLead = data.leads[i];
      let tmpLeads_ = data.leads.slice(i+1);

      let tmpLeads = _tmpLeads.concat(tmpLead, _tmpLead, tmpLeads_);
      setData({
        ...data,
        leads: tmpLeads
      });
    }
  }

  // MoveDown処理
  const handleMoveDown = (i: number) => {
    if (i !== (data.leads.length - 1)) {
      let _tmpLeads = data.leads.slice(0, i);
      let tmpLead = data.leads[i];
      let tmpLead_ = data.leads[i+1];
      let tmpLeads_ = data.leads.slice(i+2);

      let tmpLeads = _tmpLeads.concat(tmpLead_, tmpLead, tmpLeads_);
      setData({
        ...data,
        leads: tmpLeads
      });
    }
  }

  // Delete処理
  const handleDelete = (i: number) => {
    const tmpLeads = [...data.leads];
    tmpLeads[i].del = !tmpLeads[i].del;
    setData({
      ...data,
      leads: tmpLeads
    });
  }

  // 保存ボタン活性判断
  const setDisabled = () => {
    if(!data.leads.length){
      return true;
    }
    let ret: boolean = false;
    data.leads.forEach(l => {
      if(!l.del){
        if((isEmpty(l.name))){
          ret = true;
        }
        if(l.periodKbn!=='n'){
          if(isEmpty(l.period)){
            ret = true;
          };
        }
      }
    });
    return ret;
  }

  // 保存ボタン押下時処理
  const handleSubmit = () => {
    setConfirm({
      message: "現在の情報で保存します。よろしいですか。",
      tag: null,
      width: 400
    });
  }

  // 登録確認OK処理
  const handleSubmitOK = (dummy :null) => {
    setConfirm({
      message: "",
      tag: null,
      width: null
    });
    setIsLoading(true);
    saveLeads();
  }

  //登録処理
  const saveLeads = async () => {
    try {
      const res = await updateLeads(data);
      if (res.data.status === 500) {
        setErr({severity: "error", message: "リードレベル保存エラー(500)"});
      } else {
        props.close();
        setData({leads: []});
        setErr({severity: null, message: ""});
      }
    } catch (e) {
      setErr({severity: "error", message: "リードレベル保存エラー"});
    }
    setIsLoading(false);
  }

  // 登録確認Cancel処理
  const handleSubmitCancel = () => {
    setConfirm({
      message: "",
      tag: null,
      width: null
    });
  }

  // カラーピッカー変更
  const handleChangeColor = (i: number, colorR: number, colorG: number, colorB: number, colorA: number) => {
    const tmpLeads = [...data.leads];
    tmpLeads[i].colorR = colorR;
    tmpLeads[i].colorG = colorG;
    tmpLeads[i].colorB = colorB;
    tmpLeads[i].colorA = colorA;
    setData({
      ...data,
      leads: tmpLeads
    });    
  }

  // カラーピッカー部品
  type PickerProps = {
    colorR: number;
    colorG: number;
    colorB: number;
    colorA: number;
    i: number;
    handleChange: (i: number, colorR: number, colorG: number, colorB: number, colorA: number) => void;
  }
  const ColorPicker = (props: PickerProps) => {
    const [thisColor, setThisColor] = useState<string>("");
    const [thisColorR, setThisColorR] = useState<number>(51);
    const [thisColorG, setThisColorG] = useState<number>(51);
    const [thisColorB, setThisColorB] = useState<number>(255);
    const [thisColorA, setThisColorA] = useState<number>(0.5);
    const [displayColorPicker,  setDisplayColorPicker] = useState<boolean>(false);

    // 初期処理
    useEffect(() => {
      setThisColor(`rgba(${props.colorR}, ${props.colorG}, ${props.colorB}, ${props.colorA})`);
      setThisColorR(props.colorR);
      setThisColorG(props.colorG);
      setThisColorB(props.colorB);
      setThisColorA(props.colorA);
    }, [props.colorR, props.colorG, props.colorB, props.colorA]);

    // カラーピッカーをポップアップするためのスタイル
    const popover: {} = {
      position: 'absolute',
      zIndex: '2',
    }

    // カラーピッカー以外の領域を所をクリックした時に閉じるためのカバー
    const cover: {} = {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    }

    // カラーピッカー変更
    const handleChange = (color: ColorResult) => {
      // 第一引数のcolorで選択したカラー情報を取得することができます。
  //    setColorHex(color.hex);
      const { r, g, b, a } = color.rgb;
      setThisColor(`rgba(${r}, ${g}, ${b}, ${a})`);
      setThisColorR(r);
      setThisColorG(g);
      setThisColorB(b);
      setThisColorA(a===undefined ? 0.5 : a);
    }
    
    // カラーピッカーを閉じる
    const handleColorPickerClose = () => {
      setDisplayColorPicker(false);
      props.handleChange(props.i, thisColorR, thisColorG, thisColorB, thisColorA);
    }
  
    return (
      <>
        <Paper sx={{ height: '25px', width: '80px', border: `solid 2px rgba(${props.colorR}, ${props.colorG}, ${props.colorB}, 1)`, backgroundColor: `rgba(${props.colorR}, ${props.colorG}, ${props.colorB}, ${props.colorA})` }} onClick={() => setDisplayColorPicker(true)} />
        { displayColorPicker &&
          <div style={ popover }>
            <div style={ cover } onClick={ handleColorPickerClose }/>
            <SketchPicker color={thisColor} onChange={ handleChange } />
          </div>
        }
      </>
    );
  }

  // 画面編集
  return (
    <>
      { props.show ? (
        <div className='overlay'>
          <Box component='div' sx={{ height: '100vh', width: '100vw', backgroundColor: '#fff'}}>
            <AppBar position='static'>
              <Toolbar variant="dense">
                <SettingsSuggestIcon />
                <Typography variant='caption' component="div" sx={{ ml: 1, flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>Lead Level 〜リードレベル〜</Typography>
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

            <Box component='div' sx={{ mx: 5 }}>

              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<SaveAltIcon />}
                disabled={setDisabled()}
                style={{marginTop:20, marginBottom:30}}
                onClick={(e) => handleSubmit()}
              >
                保存
              </Button>
              
              <TableContainer component={Paper}>
                <Table sx={{ width: 900 }} stickyHeader aria-label="leads table">
                  <TableHead>
                    <TableRow>
                      <CustomHead sx={{ width: 400 }}>リードレベル</CustomHead>
                      <CustomHead sx={{ width: 100 }}>期間</CustomHead>
                      <CustomHead sx={{ width: 200 }}>期間区分</CustomHead>
                      <CustomHead sx={{ width: 100 }}>グラフ配色</CustomHead>
                      <CustomHead sx={{ width: 200 }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    { data.leads.map((l,i) => (
                      <TableRow
                        key={i}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <CustomCell>
                          <TextField
                            required
                            fullWidth
                            error={l.del}
                            id={"name" + i}
                            name="name"
                            label="Name"
                            value={l.name}
                            variant="standard"
                            size="small"
                            inputProps={{maxLength:40, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                            InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                            onChange={(e) => handleChangeName(i, e.target.value)}
                          />
                        </CustomCell>
                        <CustomCell>
                          <TextField
                            required
                            fullWidth
                            error={l.del}
                            disabled={l.periodKbn==="n"}
                            id={"period" + i}
                            name="period"
                            label="期間"
                            value={l.period || undefined}
                            variant="standard"
                            size="small"
                            inputProps={{maxLength:2, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                            InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                            onChange={(e) => handleChangePeriod(i, Number(integerOnly(e.target.value)))}
                          />
                        </CustomCell>
                        <CustomCell>
                          <FormControl variant="outlined" fullWidth>
                            <InputLabel id="select-periodKbn-label" sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}>期間区分</InputLabel>
                            <Select
                              error={l.del}
                              labelId="select-periodKbn-label"
                              id={"select-periodKbn" + i}
                              label="期間区分"
                              value={l.periodKbn}
                              onChange={(e) => handleChangePeriodKbn(i, e.target.value)}
                              sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}
                            >
                              <MenuItem sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value="n">時期未定</MenuItem>
                              <MenuItem sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value="y">年以内</MenuItem>
                              <MenuItem sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value="m">月ヶ月以内</MenuItem>
                              <MenuItem sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value="d">日以内</MenuItem>
                            </Select>
                          </FormControl>
                        </CustomCell>
                        <CustomCell>
                          <ColorPicker colorR={l.colorR} colorG={l.colorG} colorB={l.colorB} colorA={l.colorA} i={i} handleChange={handleChangeColor} />
                        </CustomCell>
                        <CustomCell>
                          <IconButton aria-label="move-up" onClick={() => handleMoveUp(i)} disabled={(i === 0) ? true : false }>
                            {(i === 0) ? (
                              <MoveUpIcon color="disabled" fontSize="inherit" />
                            ) : (
                              <MoveUpIcon color="primary" fontSize="inherit" />
                            )}
                          </IconButton>
                          <IconButton aria-label="move-down" onClick={() => handleMoveDown(i)} disabled={(i === (data.leads.length-1)) ? true : false }>
                            {(i === (data.leads.length-1)) ? (
                              <MoveDownIcon color="disabled" fontSize="inherit" />
                            ) : (
                              <MoveDownIcon color="primary" fontSize="inherit" />
                            )}
                          </IconButton>
                          <IconButton aria-label="delete" onClick={() => handleDelete(i)}>
                            { l.del ? (
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
              <Box sx={{ textAlign: 'center' }}>
                <IconButton aria-label="Add" color="primary" size="large" onClick={() => handleAdd()}>
                  <AddCircleIcon sx={{ fontSize : 40 }} />
                </IconButton>
              </Box>
            </Box>
            <ConfirmDlg confirm={confirm} handleOK={handleSubmitOK} handleCancel={handleSubmitCancel} />
            <Loading isLoading={isLoading} />
          </Box>
        </div>
      ) : (
        <></>
      )}
    </>  );
}
export default LeadPage;
