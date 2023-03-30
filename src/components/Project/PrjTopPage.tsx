import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from './../../App';
import { useLocation, Link } from 'react-router-dom';
import { cmnProps, projectStatus } from '../common/cmnConst';
import { isEmpty } from '../../lib/common/isEmpty';
import PrjCreatePage from './PrjCreatePage';
import PrjAuditPage from './PrjAuditPage';
import PrjDetailPage from './PrjDetailPage';
import PrjUpdatePage from './PrjUpdatePage';
import RepCreatePage from './RepCreatePage';
import RepAuditPage from './RepAuditPage';
import RepDetailPage from './RepDetailPage';

import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from "@mui/icons-material/Menu";
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import ArticleIcon from '@mui/icons-material/Article';
import FactCheckIcon from '@mui/icons-material/FactCheck';

const drawerWidth = 200;
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `0`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: `+${drawerWidth}px`,
  }),
}));
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  //...theme.mixins.toolbar,
  toolbar: theme.mixins.toolbar,
  height: '48px',
//  justifyContent: 'flex-end',
  justifyContent: 'flex-start',
}));


const PrjTopPage: React.FC = () => {
  const location = useLocation();
  const params = location.state;
  const [menu, setMenu] = useState<number>(-1);
  const [showMenu, setShowMenu] = useState<boolean>(true);

  // 初期処理
  useEffect(() => {
    if (!isEmpty(params.menu)) {
      setMenu(Number(params.menu));
    }
  }, [params])

  // プロジェクト状態編集
  const setStatusColor = () => {
    switch (params.status) {
      case projectStatus.planNotSubmitted:
        return "error";
      case projectStatus.planSendBack:
        return "warning";
      case projectStatus.reportSendBack:
        return "warning";
      case projectStatus.planAuditing:
        return "secondary";
      case projectStatus.reportAuditing:
        return "secondary";
      case projectStatus.projectCompleted:
        return "success";
      default:
        // PJ推進中
        return "primary";
    }
  }

  // 計画書作成非活性制御
  const setDisabled0 = () => {
    switch (params.status) {
      case projectStatus.planNotSubmitted:
      case projectStatus.planSendBack:
        return false;
      default:
        return true;
    }
  }

  // 計画書監査非活性制御
  const setDisabled1 = () => {
    switch (params.status) {
      case projectStatus.planAuditing:
        return false;
      default:
        return true;
    }
  }

  // 計画書参照非活性制御
  const setDisabled2 = () => {
    switch (params.status) {
      case projectStatus.planNotSubmitted:
      case projectStatus.planAuditing:
      case projectStatus.planSendBack:
        return true;
      default:
        return false;
    }
  }

  // 計画書変更非活性制御
  const setDisabled3 = () => {
    switch (params.status) {
      case projectStatus.projectInProgress:
      case projectStatus.reportSendBack:
        return false;
      default:
        return true;
    }
  }

  // 完了報告書作成非活性制御
  const setDisabled4 = () => {
    switch (params.status) {
      case projectStatus.projectInProgress:
      case projectStatus.reportSendBack:
        return false;
      default:
        return true;
    }
  }

  // 完了報告書監査非活性制御
  const setDisabled5 = () => {
    switch (params.status) {
      case projectStatus.reportAuditing:
        return false;
      default:
        return true;
    }
  }

  // 完了報告書参照非活性制御
  const setDisabled6 = () => {
    switch (params.status) {
      case projectStatus.projectCompleted:
        return false;
      default:
        return true;
    }
  }

  // 画面編集
  return (
    <Box component='div' sx={{ height: '100vh', backgroundColor: '#fff'}}>

      <AppBar position='fixed' open={showMenu} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar variant="dense">
          <IconButton
            size="small"
            edge="start"
            color='inherit'
            aria-label="menu"
            onClick={() => setShowMenu(true)}
            sx={{ mr: 2, ...(showMenu && { display: 'none' }) }}
          >
            <MenuIcon fontSize='inherit' />
          </IconButton>
          <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>プロジェクト</Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        anchor={'left'}
        open={showMenu}
        variant="persistent"
      >
        <DrawerHeader>
          <Button
            color="primary"
            startIcon={<KeyboardArrowLeftIcon />}
            onClick={() => setShowMenu(false)}
          >
            Close
          </Button>
        </DrawerHeader>
        <Divider />
        <Button component={Link} to="/project" sx={{ mt: 3, fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>プロジェクト一覧へ</Button>
        <Chip color={setStatusColor()} label={params.status} sx={{ mt: 1, mx: 1, mb: 4, fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }} />
        <Divider />
        <List>
          <ListItemButton onClick={(e) => setMenu(0)} disabled={setDisabled0()}>
            <ListItemIcon>
              <EditIcon color='primary' />
            </ListItemIcon>
            <ListItemText 
              primary='計画書作成' 
              primaryTypographyProps = {{ color: 'primary', fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }} 
            />
          </ListItemButton>
          <ListItemButton onClick={(e) => setMenu(1)} disabled={setDisabled1()}>
            <ListItemIcon>
              <FactCheckIcon color='primary' />
            </ListItemIcon>
            <ListItemText 
              primary='計画書監査' 
              primaryTypographyProps = {{ color: 'primary', fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }} 
            />
          </ListItemButton>
          <ListItemButton onClick={(e) => setMenu(2)} disabled={setDisabled2()}>
            <ListItemIcon>
              <ArticleIcon color='primary' />
            </ListItemIcon>
            <ListItemText 
              primary='計画書参照' 
              primaryTypographyProps = {{ color: 'primary', fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }} 
            />
          </ListItemButton>
          <ListItemButton onClick={(e) => setMenu(3)} disabled={setDisabled3()}>
            <ListItemIcon>
              <FactCheckIcon color='primary' />
            </ListItemIcon>
            <ListItemText 
              primary='計画書変更' 
              primaryTypographyProps = {{ color: 'primary', fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }} 
            />
          </ListItemButton>
          <ListItemButton onClick={(e) => setMenu(4)} disabled={setDisabled4()}>
            <ListItemIcon>
              <FactCheckIcon color='primary' />
            </ListItemIcon>
            <ListItemText 
              primary='完了報告書作成' 
              primaryTypographyProps = {{ color: 'primary', fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }} 
            />
          </ListItemButton>
          <ListItemButton onClick={(e) => setMenu(5)} disabled={setDisabled5()}>
            <ListItemIcon>
              <FactCheckIcon color='primary' />
            </ListItemIcon>
            <ListItemText 
              primary='完了報告書監査' 
              primaryTypographyProps = {{ color: 'primary', fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }} 
            />
          </ListItemButton>
          <ListItemButton onClick={(e) => setMenu(6)} disabled={setDisabled6()}>
            <ListItemIcon>
              <FactCheckIcon color='primary' />
            </ListItemIcon>
            <ListItemText 
              primary='完了報告書参照' 
              primaryTypographyProps = {{ color: 'primary', fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }} 
            />
          </ListItemButton>
        </List>
      </Drawer>
      <Main open={showMenu}>
        <DrawerHeader />
        <Box sx={{ width: 1350, height: '85vh' }}>
          { menu===0 && <PrjCreatePage projectId={params.id} />}
          { menu===1 && <PrjAuditPage projectId={params.id} />}
          { menu===2 && <PrjDetailPage projectId={params.id} />}
          { menu===3 && <PrjUpdatePage projectId={params.id} />}
          { menu===4 && <RepCreatePage projectId={params.id} />}
          { menu===5 && <RepAuditPage projectId={params.id} />}
          { menu===6 && <RepDetailPage projectId={params.id} />}
        </Box>
      </Main>
    </Box>
  );
}
export default PrjTopPage;
