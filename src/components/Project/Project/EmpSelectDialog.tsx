import { useState } from 'react';
import { cmnProps } from './../../common/cmnConst';
import { AlertType } from '../../common/cmnType';
import SelectEmployee, { Emp } from '../../common/SelectEmployee';
import { isEmpty } from '../../../lib/common/isEmpty';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

type Props = {
  show: boolean;
  submit: (id: number | null, name: string) => void;
  close: () => void;
}
const EmpSelectDialog = (props: Props) => {
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });

  const [emp, setEmp] = useState<Emp>({id: null, employeeNumber: "", name: "", depName: "", divName: "", divisionId: null});

  // 終了時処理
  const handleClose = () => {
    props.close();
    setEmp({id: null, employeeNumber: "", name: "", depName: "", divName: "", divisionId: null});
    setErr({severity: null, message: ""});
  }

  // 追加ボタン押下時
  const handleAdd = () => {
    props.submit(emp.id, emp.name);
    props.close();
    setEmp({id: null, employeeNumber: "", name: "", depName: "", divName: "", divisionId: null});
    setErr({severity: null, message: ""});
  }

  // 画面編集
  return (
    <>
      { props.show && 
        <div className="overlay-dark">
          <Box component='div' sx={{ backgroundColor: '#fff', height: 200, border: "0.5px solid #000", boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>
            <AppBar position='static'>
              <Toolbar variant="dense">
                <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>パスワード変更</Typography>
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

            <Box component="div" sx={{ mx: 5, mt: 4, display: "flex", alignItems: "center" }}>
              <SelectEmployee 
                emp={emp}
                setEmp={setEmp}
                setErr={setErr}
                label="社員"
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<PersonAddIcon />}
                sx={{ height: "30px", ml: 2 }}
                disabled={(isEmpty(emp.id))}
                onClick={(e) => handleAdd()}
              >
                追加
              </Button>
            </Box>

          </Box>
        </div>
      }
    </>
  );
}
export default EmpSelectDialog;
