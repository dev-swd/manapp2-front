import './App.css';
import React, { useEffect, useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from './lib/api/deviseAuth';

import MainPage from './components/MainPage';
import SigninPage from './components/SigninPage';
import SignupPage from './components/SignupPage';
import OrgMainPage from './components/Organization/OrgMainPage';
import SetMainPage from './components/Settings/SetMain';
import MstMainPage from './components/Master/MstMainPage';
import SalesMainPage from './components/Sales/SalesMainPage';
import PrjIndexPage from './components/Project/PrjIndexPage';
import PrjTopPage from './components/Project/PrjTopPage';

// コンテキスト
type CurrentUser = {
  id: number | null;
  name: string;
  email: string;
}
type GlobalContextType = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isSignedIn: boolean | null;
  setIsSignedIn: (isSignedIn: boolean) => void;
  currentUser: CurrentUser;
  setCurrentUser: (currentUser: CurrentUser) => void;
}
export const GlobalContext = createContext<GlobalContextType>({
  loading: false,
  setLoading: (loading) => {},
  isSignedIn: false,
  setIsSignedIn: (isSignedIn) => {},
  currentUser: {id: null, name: "", email: ""},
  setCurrentUser: (currentUser) => {},
});

const App: React.FC = () => {
  // 認証情報
  const [loading, setLoading] = useState<boolean>(false);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser>({id: null, name: "", email: ""});

  // 認証済みのユーザがいるかチェック
  // 確認できた場合はそのユーザ情報を取得
  const handleGetCurrentUser = async () => {
    try {
      const res = await getCurrentUser();
      if(res?.data.is_login === true){
        setIsSignedIn(true);
        setCurrentUser(res.data.data);
      } else {
        // ログアウトになった場合の画面遷移
        setLoading(false);
        return <Navigate to="/signin" />
      }
    } catch (e) {
      // ログイン状態確認エラー時の画面遷移
      setLoading(false);
      return <Navigate to="/signin" />
    }
    setLoading(false);
  }

  // 初期処理（認証確認）
  useEffect(() => {
    setLoading(true);
    handleGetCurrentUser();
  }, [setCurrentUser]);

  // ユーザが認証済みかどうかでルーティングを決定
  // 未承認だった場合は「/signin」ページに促す
  const Private = ({ children }: { children: React.ReactElement }) => {
    if (!loading) {
      if (isSignedIn) {
        return children;
      } else {
        return <Navigate to="/signin" />
      }
    } else {
      return <></>;      
    }
  }

  return (
    <Router>
      <GlobalContext.Provider value={{loading, setLoading, isSignedIn, setIsSignedIn, currentUser, setCurrentUser }}>
        <Routes>
          <Route path='/' element={!loading && <Private><MainPage /></Private>} />
          <Route path='/signin' element={<SigninPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/org' element={<OrgMainPage />} />
          <Route path='/system' element={<SetMainPage />} />
          <Route path='/master' element={<MstMainPage />} />
          <Route path='/sales' element={<SalesMainPage />} />
          <Route path='/project' element={<PrjIndexPage />} />
          <Route path='/project/top' element={<PrjTopPage />} />
        </Routes>
      </GlobalContext.Provider>
    </Router>
  )
}
export default App;
