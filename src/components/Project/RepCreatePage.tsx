import { useState } from 'react';
import RepEditPage from './Report/RepEditPage';
import AuditShowPage from './Audit/AuditShowPage';

import { styled, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import IconButton from '@mui/material/IconButton';
import ListAltIcon from '@mui/icons-material/ListAlt';

const drawerMaxWidth = '70vw';
const drawerMinWidth = '25vw';

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerMaxWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
//  width: `calc(${theme.spacing(7)} + 1px)`,
  width: drawerMinWidth,
  [theme.breakpoints.up('sm')]: {
//    width: `calc(${theme.spacing(8)} + 1px)`,
    width: drawerMinWidth,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerMaxWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

type Props = {
  projectId: number | null;
}
const PrjCreatePage = (props: Props) => {
  const [showDrawer, setShowDrawer] = useState<boolean>(true);
  const [drawerSwitch, setDrawerSwitch] = useState<boolean>(false);

  // 画面編集
  return (
    <Box component='div' sx={{ width: '100%', height: '100%' }}>
      
      { showDrawer ? (
        <Drawer
        open={drawerSwitch}
        variant="permanent"
        anchor='right'
        >
          <Box sx={{ width: 'inherit', pt: 8, px: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <IconButton 
                aria-label="wide-narrow" 
                color="primary" 
                onClick={() => setDrawerSwitch(!drawerSwitch)}
              >
                {drawerSwitch ? (
                  <CloseFullscreenIcon />
                ) : (
                  <OpenInFullIcon />
                )}
              </IconButton>
              <Button
                color="primary"
                onClick={() => setShowDrawer(false)}
              >
                Close
              </Button>
            </Box>
            <AuditShowPage projectId={props.projectId} kinds="report" />
          </Box>
        </Drawer>
      ) : (
        <IconButton 
          aria-label="show" 
          color="primary" 
          size="large" 
          onClick={() => setShowDrawer(true)}
          sx={{ position: 'fixed', top: 55, right: 0 }}
          >
            <ListAltIcon sx={{ fontSize : 40 }} />
          </IconButton>
      )}

      <Box sx={{ width: 'inherit', height: '90%'}}>
        <RepEditPage projectId={props.projectId} />
      </Box>
    </Box>
  );
}
export default PrjCreatePage;