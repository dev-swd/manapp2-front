import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../App';
import { cmnProps } from './common/cmnConst';
import { signOut } from '../lib/api/deviseAuth';
import PasswordsChangePage from './PasswordChangePage';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from "@mui/icons-material/Menu";
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import Cookies from 'js-cookie';

const Header = (props: {title: string}) => {
  const { setIsSignedIn, setCurrentUser } = useContext(GlobalContext);
  const navigate = useNavigate();
  // メニュー制御
  const [anchorEl, setAnchorEl] = useState<any>(null);
  // アカウントメニュー制御
  const [anchorElAc, setAnchorElAc] = useState<any>(null);
  // パスワード変更
  const [showPwd, setShowPwd] = useState<boolean>(false);

  // メニューボタンクリック時の処理
  const handleMenuIconClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(e.currentTarget);
  }

  // メニュー終了時の処理
  const handleMenuClose = () => {
    setAnchorEl(null);
  }

  // メニュークリック時の処理
  const handleMenuClick = (kbn: number) => {
    setAnchorEl(null);
    switch (kbn) {
      case 0:
        // トップページ
        navigate(`/`);
        break;
      case 1:
        // 組織管理
        navigate(`/org`);
        break;
      case 2:
        // 営業管理
        navigate(`/sales`);
        break;
      case 3:
        // プロジェクト管理
        navigate(`/project`);
        break;
      case 98:
        // システム設定
        navigate('/master');
        break;
      case 99:
        // システム設定
        navigate('/system');
        break;
      default:
        // トップページ
        navigate(`/`);
        break;
    }
  }
  
  // アカウントアイコンクリックの処理
  const handleAccountIconClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorElAc(e.currentTarget);
  }

  // アカウント終了時の処理
  const handleAccountClose = () => {
    setAnchorElAc(null);
  }

  // サインアウト時の処理
  const handleSignoutClick = () => {
    handleSignOut();
    setAnchorElAc(null);
  }

  // サインアウト処理
  const handleSignOut = async () => {
    try {
      const res = await signOut();
      if(res.data.success===true){
        // 各Cookieをクリア
        Cookies.remove("_access_token");
        Cookies.remove("_client");
        Cookies.remove("_uid");

        // サインイン情報クリア
        setIsSignedIn(false);
        setCurrentUser({id: null, name: "", email: ""});

        // サインイン画面に遷移
        navigate(`/signin`);
      } else {
        alert('サインアウトに失敗しました。');
        // サインイン画面に遷移
        navigate(`/signin`);
      }
    } catch (e) {
      alert('サインアウトに失敗しました。(abend)');
      // サインイン画面に遷移
      navigate(`/signin`);
    }
  }

  // パスワード変更メニュークリック時の処理
  const handleChangePwdClick = () => {
    setShowPwd(true);
    setAnchorElAc(null);
  }

  // パスワード変更画面終了
  const handleChangePwdClose = () => {
    setShowPwd(false);
  }

  // 画面編集
  return (
    <Box sx={{ flexGrow: 1 }}>
{/*      <AppBar position='static'> */}
      <AppBar position='fixed' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar variant="dense">
          <IconButton
            size="small"
            edge="start"
            color='inherit'
            aria-label="menu"
            onClick={handleMenuIconClick}
            >
            <MenuIcon fontSize='inherit' />
          </IconButton>
          <Menu
              id='top-menu'
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
            <MenuItem sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}} onClick={(e) => handleMenuClick(0)}>ホーム</MenuItem>
            <MenuItem sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}} onClick={(e) => handleMenuClick(99)}>システム設定</MenuItem>
            <MenuItem sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}} onClick={(e) => handleMenuClick(98)}>マスタメンテ</MenuItem>
            <MenuItem sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}} onClick={(e) => handleMenuClick(1)}>組織管理</MenuItem>
            <MenuItem sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}} onClick={(e) => handleMenuClick(2)}>営業管理</MenuItem>
            <MenuItem sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}} onClick={(e) => handleMenuClick(3)}>プロジェクト管理</MenuItem>
          </Menu>

          <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>{props.title}</Typography>

          <IconButton
            size="medium"
            edge="end"
            color='inherit'
            aria-label="account"
            onClick={handleAccountIconClick}
          >
            <AccountCircleIcon fontSize='inherit' />
          </IconButton>
          <Menu
            id='account-menu'
            anchorEl={anchorElAc}
            open={Boolean(anchorElAc)}
            onClose={handleAccountClose}
          >
            <MenuItem sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}} onClick={handleSignoutClick}>サインアウト</MenuItem>
            <MenuItem sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}} onClick={handleChangePwdClick}>パスワード変更</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <PasswordsChangePage show={showPwd} close={handleChangePwdClose} />
    </Box>
  );
}
export default Header;
