import React, { useState } from 'react';
import Header from '../Header';
import ApplicationPage from './ApplicationPage';
import RolesMainPage from './RolesMainPage';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

const SetMainPage: React.FC = () => {
  const [appShow, setAppShow] = useState<boolean>(false);
  const [roleShow, setRoleShow] = useState<boolean>(false);

  // Application画面終了
  const handleCloseApp = () => {
    setAppShow(false);
  }

  // Role画面終了
  const handleCloseRole = () => {
    setRoleShow(false);
  }

  return (
    <Box component='div' sx={{ height: '100vh', backgroundColor: '#fff'}}>

      <Header title='システム設定'/>

      <Box component='div' sx={{ pt: 8, px: 3 }}>

        <Card sx={{ width: 300, backgroundColor: '#55ccff', my: 1 }}>
          <CardActionArea onClick={(e) => setAppShow(true)}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }} >
                <SettingsSuggestIcon sx={{ fontSize: 50}} color="primary" />
                <Box sx={{ml: 2}}>
                  <Typography variant='h5' component='div'>
                    Apprication
                  </Typography>
                  <Typography variant='subtitle2' component='div' textAlign='center'>〜機能制御項目〜</Typography>
                </Box>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card sx={{ width: 300, backgroundColor: '#55ccff', my: 1 }}>
          <CardActionArea onClick={(e) => setRoleShow(true)}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }} >
                <SettingsSuggestIcon sx={{ fontSize: 50}} color="primary" />
                <Box sx={{ml: 2}}>
                  <Typography variant='h5' component='div'>
                    Roles
                  </Typography>
                  <Typography variant='subtitle2' component='div' textAlign='center'>〜システム権限〜</Typography>
                </Box>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>

      </Box>

      <ApplicationPage show={appShow} close={handleCloseApp} />
      <RolesMainPage show={roleShow} close={handleCloseRole} />
    </Box>
  );
}
export default SetMainPage;
