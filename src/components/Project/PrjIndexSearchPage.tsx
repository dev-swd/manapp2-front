import { useState, useEffect } from 'react';
import { cmnProps, projectStatus } from '../common/cmnConst';
import { AlertType } from '../common/cmnType';
import Loading from '../common/Loading';
import { searchProjectParams } from '../../lib/api/project';
import { getDivs } from '../../lib/api/organization';
import { getProjectList } from '../../lib/api/project';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from "@mui/material/MenuItem";
import TextField from '@mui/material/TextField';
import { LocalizationProvider, DatePicker } from  '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import ja from 'date-fns/locale/ja'
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// DatePickerのためのStyle
const styles = {
  paperprops: {
    'div[role=presentation]': {
      display: 'flex',
      '& .PrivatePickersFadeTransitionGroup-root:first-of-type': {
        order: 2
      },
      '& .PrivatePickersFadeTransitionGroup-root:nth-of-type(2)': {
        order: 1,
        '& div::after':{
          content: '"年"'
        }
      },
      '& .MuiButtonBase-root': {
        order: 3
      }
    }
  }
}

type Div = {
  id: number;
  depCode: string;
  depName: string;
  code: string;
  name: string;
}
type Emp = {
  id: number;
  number: number;
  name: string;
}
type Props = {
  search: searchProjectParams;
  setSearch: (search: searchProjectParams) => void;
  show: boolean;
  close: () => void;
}
const PrjIndexSearchPage = (props: Props) => {
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [approvalDate, setApprovalDate] = useState<number>(0);
  const [approvalDateFr, setApprovalDateFr] = useState<Date | null>(null);
  const [approvalDateTo, setApprovalDateTo] = useState<Date | null>(null);
  const [div, setDiv] = useState<{[key: number]: boolean}>({})
  const [pl, setPl] = useState<{[key: number]: boolean}>({});
  const [status, setStatus] = useState<{[key: string]: boolean}>({})
  const [makeDate, setMakeDate] = useState<number>(0);
  const [makeDateFr, setMakeDateFr] = useState<Date | null>(null);
  const [makeDateTo, setMakeDateTo] = useState<Date | null>(null);
  const [make, setMake] = useState<{[key: number]: boolean}>({})
  const [updateDate, setUpdateDate] = useState<number>(0);
  const [updateDateFr, setUpdateDateFr] = useState<Date | null>(null);
  const [updateDateTo, setUpdateDateTo] = useState<Date | null>(null);
  const [update, setUpdate] = useState<{[key: number]: boolean}>({})
  const [scheduledToBeCompleted, setScheduledToBeCompleted] = useState<number>(0);
  const [scheduledToBeCompletedFr, setScheduledToBeCompletedFr] = useState<Date | null>(null);
  const [scheduledToBeCompletedTo, setScheduledToBeCompletedTo] = useState<Date | null>(null);

  const [divs, setDivs] = useState<Div[]>([]);
  const [pls, setPls] = useState<Emp[]>([]);
  const [makes, setMakes] = useState<Emp[]>([]);
  const [updates, setUpdates] = useState<Emp[]>([]);

  // 初期処理
  useEffect(() => {
    if (props.show) {
      // 初期値設定
      setApprovalDate(props.search.approvalDate);
      setApprovalDateFr(props.search.approvalDateFr);
      setApprovalDateTo(props.search.approvalDateTo);
      let tmpStatus: {[key: string]: boolean} = {};
      projectStatus.array.forEach((s: string) => {
        if(props.search.status.length){
          tmpStatus[s] = props.search.status.indexOf(s)===-1 ? false : true;
        } else {
          tmpStatus[s] = true;
        }
      });
      setStatus(tmpStatus);
      setMakeDate(props.search.makeDate);
      setMakeDateFr(props.search.makeDateFr);
      setMakeDateTo(props.search.makeDateTo);
      setUpdateDate(props.search.updateDate);
      setUpdateDateFr(props.search.updateDateFr);
      setUpdateDateTo(props.search.updateDateTo);
      setScheduledToBeCompleted(props.search.scheduledToBeCompleted);
      setScheduledToBeCompletedFr(props.search.scheduledToBeCompletedFr);
      setScheduledToBeCompletedTo(props.search.scheduledToBeCompletedTo);
      // マスタデータ取得
      setIsLoading(true);
      handleGetMaster();
    }
  }, [props.show]);

  // マスター情報取得
  const handleGetMaster = async () => {
    try {
      const res1 = await getDivs();
      setDivs(res1.data.divs);
      let tmpDiv: {[key: number]: boolean} = {};
      res1.data.divs.forEach((d: Div) => {
        if(props.search.div.length){
          tmpDiv[d.id] = props.search.div.indexOf(d.id)===-1 ? false : true;
        } else {
          tmpDiv[d.id] = true;
        }
      });
      setDiv(tmpDiv);
      const res2 = await getProjectList();
      setPls(res2.data.pls);
      let tmpPl: {[key: number]: boolean} = {};
      res2.data.pls.forEach((p: Emp) => {
        if(props.search.pl.length){
          tmpPl[p.id] = props.search.pl.indexOf(p.id)===-1 ? false : true;
        } else {
          tmpPl[p.id] = true;
        }
      });
      setPl(tmpPl);
      setMakes(res2.data.makes);
      let tmpMake: {[key: number]: boolean} = {};
      res2.data.makes.forEach((m: Emp) => {
        if(props.search.make.length){
          tmpMake[m.id] = props.search.make.indexOf(m.id)===-1 ? false : true;
        } else {
          tmpMake[m.id] = true;
        }
      });
      setMake(tmpMake);
      setUpdates(res2.data.updates);
      let tmpUpdate: {[key: number]: boolean} = {};
      res2.data.updates.forEach((u: Emp) => {
        if(props.search.update.length){
          tmpUpdate[u.id] = props.search.update.indexOf(u.id)===-1 ? false : true;
        } else {
          tmpUpdate[u.id] = true;
        }
      });
      setUpdate(tmpUpdate);
    } catch (e) {
      setErr({severity: "error", message: "マスタ取得エラー"});
    } 
    setIsLoading(false);
  }

  // Searchボタン押下
  const handleOnClick = () => {
    const paramDateFr = (kbn: number, dt: Date | null) => {
      if (kbn===0) {
        return null;
      } else {
        return dt;
      }
    }
    const paramDateTo = (kbn: number, dt: Date | null) => {
      if (kbn===0 || kbn===1) {
        return null;
      } else {
        return dt;
      }
    }
    const paramArray = (v: {[key: number]: boolean}) => {
      let array: number[] = [];
      Object.keys(v).forEach((key: string) => {
        if(v[Number(key)]){
          array.push(Number(key));
        }
      });
      return array;
    }
    const paramArrayString = (v: {[key: string]: boolean}) => {
      let array: string[] = [];
      Object.keys(v).forEach((key: string) => {
        if(v[key]){
          array.push(key);
        }
      });
      return array;
    }
    const params: searchProjectParams = {
      approvalDate: approvalDate,
      approvalDateFr: paramDateFr(approvalDate, approvalDateFr),
      approvalDateTo: paramDateTo(approvalDate, approvalDateTo),
      div: paramArray(div),
      pl: paramArray(pl),
      status: paramArrayString(status),
      makeDate: makeDate,
      makeDateFr: paramDateFr(makeDate, makeDateFr),
      makeDateTo: paramDateTo(makeDate, makeDateTo),
      make: paramArray(make),
      updateDate: updateDate,
      updateDateFr: paramDateFr(updateDate, updateDateFr),
      updateDateTo: paramDateTo(updateDate, updateDateTo),
      update: paramArray(update),
      scheduledToBeCompleted: scheduledToBeCompleted,
      scheduledToBeCompletedFr: paramDateFr(scheduledToBeCompleted, scheduledToBeCompletedFr),
      scheduledToBeCompletedTo: paramDateTo(scheduledToBeCompleted, scheduledToBeCompletedTo),
    }
    props.setSearch(params);
    props.close();  
  }

  // 部門クリック時の処理
  const handleSetDiv = (id: number, checked: boolean) => {
    setDiv({ ...div,
      [id]: checked,
    });
  }

  // PLクリック時の処理
  const handleSetPl = (id: number, checked: boolean) => {
    setPl({ ...pl,
      [id]: checked,
    });
  }

  // 状態クリック時の処理
  const handleSetStatus = (id: string, checked: boolean) => {
    setStatus({ ...status,
      [id]: checked,
    });
  }

  // 作成者クリック時の処理
  const handleSetMake = (id: number, checked: boolean) => {
    setMake({ ...make,
      [id]: checked,
    });
  }

  // 変更者クリック時の処理
  const handleSetUpdate = (id: number, checked: boolean) => {
    setUpdate({ ...update,
      [id]: checked,
    });
  }

  // キャンセルボタン押下
  const handleCancel = () => {
    props.close();
    setErr({ severity: null, message: "" });
  }

  // 画面編集
  return (
    <Box component='div' sx={{ m: 3, backgroundColor: '#fff', height: 'auto', width: 'auto', pt: 6 }}>

      {(err.severity) &&
        <Stack sx={{width: '100%'}} spacing={1}>
          <Alert severity={err.severity}>{err.message}</Alert>
        </Stack>
      }

      <Box component='div' sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button color="primary" variant="outlined" startIcon={<SearchIcon />} onClick={(e) => handleOnClick()}>Search</Button>        
        <Button color="primary" endIcon={<KeyboardArrowUpIcon />} onClick={(e) => handleCancel()}>Close</Button>
      </Box>

      <Box component='div' sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
        <FormControl variant="outlined" size="small">
          <InputLabel id="select-approvaldate-label" sx={{verticalAlign: 'middle', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}>承認日</InputLabel>
          <Select
            labelId="select-approvaldate-label"
            id="select-approvaldate"
            label="承認日"
            value={approvalDate}
            onChange={(e) => setApprovalDate(Number(e.target.value))}
            sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}
          >
            <MenuItem key={`approvaldate-0`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={0}>指定なし</MenuItem>
            <MenuItem key={`approvaldate-1`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={1}>日付指定</MenuItem>
            <MenuItem key={`approvaldate-2`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={2}>期間指定</MenuItem>
          </Select>
        </FormControl>
        { approvalDate===0 ? (
          <></>
        ) : (
          <Box component='div' sx={{ ml: 3, display: 'flex', alignItems: 'center' }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
              <DatePicker
                label={approvalDate===1 ? "承認日" : "承認日（自）"}
                inputFormat="yyyy年MM月dd日"
                mask='____年__月__日'
                value={approvalDateFr}
                onChange={(value: Date | null) => setApprovalDateFr(value)}
                renderInput={(params: any) => <TextField 
                                          {...params}
                                          error={false} 
                                          variant="outlined" 
                                          size="small" 
                                          InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }} 
                                        />}
                PaperProps={{ sx: styles.paperprops }}
              />
            </LocalizationProvider>
            { approvalDate===2 ? (
              <>
                <Box component="span" sx={{alignSelf: 'center', textAlign: 'center', width: '30px', height: '30px' }}>〜</Box>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} >
                  <DatePicker
                    label="承認日（至）"
                    inputFormat="yyyy年MM月dd日"
                    mask='____年__月__日'
                    value={approvalDateTo}
                    onChange={(value: Date | null) => setApprovalDateTo(value)}
                    renderInput={(params: any) => <TextField 
                                              {...params}
                                              error={false} 
                                              variant="outlined" 
                                              size="small" 
                                              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }} 
                                            />}
                    PaperProps={{ sx: styles.paperprops }}
                  />
                </LocalizationProvider>
              </>
            ) : (
              <></>
            )}
          </Box>
        )}
      </Box>

      <Box component='div' sx={{ mt: 3, p: 1, border: 'solid 2px #c9c9c9', borderRadius: '4px'}} >
        <Typography variant='caption' component="div" color="primary.main" sx={{ fontWeight: 'bold', fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>部門</Typography>        
        <Box component='div' sx={{ mx: 3, width: 'auto' }} >
          {divs.map((d,i) =>
            <FormControlLabel 
              key={`div-${i}`}
              control={<Checkbox checked={div[d.id] || false} onChange={(e) => handleSetDiv(d.id, e.target.checked)}/>} 
              label={<Typography variant='caption' component="div" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{d.code === "dep" ? d.depName + "　　" : `${d.depName} ${d.name}　　`}</Typography>} 
            />
          )}
        </Box>
      </Box>

      <Box component='div' sx={{ mt: 3, p: 1, border: 'solid 2px #c9c9c9', borderRadius: '4px'}} >
        <Typography variant='caption' component="div" color="primary.main" sx={{ fontWeight: 'bold', fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>PL</Typography>        
        <Box component='div' sx={{ mx: 3, width: 'auto' }} >
          {pls.map((p,i) =>
            <FormControlLabel 
              key={`pl-${i}`}
              control={<Checkbox checked={pl[p.id] || false} onChange={(e) => handleSetPl(p.id, e.target.checked)}/>} 
              label={<Typography variant='caption' component="div" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{p.name + "　　"}</Typography>} 
            />
          )}
        </Box>
      </Box>

      <Box component='div' sx={{ mt: 3, p: 1, width: 'auto', border: 'solid 2px #c9c9c9', borderRadius: '4px' }}>
        <Typography variant='caption' component="div" color="primary.main" sx={{ fontWeight: 'bold', fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>状態</Typography>
        <Box component='div' sx={{ mx: 3, width: 'auto' }} >
          {projectStatus.array.map((s,i) =>
            <FormControlLabel 
              key={`status-${i}`}
              control={<Checkbox checked={status[s] || false} onChange={(e) => handleSetStatus(s, e.target.checked)}/>} 
              label={<Typography variant='caption' component="div" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{s + "　　"}</Typography>} 
            />
          )}
        </Box>
      </Box>

      <Box component='div' sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
        <FormControl variant="outlined" size="small">
          <InputLabel id="select-makedate-label" sx={{verticalAlign: 'middle', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}>作成日</InputLabel>
          <Select
            labelId="select-makedate-label"
            id="select-makedate"
            label="作成日"
            value={makeDate}
            onChange={(e) => setMakeDate(Number(e.target.value))}
            sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}
          >
            <MenuItem key={`makedate-0`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={0}>指定なし</MenuItem>
            <MenuItem key={`makedate-1`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={1}>日付指定</MenuItem>
            <MenuItem key={`makedate-2`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={2}>期間指定</MenuItem>
          </Select>
        </FormControl>
        { makeDate===0 ? (
          <></>
        ) : (
          <Box component='div' sx={{ ml: 3, display: 'flex', alignItems: 'center' }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
              <DatePicker
                label={makeDate===1 ? "作成日" : "作成日（自）"}
                inputFormat="yyyy年MM月dd日"
                mask='____年__月__日'
                value={makeDateFr}
                onChange={(value: Date | null) => setMakeDateFr(value)}
                renderInput={(params: any) => <TextField 
                                          {...params}
                                          error={false} 
                                          variant="outlined" 
                                          size="small" 
                                          InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }} 
                                        />}
                PaperProps={{ sx: styles.paperprops }}
              />
            </LocalizationProvider>
            { makeDate===2 ? (
              <>
                <Box component="span" sx={{alignSelf: 'center', textAlign: 'center', width: '30px', height: '30px' }}>〜</Box>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} >
                  <DatePicker
                    label="作成日（至）"
                    inputFormat="yyyy年MM月dd日"
                    mask='____年__月__日'
                    value={makeDateTo}
                    onChange={(value: Date | null) => setMakeDateTo(value)}
                    renderInput={(params: any) => <TextField 
                                              {...params}
                                              error={false} 
                                              variant="outlined" 
                                              size="small" 
                                              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }} 
                                            />}
                    PaperProps={{ sx: styles.paperprops }}
                  />
                </LocalizationProvider>
              </>
            ) : (
              <></>
            )}
          </Box>
        )}
      </Box>

      <Box component='div' sx={{ mt: 3, p: 1, border: 'solid 2px #c9c9c9', borderRadius: '4px'}} >
        <Typography variant='caption' component="div" color="primary.main" sx={{ fontWeight: 'bold', fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>作成者</Typography>        
        <Box component='div' sx={{ mx: 3, width: 'auto' }} >
          {makes.map((m,i) =>
            <FormControlLabel 
              key={`make-${i}`}
              control={<Checkbox checked={make[m.id] || false} onChange={(e) => handleSetMake(m.id, e.target.checked)}/>} 
              label={<Typography variant='caption' component="div" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{m.name}</Typography>} 
            />
          )}
        </Box>
      </Box>

      <Box component='div' sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
        <FormControl variant="outlined" size="small">
          <InputLabel id="select-updatedate-label" sx={{verticalAlign: 'middle', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}>変更日</InputLabel>
          <Select
            labelId="select-updatedate-label"
            id="select-updatedate"
            label="変更日"
            value={updateDate}
            onChange={(e) => setUpdateDate(Number(e.target.value))}
            sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}
          >
            <MenuItem key={`updatedate-0`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={0}>指定なし</MenuItem>
            <MenuItem key={`updatedate-1`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={1}>日付指定</MenuItem>
            <MenuItem key={`updatedate-2`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={2}>期間指定</MenuItem>
          </Select>
        </FormControl>
        { updateDate===0 ? (
          <></>
        ) : (
          <Box component='div' sx={{ ml: 3, display: 'flex', alignItems: 'center' }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
              <DatePicker
                label={updateDate===1 ? "変更日" : "変更日（自）"}
                inputFormat="yyyy年MM月dd日"
                mask='____年__月__日'
                value={updateDateFr}
                onChange={(value: Date | null) => setUpdateDateFr(value)}
                renderInput={(params: any) => <TextField 
                                          {...params}
                                          error={false} 
                                          variant="outlined" 
                                          size="small" 
                                          InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }} 
                                        />}
                PaperProps={{ sx: styles.paperprops }}
              />
            </LocalizationProvider>
            { updateDate===2 ? (
              <>
                <Box component="span" sx={{alignSelf: 'center', textAlign: 'center', width: '30px', height: '30px' }}>〜</Box>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} >
                  <DatePicker
                    label="変更日（至）"
                    inputFormat="yyyy年MM月dd日"
                    mask='____年__月__日'
                    value={updateDateTo}
                    onChange={(value: Date | null) => setUpdateDateTo(value)}
                    renderInput={(params: any) => <TextField 
                                              {...params}
                                              error={false} 
                                              variant="outlined" 
                                              size="small" 
                                              InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }} 
                                            />}
                    PaperProps={{ sx: styles.paperprops }}
                  />
                </LocalizationProvider>
              </>
            ) : (
              <></>
            )}
          </Box>
        )}
      </Box>

      <Box component='div' sx={{ mt: 3, p: 1, border: 'solid 2px #c9c9c9', borderRadius: '4px'}} >
        <Typography variant='caption' component="div" color="primary.main" sx={{ fontWeight: 'bold', fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>変更者</Typography>        
        <Box component='div' sx={{ mx: 3, width: 'auto' }} >
          {updates.map((u,i) =>
            <FormControlLabel 
              key={`update-${i}`}
              control={<Checkbox checked={make[u.id] || false} onChange={(e) => handleSetUpdate(u.id, e.target.checked)}/>} 
              label={<Typography variant='caption' component="div" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{u.name}</Typography>} 
            />
          )}
        </Box>
      </Box>

      <Loading isLoading={isLoading} />
    </Box>
  );
}
export default PrjIndexSearchPage;
