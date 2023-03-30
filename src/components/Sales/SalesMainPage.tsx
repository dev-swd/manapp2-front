import React, { useEffect, useState } from 'react';
import { cmnProps } from '../common/cmnConst';
import { AlertType } from '../common/cmnType';
import Header from '../Header';
import Loading from '../common/Loading';
import { getProspects, searchProspectParams } from '../../lib/api/prospect';
import { formatDateZero, formatDateTimeZero } from '../../lib/common/dateCom';
import SalesMainSettingsPage from './SalesMainSettingsPage';
import SalesNewPage from './SalesNewPage';
import SalesDetailPage from './SalesDetailPage';
import SalesMainSearchPage from './SalesMainSearchPage';
import SalesGraphPage from './SalesGraphPage';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import FilterListIcon from '@mui/icons-material/FilterList';
import AssessmentIcon from '@mui/icons-material/Assessment';

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
//  name: {align: "left", width: 300, visible: true, title: "案件名"},
  divName: {align: "left", width: 300, visible: true, title: "担当部門"},
  companyName: {align: "left", width: 200, visible: true, title: "会社名"},
  productName: {align: "left", width: 150, visible: true, title: "商材"},
  leadName: {align: "left", width: 150, visible: true, title: "リードレベル"},
  period: {align: "left", width: 300, visible: true, title: "想定期間"},
  orderAmount: {align: "right", width: 150, visible: true, title: "想定売上"},
  mainPersonName: {align: "left", width: 150, visible: true, title: "担当者"},
  salesChannels: {align: "left", width: 150, visible: false, title: "商流"},
  salesPerson: {align: "left", width: 150, visible: false, title: "営業担当"},
  closingDate: {align: "left", width: 150, visible: false, title: "契約確定日"},
  createdAt: {align: "left", width: 230, visible: false, title: "登録日"},
  updatedAt: {align: "left", width: 230, visible: false, title: "最終更新日"},
}

const initSearch = {
  confirmed: true,
  createdAt: 0,
  createdAtFr: null,
  createdAtTo: null,
  lead: [],
  closingDate: 0,
  closingDateFr: null,
  closingDateTo: null,
  unconfirmed: true,
  unCreatedAt: 0,
  unCreatedAtFr: null,
  unCreatedAtTo: null,
  unLead: [],
  div: [],
  product: []
}

