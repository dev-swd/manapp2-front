import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cmnProps } from '../common/cmnConst';
import { AlertType } from '../common/cmnType';
import Header from '../Header';
import Loading from '../common/Loading';
import { getProjects, searchProjectParams, getProjectsAll } from '../../lib/api/project';
import { formatDateZero, formatDateTimeZero } from '../../lib/common/dateCom';
import PrjNewPage from './PrjNewPage';
import PrjIndexSettingsPage from './PrjIndexSettingsPage';
import PrjIndexSearchPage from './PrjIndexSearchPage';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import FilterListIcon from '@mui/icons-material/FilterList';

import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TableSortLabel from '@mui/material/TableSortLabel';
import { isEmpty } from '../../lib/common/isEmpty';

import Drawer from '@mui/material/Drawer';

const CustomCell = styled(TableCell)({
  fontSize: cmnProps.fontSize,
  fontFamily: cmnProps.fontFamily,
  zIndex: 1
});

const dateDispForm = "YYYY年MM月DD日";
const datetimeDispForm = "YYYY年MM月DD日 HH:MI:SS";
export const initColProps = {
  name: {align: "left", width: 300, visible: true, title: "プロジェクト名"},
  approvalDate: {align: "left", width: 230, visible: true, title: "承認日"},
  divName: {align: "left", width: 300, visible: true, title: "担当部門"},
  plName: {align: "left", width: 150, visible: true, title: "PL"},
  status: {align: "left", width: 150, visible: true, title: "状態"},
  makeDate: {align: "left", width: 150, visible: true, title: "作成日"},
  makeName: {align: "left", width: 300, visible: true, title: "作成者"},
  updateDate: {align: "left", width: 150, visible: true, title: "変更日"},
  updateName: {align: "left", width: 300, visible: true, title: "変更者"},
  companyName: {align: "left", width: 300, visible: true, title: "取引先会社名"},
  departmentName: {align: "left", width: 300, visible: true, title: "取引先部署名"},
  personinchargeName: {align: "left", width: 300, visible: true, title: "取引先担当者"},
  developmentPeriod: {align: "left", width: 300, visible: true, title: "開発期間"},
  scheduledToBeCompleted: {align: "left", width: 150, visible: true, title: "完了予定日"},
  createdAt: {align: "left", width: 230, visible: true, title: "登録日"},
  updatedAt: {align: "left", width: 230, visible: true, title: "最終更新日"},
}

const initSearch = {
  approvalDate: 0,
  approvalDateFr: null,
  approvalDateTo: null,
  div: [],
  pl: [],
  status: [],
  makeDate: 0,
  makeDateFr: null,
  makeDateTo: null,
  make: [],
  updateDate: 0,
  updateDateFr: null,
  updateDateTo: null,
  update: [],
  scheduledToBeCompleted: 0,
  scheduledToBeCompletedFr: null,
  scheduledToBeCompletedTo: null,
}

