import { useEffect, useState } from 'react';
import { cmnProps } from '../common/cmnConst';
import { AlertType } from '../common/cmnType';
import { getProducts, updateProducts, updateProductParams } from '../../lib/api/master';
import Loading from '../common/Loading';
import ConfirmDlg, { ConfirmParam } from '../common/ConfirmDlg';
import { SketchPicker, ColorResult } from 'react-color';
import { isEmpty } from '../../lib/common/isEmpty';

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
const ProductPage = (props: Props) => {
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [data, setData] = useState<updateProductParams>({products: []});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [confirm, setConfirm] = useState<ConfirmParam>({ message: "", tag: null, width: null });

  // 初期処理
  useEffect(() => {
    setIsLoading(true);
    handleGetProducts();
  }, [props.show]);
  
  // 商材一覧取得
  const handleGetProducts = async () => {
    // ちらつき防止のため意図的にディレイを入れる（0.5秒）
    await wait(500);
    try {
      const res = await getProducts();
      setData({
        products: res.data.products});
    } catch (e) {
      setErr({severity: "error", message: "商材マスタ取得エラー"});
    } 
    setIsLoading(false);
  }

  // 閉じるボタン押下時の処理
  const handleClose = () => {
    props.close();
    setData({products: []});
    setErr({severity: null, message: ""});
  }

  // 追加ボタン押下時の処理
  const handleAdd = () => {
    setData({ ...data,
      products : [...data.products,
      {id: null, 
      code: "", 
      name: "", 
      colorR: 51,
      colorG: 51,
      colorB: 255,
      colorA: 0.5,
      del: false,
      }]});
  }

  // Code入力時処理
  const handleChangeCode = (i: number, value: string) => {
    const tmpProducts = [...data.products];
    tmpProducts[i].code = value;
    setData({
      ...data,
      products: tmpProducts
    });
  }

  // Name入力時処理
  const handleChangeName= (i: number, value: string) => {
    const tmpProducts = [...data.products];
    tmpProducts[i].name = value;
    setData({
      ...data,
      products: tmpProducts
    });
  }

  // MoveUp処理
  const handleMoveUp = (i: number) => {
    if (i !== 0) {
      let _tmpProducts = data.products.slice(0, i-1);
      let _tmpProduct = data.products[i-1];
      let tmpProduct = data.products[i];
      let tmpProducts_ = data.products.slice(i+1);

      let tmpProducts = _tmpProducts.concat(tmpProduct, _tmpProduct, tmpProducts_);
      setData({
        ...data,
        products: tmpProducts
      });
    }
  }

  // MoveDown処理
  const handleMoveDown = (i: number) => {
    if (i !== (data.products.length - 1)) {
      let _tmpProducts = data.products.slice(0, i);
      let tmpProduct = data.products[i];
      let tmpProduct_ = data.products[i+1];
      let tmpProducts_ = data.products.slice(i+2);

      let tmpProducts = _tmpProducts.concat(tmpProduct_, tmpProduct, tmpProducts_);
      setData({
        ...data,
        products: tmpProducts
      });
    }
  }

  // Delete処理
  const handleDelete = (i: number) => {
    const tmpProducts = [...data.products];
    tmpProducts[i].del = !tmpProducts[i].del;
    setData({
      ...data,
      products: tmpProducts
    });
  }

  // 保存ボタン活性判断
  const setDisabled = () => {
    if(!data.products.length){
      return true;
    }
    let ret: boolean = false;
    data.products.forEach(p => {
      if(!p.del){
        if((isEmpty(p.code) || isEmpty(p.name))){
          ret = true;
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
    saveProducts();
  }

  //登録処理
  const saveProducts = async () => {
    try {
      const res = await updateProducts(data);
      if (res.data.status === 500) {
        setErr({severity: "error", message: "商材マスタ保存エラー(500)"});
      } else {
        props.close();
        setData({products: []});
        setErr({severity: null, message: ""});
      }
    } catch (e) {
      setErr({severity: "error", message: "商材マスタ保存エラー"});
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
    const tmpProducts = [...data.products];
    tmpProducts[i].colorR = colorR;
    tmpProducts[i].colorG = colorG;
    tmpProducts[i].colorB = colorB;
    tmpProducts[i].colorA = colorA;
    setData({
      ...data,
      products: tmpProducts
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
                <Typography variant='caption' component="div" sx={{ ml: 1, flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>Products 〜商材マスタ〜</Typography>
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
                <Table sx={{ width: 800 }} stickyHeader aria-label="products table">
                  <TableHead>
                    <TableRow>
                      <CustomHead sx={{ width: 200 }}>コード</CustomHead>
                      <CustomHead sx={{ width: 400 }}>商材</CustomHead>
                      <CustomHead sx={{ width: 100 }}>グラフ配色</CustomHead>
                      <CustomHead sx={{ width: 200 }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    { data.products.map((p,i) => (
                      <TableRow
                        key={i}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <CustomCell>
                          <TextField
                            required
                            fullWidth
                            error={p.del}
                            id={"code" + i}
                            name="code"
                            label="Code"
                            value={p.code}
                            variant="standard"
                            size="small"
                            inputProps={{maxLength:20, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                            InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                            onChange={(e) => handleChangeCode(i, e.target.value)}
                          />
                        </CustomCell>
                        <CustomCell>
                          <TextField
                            required
                            fullWidth
                            error={p.del}
                            id={"name" + i}
                            name="name"
                            label="Name"
                            value={p.name}
                            variant="standard"
                            size="small"
                            inputProps={{maxLength:40, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                            InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                            onChange={(e) => handleChangeName(i, e.target.value)}
                          />
                        </CustomCell>
                        <CustomCell>
                          <ColorPicker colorR={p.colorR} colorG={p.colorG} colorB={p.colorB} colorA={p.colorA} i={i} handleChange={handleChangeColor} />
                        </CustomCell>
                        <CustomCell>
                          <IconButton aria-label="move-up" onClick={() => handleMoveUp(i)} disabled={(i === 0) ? true : false }>
                            {(i === 0) ? (
                              <MoveUpIcon color="disabled" fontSize="inherit" />
                            ) : (
                              <MoveUpIcon color="primary" fontSize="inherit" />
                            )}
                          </IconButton>
                          <IconButton aria-label="move-down" onClick={() => handleMoveDown(i)} disabled={(i === (data.products.length-1)) ? true : false }>
                            {(i === (data.products.length-1)) ? (
                              <MoveDownIcon color="disabled" fontSize="inherit" />
                            ) : (
                              <MoveDownIcon color="primary" fontSize="inherit" />
                            )}
                          </IconButton>
                          <IconButton aria-label="delete" onClick={() => handleDelete(i)}>
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
    </>
  );
}
export default ProductPage;
