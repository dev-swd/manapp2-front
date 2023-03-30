import React, { useState } from 'react';
import Header from '../Header';
import ProductPage from './ProductPage';
import LeadPage from './LeadPage';
import SalesActionPage from './SalesActionPage';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

const MstMainPage: React.FC = () => {
  const [product, setProduct] = useState<boolean>(false);
  const [lead, setLead] = useState<boolean>(false);
  const [salesAction, setSalesAction] = useState<boolean>(false);

  // Product画面終了
  const handleCloseProduct = () => {
    setProduct(false);
  }

  // Lead画面終了
  const handleCloseLead = () => {
    setLead(false);
  }

  // SalesAction画面終了
  const handleCloseSalesAction = () => {
    setSalesAction(false);
  }

  return (
    <Box component='div' sx={{ height: '100vh', backgroundColor: '#fff'}}>

      <Header title='マスタメンテ'/>

      <Box component='div' sx={{ pt: 8, px: 3 }}>

        <Card sx={{ width: 300, backgroundColor: '#55ccff', my: 1 }}>
          <CardActionArea onClick={(e) => setProduct(true)}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }} >
                <SettingsSuggestIcon sx={{ fontSize: 50}} color="primary" />
                <Box sx={{ml: 2}}>
                  <Typography variant='h5' component='div'>
                    Product
                  </Typography>
                  <Typography variant='subtitle2' component='div' textAlign='center'>〜商材マスタ〜</Typography>
                </Box>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card sx={{ width: 300, backgroundColor: '#55ccff', my: 1 }}>
          <CardActionArea onClick={(e) => setLead(true)}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }} >
                <SettingsSuggestIcon sx={{ fontSize: 50}} color="primary" />
                <Box sx={{ml: 2}}>
                  <Typography variant='h5' component='div'>
                    Lead Level
                  </Typography>
                  <Typography variant='subtitle2' component='div' textAlign='center'>〜リードレベルマスタ〜</Typography>
                </Box>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card sx={{ width: 300, backgroundColor: '#55ccff', my: 1 }}>
          <CardActionArea onClick={(e) => setSalesAction(true)}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }} >
                <SettingsSuggestIcon sx={{ fontSize: 50}} color="primary" />
                <Box sx={{ml: 2}}>
                  <Typography variant='h5' component='div'>
                    Sales Action
                  </Typography>
                  <Typography variant='subtitle2' component='div' textAlign='center'>〜営業アクションマスタ〜</Typography>
                </Box>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>

      </Box>

      <ProductPage show={product} close={handleCloseProduct} />
      <LeadPage show={lead} close={handleCloseLead} />
      <SalesActionPage show={salesAction} close={handleCloseSalesAction} />
    </Box>
  );
}
export default MstMainPage;