// ディレイ用
const wait = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type Order = 'asc' | 'desc';
type ColProp = {
  align: string;
  width: number;
  visible: boolean;
  title: string;
}
export type ColProps = {
//  name: ColProp;
  divName: ColProp;
  companyName: ColProp;
  productName: ColProp;
  leadName: ColProp;
  period: ColProp;
  orderAmount: ColProp;
  mainPersonName: ColProp;
  salesChannels: ColProp;
  salesPerson: ColProp;
  closingDate: ColProp;
  createdAt: ColProp;
  updatedAt: ColProp;
}
type Prospect = {
  id: number;
  name: string;
  depName: string;
  divCode: string;
  divName: string;
  companyName: string;
  productName: string;
  leadName: string;
  leadPeriodKbn: string;
  leadPeriod: number;
  periodFr: Date | null;
  periodTo: Date | null;
  mainPersonName: string;
  orderAmount: number | null;
  salesChannels: string;
  salesPerson: string;
  closingDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
type Data = {
  id: number;
  name: string;
  divName: string;
  companyName: string;
  productName: string;
  leadName: string;
  leadPeriodKbn: string;
  leadPeriod: number;
  period: string;
  mainPersonName: string;
  orderAmount: string;
  salesChannels: string;
  salesPerson: string;
  closingDate: string;
  createdAt: string;
  createdAtOrg: Date;
  updatedAt: string;
}
const SalesMainPage: React.FC = () => {
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [colProps, setColProps] = useState<ColProps>(initColProps);
  const columns = Object.keys(colProps) as (keyof ColProps)[];
  const [data, setData] = useState<Data[]>([]);
  const [dispData, setDispData] = useState<Data[]>([]);
  const [sortKey, setSortKey] = useState<string>("");
  const [order, setOrder] = useState<Order>('asc');
  const [leadColor, setLeadColor] = useState<string>("rgba(255,0,255,0.2)");
  const [search, setSearch] = useState<searchProspectParams>(initSearch);

  const [showGraph, setShowGraph] = useState<boolean>(false);
  const [showNew, setShowNew] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  // 初期処理
  useEffect(() => {
    setIsLoading(true);
    handleGetPropects();
  }, [setData, search]);

  // null置換処理
  const emptyToBlank = (v: any) => {
    if(isEmpty(v)){
      return "";
    } else {
      return v;
    }
  }

  // 事業部情報取得
  const handleGetPropects = async () => {
    // ちらつき防止のため意図的にディレイを入れる（0.5秒）
    await wait(500);
    try {
      const res = await getProspects(search);
      const tmpDatas = res.data.prospects.map((p: Prospect) => {
        let tmpData: Data = {
          id: p.id,
          name: p.name,
          divName: p.divCode==="dep" ? emptyToBlank(p.depName) : emptyToBlank(p.depName)  + " " + emptyToBlank(p.divName),
          companyName: p.companyName,
          productName: p.productName,
          leadName: p.leadName,
          leadPeriodKbn: p.leadPeriodKbn,
          leadPeriod: p.leadPeriod,
          period: formatDateZero(p.periodFr, dateDispForm) + "〜" + formatDateZero(p.periodTo, dateDispForm),
          mainPersonName: p.mainPersonName,
          orderAmount: p.orderAmount?.toLocaleString() || "",
          salesChannels: p.salesChannels,
          salesPerson: p.salesPerson,
          closingDate: formatDateZero(p.closingDate, dateDispForm),
          createdAt: formatDateTimeZero(p.createdAt, datetimeDispForm),
          createdAtOrg: p.createdAt,
          updatedAt: formatDateTimeZero(p.updatedAt, datetimeDispForm),
        }
        return tmpData;
      });
      setData(tmpDatas);
      setDispData(tmpDatas);
    } catch (e) {
      setErr({severity: "error", message: "見込み報取得エラー"});
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
      handleGetPropects();
    }
  }

  // 新規作成画面終了
  const closeNew = (refresh?: boolean) => {
    setShowNew(false);
    if(refresh){
      setIsLoading(true);
      handleGetPropects();
    }
  }

  // 詳細画面表示
  const handleShowDetail = (id: number, closingDate: string) => {
    setDetailId(id);
    setIsClosing(!isEmpty(closingDate));
    setShowDetail(true);
  }

  // 詳細画面終了
  const closeDetail = (refresh?: boolean) => {
    setDetailId(null);
    setIsClosing(false);
    setShowDetail(false);
    if(refresh){
      setIsLoading(true);
      handleGetPropects();
    }
  }

  // Graph画面終了処理
  const closeGraph = () => {
    setShowGraph(false);
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

  // リード期限チェック（チェックエラー＝false）
  const checkLeadPeriod = (kbn: string, period: number, createAt: Date) => {
    
    // 期限指定なしの場合は判定対象外
    if (!(kbn==="y" || kbn==="m" || kbn==="d")) return "";

    var dt = new Date();
    switch (kbn){
      case "y":
        // 本日からn年前の日付を取得
        dt.setFullYear(dt.getFullYear() - period);
        break;
      case "m":
        // 本日からnヶ月前の日付を取得
        dt.setMonth(dt.getMonth() - period);
        break;
      case "d":
        // 本日からn日前の日付を取得
        dt.setDate(dt.getDate() - period);
        break;
      default:
        return "";
    }
    if (createAt < dt) {
      // n年経過している場合
      return leadColor;
    } else {
      return "";
    }

  }

  // 画面編集
  return (
    <Box component='div' sx={{ height: '100vh', backgroundColor: '#fff' }}>

      <Header title='見込み案件情報'/>

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
          <SalesMainSearchPage search={search} setSearch={setSearch} show={showSearch} close={closeSearch} />
        </Drawer>

        <Drawer
          anchor={'right'}
          open={showSettings}
          variant="persistent"
        >
          <SalesMainSettingsPage show={showSettings} colProps={colProps} setColProps={setColProps} leadColor={leadColor} setLeadColor={setLeadColor} close={closeSettings} />
        </Drawer>

        <Box component='div' sx={{ my: 3, mx: 2, width: 'auto', display: 'flex', justifyContent: 'space-between' }}>
          <Box component='div'>
            <Button 
              variant="contained"
              color="primary"
              size="small"
              startIcon={<AddBusinessIcon />}
              onClick={(e) => setShowNew(true)}
            >
              案件情報追加
            </Button>

            <Button 
              variant="contained"
              color="primary"
              size="small"
              startIcon={<AssessmentIcon />}
              sx={{ ml: 2 }}
              onClick={(e) => setShowGraph(true)}
            >
              グラフ表示
            </Button>
          </Box>
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
  
        <TableContainer component={Paper} sx={{ my: 2, mx: 2, width: 'auto' }}>
          <Table sx={{ width: (calcTableWidth() + 350) }} stickyHeader aria-label="prospects table">
            <TableHead>
              <TableRow>
                <CustomCell sx={{ width: 50 }}>No.</CustomCell>
                <CustomCell 
                  align='left'
                  sx={{ width: 300 }}
                  sortDirection={sortKey==="name" ? order : false} 
                >
                  <TableSortLabel 
                    active={sortKey === "name"}
                    direction={order}
                    onClick={() => handleClickSortColumn("name")}
                  >
                    案件名
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
                  <CustomCell align='right' sx={{ backgroundColor: checkLeadPeriod(d.leadPeriodKbn, d.leadPeriod, d.createdAtOrg) }}>
                    {r+1}
                  </CustomCell>
                  <CustomCell sx={{ backgroundColor: checkLeadPeriod(d.leadPeriodKbn, d.leadPeriod, d.createdAtOrg) }}>
                    <button 
                      className='link-style-btn'
                      type='button'
                      onClick={() => handleShowDetail(d.id, d.closingDate)}
                    >
                      {d.name}
                    </button>
                  </CustomCell>
                  {columns.map((column, c) => (
                    colProps[column]["visible"] &&
                    <CustomCell 
                      key={`cel-${r}-${c}`}
                      align={colProps[column]["align"]==="left" ? "left" : "right"} 
                      sx={{ backgroundColor: checkLeadPeriod(d.leadPeriodKbn, d.leadPeriod, d.createdAtOrg) }} 
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
        <SalesNewPage show={showNew} close={closeNew} />
        <SalesDetailPage show={showDetail} prospectId={detailId} isClosing={isClosing} setIsClosing={setIsClosing} close={closeDetail} />
        <SalesGraphPage show={showGraph} close={closeGraph} />
      </Box>
    </Box>
  );
}
export default SalesMainPage;