type Order = 'asc' | 'desc';
type ColProp = {
  align: string;
  width: number;
  visible: boolean;
  title: string;
}
export type ColProps = {
//  number: ColProp;
  name: ColProp;
  approvalDate: ColProp;
  divName: ColProp;
  plName: ColProp;
  status: ColProp;
  makeDate: ColProp;
  makeName: ColProp;
  updateDate: ColProp;
  updateName: ColProp;
  companyName: ColProp;
  departmentName: ColProp;
  personinchargeName: ColProp;
  developmentPeriod: ColProp;
  scheduledToBeCompleted: ColProp;
  createdAt: ColProp;
  updatedAt: ColProp;
}
type Project = {
  id: number;
  number: string;
  name: string;
  approvalDate: Date | null;
  depName: string;
  divCode: string;
  divName: string;
  plName: string;
  status: string;
  makeDate: Date | null;
  makeName: string;
  updateDate: Date | null;
  updateName: string;
  companyName: string;
  departmentName: string;
  personinchargeName: string;
  developmentPeriodFr: Date | null;
  developmentPeriodTo: Date | null;
  scheduledToBeCompleted: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
type Data = {
  id: number;
  number: string;
  name: string;
  approvalDate: string;
  divName: string;
  plName: string;
  status: string;
  makeDate: string;
  makeName: string;
  updateDate: string;
  updateName: string;
  companyName: string;
  departmentName: string;
  personinchargeName: string;
  developmentPeriod: string;
  scheduledToBeCompleted: string;
  createdAt: string;
  updatedAt: string;
}
const PrjIndexPage: React.FC = () => {
  const navigate = useNavigate();
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [colProps, setColProps] = useState<ColProps>(initColProps);
  const columns = Object.keys(colProps) as (keyof ColProps)[];
  const [data, setData] = useState<Data[]>([]);
  const [dispData, setDispData] = useState<Data[]>([]);
  const [sortKey, setSortKey] = useState<string>("");
  const [order, setOrder] = useState<Order>('asc');
  const [search, setSearch] = useState<searchProjectParams>(initSearch);

  const [showNew, setShowNew] = useState<boolean>(false);

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  // 初期処理
  useEffect(() => {
    setIsLoading(true);
    handleGetProjects();
  }, [setData, search]);

  // null置換処理
  const emptyToBlank = (v: any) => {
    if(isEmpty(v)){
      return "";
    } else {
      return v;
    }
  }

  // プロジェクト情報取得
  const handleGetProjects = async () => {
    try {
//      const res = await getProjectsAll();
        const res = await getProjects(search);
        const tmpDatas = res.data.projects.map((p: Project) => {
        let tmpData: Data = {
          id: p.id,
          number: p.number,
          name: p.name,
          approvalDate: formatDateZero(p.approvalDate, dateDispForm),
          divName: p.divCode==="dep" ? emptyToBlank(p.depName) : emptyToBlank(p.depName)  + " " + emptyToBlank(p.divName),
          plName: p.plName,
          status: p.status,
          makeDate: formatDateZero(p.makeDate, dateDispForm),
          makeName: p.makeName,
          updateDate: formatDateZero(p.updateDate, dateDispForm),
          updateName: p.updateName,
          companyName: p.companyName,
          departmentName: p.departmentName,
          personinchargeName: p.personinchargeName,
          developmentPeriod: formatDateZero(p.developmentPeriodFr, dateDispForm) + "〜" + formatDateZero(p.developmentPeriodTo, dateDispForm),
          scheduledToBeCompleted: formatDateZero(p.scheduledToBeCompleted, dateDispForm),
          createdAt: formatDateTimeZero(p.createdAt, datetimeDispForm),
          updatedAt: formatDateTimeZero(p.updatedAt, datetimeDispForm),
        }
        return tmpData;
      });
      setData(tmpDatas);
      setDispData(tmpDatas);
    } catch (e) {
      setErr({severity: "error", message: "プロジェクト情報取得エラー"});
    } 
    setIsLoading(false);
  }

  // 検索条件画面終了
  const closeSearch = () => {
    setShowSearch(false);
  }

  // 設定画面終了
  const closeSettings = (refresh?: boolean) => {
    setShowSettings(false);
    if(refresh){
      setIsLoading(true);
      handleGetProjects();
    }
  }

  // 新規作成画面終了
  const closeNew = (refresh?: boolean) => {
    setShowNew(false);
    if(refresh){
      setIsLoading(true);
      handleGetProjects();
    }
  }

  // 一覧ヘッダクリック時の処理
  const handleClickSortColumn = (column: string) => {
    // 未選択の列をクリックした場合は、その列で降順に設定
    // 選択中の列をクリックした場合は昇順／降順の切り替え
    const isDesc = column===sortKey && order==="desc";
    const nextOrder = isDesc ? "asc" : "desc";
    const sortRule = { asc: [1, -1], desc: [-1, 1] };
    const sortedData = data.slice().sort((a,b) => {
      if (a[column as keyof Data] > b[column as keyof Data]) {
        return sortRule[nextOrder][0];
      } else if (a[column as keyof Data] < b[column as keyof Data]) {
        return sortRule[nextOrder][1];
      } else {
        return 0;
      }
    });
    setDispData(sortedData);
    setOrder(nextOrder);
    setSortKey(column);
  }

  // Table幅算出
  const calcTableWidth = () => {
    let width: number = 0;
    columns.forEach((column) => {
      if(colProps[column]["visible"]) {
        width += colProps[column]["width"];
      }
    });
    return width;
  }

  // 画面編集
  return (
    <Box component='div' sx={{ height: '100vh', backgroundColor: '#fff'}}>

      <Header title='プロジェクト一覧'/>

      <Box component='div' sx={{ pt: '48px' }}>
        {(err.severity) &&
          <Stack sx={{width: '100%'}} spacing={1}>
            <Alert severity={err.severity}>{err.message}</Alert>
          </Stack>
        }

        <Drawer
          anchor={'top'}
          open={showSearch}
          variant="persistent"
        >
          <PrjIndexSearchPage search={search} setSearch={setSearch} show={showSearch} close={closeSearch} />
        </Drawer>

        <Drawer
          anchor={'right'}
          open={showSettings}
          variant="persistent"
        >
          <PrjIndexSettingsPage show={showSettings} colProps={colProps} setColProps={setColProps} close={closeSettings} />
        </Drawer>

        <Box component='div' sx={{ my: 3, mx: 2, width: 'auto', display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="contained"
            color="primary"
            size="small"
            startIcon={<AddBusinessIcon />}
            onClick={(e) => setShowNew(true)}
          >
            新規登録
          </Button>
          <Box component='div'>
            <Button 
              color="primary"
              startIcon={<FilterListIcon />}
              onClick={(e) => setShowSearch(true)}
            >
              検索条件変更
            </Button>

            <Button 
              color="primary"
              startIcon={<DisplaySettingsIcon />}
              sx={{ ml: 2 }}
              onClick={(e) => setShowSettings(true)}
            >
              画面設定
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper} sx={{ my: 2, mx: 2, width: 'auto', maxHeight: '80vh' }}>
          <Table sx={{ width: (calcTableWidth() + 230) }} stickyHeader aria-label="prospects table">
            <TableHead>
              <TableRow>
                <CustomCell sx={{ width: 50 }}>No.</CustomCell>
                <CustomCell 
                  align='center'
                  sx={{ width: 180 }}
                  sortDirection={sortKey==="number" ? order : false} 
                >
                  <TableSortLabel 
                    active={sortKey === "number"}
                    direction={order}
                    onClick={() => handleClickSortColumn("number")}
                  >
                    プロジェクトNo.
                  </TableSortLabel>
                </CustomCell>
                {columns.map((column, i) => (
                  colProps[column]["visible"] &&
                  <CustomCell 
                    key={`header-${i}`}
                    align={colProps[column]["align"]==="left" ? "left" : "right"} 
                    sx={{width: colProps[column]["width"]}}
                    sortDirection={sortKey===column ? order : false} 
                  >
                    <TableSortLabel 
                      active={sortKey === column}
                      direction={order}
                      onClick={() => handleClickSortColumn(column)}
                    >
                      {colProps[column]["title"]}
                    </TableSortLabel>
                  </CustomCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              { dispData.map((d,r) => (
                <TableRow
                  key={`row-${r}`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <CustomCell align='right'>
                    {r+1}
                  </CustomCell>
                  <CustomCell>
                    <button 
                      className='link-style-btn'
                      type='button'
                      onClick={() => navigate(`/project/top`,{state: {id: d.id, status: d.status}})}
                    >
                      {d.number}
                    </button>
                  </CustomCell>
                  {columns.map((column, c) => (
                    colProps[column]["visible"] &&
                    <CustomCell 
                      key={`cel-${r}-${c}`}
                      align={colProps[column]["align"]==="left" ? "left" : "right"} 
                    >
                      {d[column as keyof Data]}
                    </CustomCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Loading isLoading={isLoading} />
        <PrjNewPage show={showNew} close={closeNew} />
      </Box>
    </Box>
  )
}
export default PrjIndexPage;
