import { useState } from 'react';
import { cmnProps } from './../common/cmnConst';
import SalesShowPage from './SalesShowPage';
import ReportIndexPage from './ReportIndexPage';
import ReportGraphPage from './ReportGraphPage';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
type Props = {
  show: boolean;
  prospectId: number | null;
  isClosing: boolean;
  setIsClosing: (isClosing: boolean) => void;
  close: (refresh?: boolean) => void;  
}
const SalesDetailPage = (props: Props) => {
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isUpdateReport, setIsUpdateReport] = useState<boolean>(false);

  // 閉じるボタン押下時の処理
  const handleClose = () => {
    if(isUpdate){
      props.close(true);
    } else {
      props.close();
    }
    setIsUpdate(false);
    setIsUpdateReport(false);
  }

  // 画面編集
  return (
    <>
      { props.show ? (
        <div className='fullscreen'>
          <AppBar position='static'>
            <Toolbar variant="dense">
              <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>案件情報詳細</Typography>
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

          <Box component='div' sx={{ width: '100%', overflowX: 'scroll'}}>
            <Box component='div' sx={{ height: 'calc(100vh - 100px)', display: 'flex', width: '150vw'}}>
              <Box component='div' sx={{height: 'calc(100vh - 100px)', width: '50vw'}}>
                <SalesShowPage prospectId={props.prospectId} setIsClosing={props.setIsClosing} setIsUpdate={setIsUpdate} />
              </Box>
              <Box component='div' sx={{height: 'calc(100vh - 100px)', width: '50vw'}}>
                <ReportIndexPage prospectId={props.prospectId} isClosing={props.isClosing} setIsUpdateReport={setIsUpdateReport} isUpdateReport={isUpdateReport} />
              </Box>
              <Box component='div' sx={{height: 'calc(100vh - 100px)', width: '50vw'}}>
                <ReportGraphPage prospectId={props.prospectId} isUpdateReport={isUpdateReport} />
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
export default SalesDetailPage;
