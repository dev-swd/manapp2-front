import { useState, useContext } from 'react';
import { GlobalContext } from './../../App';
import { AlertType } from './../common/cmnType';
import { cmnProps } from './../common/cmnConst';
import ConfirmDlg, { ConfirmParam } from './../common/ConfirmDlg';
import Loading from './../common/Loading';
import { isEmpty } from '../../lib/common/isEmpty';
import { closingProspect, closingParam } from '../../lib/api/prospect';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import TextField from '@mui/material/TextField';
import { LocalizationProvider, DatePicker } from  '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import ja from 'date-fns/locale/ja'

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

type Props = {
  show: boolean;
  prospectId: number | null;
  closingDate: Date | null;
  close: (refresh?: boolean) => void;
}
const SalesClosePage = (props: Props) => {
  const { currentUser } = useContext(GlobalContext);
  const [closingDate, setClosingDate] = useState<Date | null>(props.closingDate);

  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [confirm, setConfirm] = useState<ConfirmParam>( { message: "", tag: "", width: null });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 登録ボタン押下時の処理
  const handleSubmit = () => {
    let message: string = "";
    if (props.closingDate){
      if (isEmpty(closingDate)){
        message = "受注確定を解除します。よろしいですか？"
      } else {
        message = "受注確定日を変更します。よろしいですか？"
      }
    } else {
      message = "この案件を受注確定にします。よろしいですか？"
    }
    setConfirm({
      message: message,
      tag: "",
      width: 400
    });
  }

  // 確認ダイアログでOKの場合の処理
  const handleConfirmOK = (dummy: string) => {
    setConfirm({
      message: "",
      tag: "",
      width: null
    });
    setIsLoading(true);
    saveSales();
  }

  // 登録処理
  const saveSales = async () => {
    const params: closingParam = {
      closingDate: closingDate,
      updateId: currentUser.id,
    }
    try {
      const res = await closingProspect(props.prospectId, params);
      if (res.status === 200){
        props.close(true);
        setClosingDate(null);
        setErr({severity: null, message: ""});
      } else {
        setErr({severity: "error", message: "案件情報更新エラー(" + res.status + ")"});
      }
    } catch (e) {
      setErr({severity: "error", message: "案件情報更新エラー"});
    }
    setIsLoading(false);
  }

  // 確認ダイアログでキャンセルの場合の処理
  const handleCofirmCancel = () => {
    setConfirm({
      message: "",
      tag: "",
      width: null
    });
  }

  // 閉じるボタン押下時の処理
  const handleClose = () => {
    props.close();
    setClosingDate(null);
    setErr({severity: null, message: ""});
  }

  // 画面編集
  return (
    <>
      { props.show ? (
        <div className="overlay-dark">
          <Box component='div' sx={{ backgroundColor: '#fff', height: '300px', width: '400px', minWidth: '400px', border: "0.5px solid #000", boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>
            <AppBar position='static'>
              <Toolbar variant="dense">
                <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>受注確定登録</Typography>
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

            <Box component='div' sx={{overflow: 'auto', height: 'calc(100% - 50px)'}}>

              {(err.severity) &&
                <Stack sx={{width: '100%'}} spacing={1}>
                  <Alert severity={err.severity}>{err.message}</Alert>
                </Stack>
              }

              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<SaveAltIcon />}
                style={{marginTop:20, marginLeft:20, marginBottom:30}}
                onClick={(e) => handleSubmit()}
              >
                登録
              </Button>

              <Box component="div" sx={{ mx: 2, pt: 2, pl: 5 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} >
                  <DatePicker
                    label="受注確定日"
                    inputFormat="yyyy年MM月dd日"
                    mask='____年__月__日'
                    value={closingDate}
                    onChange={(value: Date | null) => setClosingDate(value)}
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
            </Box>
          </Box>
          <ConfirmDlg confirm={confirm} handleOK={handleConfirmOK} handleCancel={handleCofirmCancel} />
          <Loading isLoading={isLoading} />
        </div>  
      ) : (
        <></>
      )}
    </>
  );
}
export default SalesClosePage;
