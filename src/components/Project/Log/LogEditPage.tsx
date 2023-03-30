import { useState } from 'react';
import { cmnProps } from './../../common/cmnConst';
import { isEmpty } from '../../../lib/common/isEmpty';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

type Props = {
  show: boolean;
  log: string;
  setLog: (contents: string) => void;
  submit: () => void;
  cancel: () => void;
}
const LogEditPage = (props: Props) => {

  // 登録ボタン押下
  const handleSubmit = () => {
    props.submit();
  }

  // キャンセルボタン押下
  const handleCancel = () => {
    props.cancel();
    props.setLog("");
  }

  // 画面編集
  return (
    <>
      { props.show ? (
        <div className="overlay-dark">
          <Box component='div' sx={{ backgroundColor: '#fff', height: '300px', width: '50%', minWidth: '400px', border: "0.5px solid #000", boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>
            <AppBar position='static'>
              <Toolbar variant="dense">
                <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>変更履歴</Typography>
              </Toolbar>
            </AppBar>

            <Box component='div' sx={{overflow: 'auto', height: 'calc(100% - 50px)'}}>

              <Button
                variant="contained"
                color="primary"
                size="small"
                disabled={isEmpty(props.log)}
                onClick={(e) => handleSubmit()}
                sx={{ my: 3, mx: 3 }}
              >
                登録
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={(e) => handleCancel()}
              >
                キャンセル
              </Button>

              <Box sx={{ mx: 3 }}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={5}
                  id="contents"
                  name="contents"
                  label="変更概要"
                  value={props.log}
                  variant="outlined"
                  size="small"
                  inputProps={{maxLength:100, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => props.setLog(e.target.value)}
                />
              </Box>

            </Box>
          </Box>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
export default LogEditPage;
