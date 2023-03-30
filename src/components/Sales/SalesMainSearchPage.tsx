import { useState, useEffect } from 'react';
import { cmnProps } from '../common/cmnConst';
import { AlertType } from '../common/cmnType';
import Loading from '../common/Loading';
import { searchProspectParams } from '../../lib/api/prospect';
import { getProducts } from '../../lib/api/master';
import { getLeads } from '../../lib/api/prospect';
import { getDivs } from '../../lib/api/organization';

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
type Master = {
  id: number;
  name: string;
}
type Props = {
  search: searchProspectParams;
  setSearch: (search: searchProspectParams) => void;
  show: boolean;
  close: () => void;
}
const SalesMainSearchPage = (props: Props) => {
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [createdAt, setCreatedAt] = useState<number>(0);
  const [createdAtFr, setCreatedAtFr] = useState<Date | null>(null);
  const [createdAtTo, setCreatedAtTo] = useState<Date | null>(null);
  const [lead, setLead] = useState<{[key: number]: boolean}>({});
  const [closingDate, setClosingDate] = useState<number>(0);
  const [closingDateFr, setClosingDateFr] = useState<Date | null>(null);
  const [closingDateTo, setClosingDateTo] = useState<Date | null>(null);
  const [unconfirmed, setUnconfirmed] = useState<boolean>(false);
  const [unCreatedAt, setUnCreatedAt] = useState<number>(0);
  const [unCreatedAtFr, setUnCreatedAtFr] = useState<Date | null>(null);
  const [unCreatedAtTo, setUnCreatedAtTo] = useState<Date | null>(null);
  const [unLead, setUnLead] = useState<{[key: number]: boolean}>({});
  const [div, setDiv] = useState<{[key: number]: boolean}>({});
  const [product, setProduct] = useState<{[key: number]: boolean}>({});

  const [products, setProducts] = useState<Master[]>([]);
  const [leads, setLeads] = useState<Master[]>([]);
  const [divs, setDivs] = useState<Div[]>([]);

  // 初期処理
  useEffect(() => {
    if (props.show) {
      // 初期値設定
      setConfirmed(props.search.confirmed);
      setCreatedAt(props.search.createdAt);
      setCreatedAtFr(props.search.createdAtFr);
      setCreatedAtTo(props.search.createdAtTo);
      setClosingDate(props.search.closingDate);
      setClosingDateFr(props.search.closingDateFr);
      setClosingDateTo(props.search.closingDateTo);
      setUnconfirmed(props.search.unconfirmed);
      setUnCreatedAt(props.search.unCreatedAt);
      setUnCreatedAtFr(props.search.unCreatedAtFr);
      setUnCreatedAtTo(props.search.unCreatedAtTo);
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
      const res2 = await getProducts();
      setProducts(res2.data.products);
      let tmpProduct: {[key: number]: boolean} = {};
      res2.data.products.forEach((p: Master) => {
        if(props.search.product.length){
          tmpProduct[p.id] = props.search.product.indexOf(p.id)===-1 ? false : true;
        } else {
          tmpProduct[p.id] = true;
        }
      });
      setProduct(tmpProduct);
      const res3 = await getLeads();
      setLeads(res3.data.leads);
      let tmpUnLead: {[key: number]: boolean} = {};
      res3.data.leads.forEach((l: Master) => {
        if(props.search.unLead.length){
          tmpUnLead[l.id] = props.search.unLead.indexOf(l.id)===-1 ? false : true;
        } else {
          tmpUnLead[l.id] = true;
        }
      });
      let tmpLead: {[key: number]: boolean} = {};
      res3.data.leads.forEach((l: Master) => {
        if(props.search.lead.length){
          tmpLead[l.id] = props.search.lead.indexOf(l.id)===-1 ? false : true;
        } else {
          tmpLead[l.id] = true;
        }
      });
      setUnLead(tmpUnLead);
      setLead(tmpLead);
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
    const params: searchProspectParams = {
      confirmed: confirmed,
      createdAt: createdAt,
      createdAtFr: paramDateFr(createdAt, createdAtFr),
      createdAtTo: paramDateTo(createdAt, createdAtTo),
      lead: paramArray(lead),
      closingDate: closingDate,
      closingDateFr: paramDateFr(closingDate, closingDateFr),
      closingDateTo: paramDateTo(closingDate, closingDateTo),
      unconfirmed: unconfirmed,
      unCreatedAt: unCreatedAt,
      unCreatedAtFr: paramDateFr(unCreatedAt, unCreatedAtFr),
      unCreatedAtTo: paramDateTo(unCreatedAt, unCreatedAtTo),
      unLead: paramArray(unLead),
      div: paramArray(div),
      product: paramArray(product)
    }
    props.setSearch(params);
    props.close();
  }

  // 未確定リードクリック時の処理
  const handleSetUnLead = (id: number, checked: boolean) => {
    setUnLead({ ...unLead,
      [id]: checked,
    });
  }

  // 確定リードレベルクリック時の処理
  const handleSetLead = (id: number, checked: boolean) => {
    setLead({ ...lead,
      [id]: checked,
    });
  }

  // 部門クリック時の処理
  const handleSetDiv = (id: number, checked: boolean) => {
    setDiv({ ...div,
      [id]: checked,
    });
  }

  // 商材クリック時の処理
  const handleSetProduct = (id: number, checked: boolean) => {
    setProduct({ ...product,
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

      <Box sx={{ mt: 3, display: 'flex' }}>
        <FormControlLabel 
          control={<Checkbox checked={unconfirmed} onChange={(e) => setUnconfirmed(e.target.checked)} />} 
          label={<Typography variant='caption' component="div" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>受注未確定</Typography>} 
        />
        <FormControlLabel 
          control={<Checkbox checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />} 
          label={<Typography variant='caption' component="div" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>受注確定</Typography>} 
        />
      </Box>

      { unconfirmed && 
      <Box component='div' sx={{ mt: 2, p: 1, border: 'solid 2px #c9c9c9', borderRadius: '4px'}} >
        <Typography variant='caption' component="div" color="primary.main" sx={{ fontWeight: 'bold', fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>受注未確定分に対する条件</Typography>
        
        <Box component='div' sx={{ mt: 3, mx: 3, display: 'flex', alignItems: 'center' }}>
          <FormControl variant="outlined" size="small">
            <InputLabel id="select-uncreatedat-label" sx={{verticalAlign: 'middle', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}>登録日</InputLabel>
            <Select
              labelId="select-uncreatedat-label"
              id="select-uncreatedat"
              label="登録日"
              value={unCreatedAt}
              onChange={(e) => setUnCreatedAt(Number(e.target.value))}
              sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}
            >
              <MenuItem key={`uncreatedat-0`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={0}>指定なし</MenuItem>
              <MenuItem key={`uncreatedat-1`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={1}>日付指定</MenuItem>
              <MenuItem key={`uncreatedat-2`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={2}>期間指定</MenuItem>
            </Select>
          </FormControl>
          { unCreatedAt===0 ? (
            <></>
          ) : (
            <Box component='div' sx={{ ml: 3, display: 'flex', alignItems: 'center' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
                <DatePicker
                  label={unCreatedAt===1 ? "登録日" : "登録日（自）"}
                  inputFormat="yyyy年MM月dd日"
                  mask='____年__月__日'
                  value={unCreatedAtFr}
                  onChange={(value: Date | null) => setUnCreatedAtFr(value)}
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
              { unCreatedAt===2 ? (
                <>
                  <Box component="span" sx={{alignSelf: 'center', textAlign: 'center', width: '30px', height: '30px' }}>〜</Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} >
                    <DatePicker
                      label="登録日（至）"
                      inputFormat="yyyy年MM月dd日"
                      mask='____年__月__日'
                      value={unCreatedAtTo}
                      onChange={(value: Date | null) => setUnCreatedAtTo(value)}
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

        <Box component='div' sx={{ mx: 3, my: 2, p: 1, width: 'auto', border: 'solid 2px #c9c9c9', borderRadius: '4px' }}>
          <Typography variant='caption' component="div" color="primary.main" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>リードレベル</Typography>
          <Box component='div' sx={{ mx: 2, width: 'auto' }} >
            {leads.map((l,i) =>
              <FormControlLabel 
                key={`unlead-${i}`}
                control={<Checkbox checked={unLead[l.id] || false} onChange={(e) => handleSetUnLead(l.id, e.target.checked)}/>} 
                label={<Typography variant='caption' component="div" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{l.name + "　　"}</Typography>} 
              />
            )}
          </Box>
        </Box>

      </Box>
      }

      { confirmed &&
      <Box component='div' sx={{ mt: 2, p: 1, border: 'solid 2px #c9c9c9', borderRadius: '4px'}} >
        <Typography variant='caption' component="div" color="primary.main" sx={{ fontWeight: 'bold', fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>受注確定分に対する条件</Typography>        

        <Box component='div' sx={{ mt: 3, mx: 3, display: 'flex', alignItems: 'center'}}>
          <FormControl variant="outlined" size="small">
            <InputLabel id="select-createdat-label" sx={{verticalAlign: 'middle', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}>登録日</InputLabel>
            <Select
              labelId="select-createdat-label"
              id="select-createdat"
              label="登録日"
              value={createdAt}
              onChange={(e) => setCreatedAt(Number(e.target.value))}
              sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}
            >
              <MenuItem key={`createdat-0`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={0}>指定なし</MenuItem>
              <MenuItem key={`createdat-1`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={1}>日付指定</MenuItem>
              <MenuItem key={`createdat-2`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={2}>期間指定</MenuItem>
            </Select>
          </FormControl>
          { createdAt===0 ? (
            <></>
          ) : (
            <Box component='div' sx={{ ml: 3, display: 'flex', alignItems: 'center' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} >
                <DatePicker
                  label={createdAt===1 ? "登録日" : "登録日（自）"}
                  inputFormat="yyyy年MM月dd日"
                  mask='____年__月__日'
                  value={createdAtFr}
                  onChange={(value: Date | null) => setCreatedAtFr(value)}
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
              { createdAt===2 ? (
                <>
                  <Box component="span" sx={{alignSelf: 'center', textAlign: 'center', width: '30px', height: '30px' }}>〜</Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} >
                    <DatePicker
                      label="登録日（至）"
                      inputFormat="yyyy年MM月dd日"
                      mask='____年__月__日'
                      value={createdAtTo}
                      onChange={(value: Date | null) => setCreatedAtTo(value)}
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

        <Box component='div' sx={{ mx: 3, mt: 2, p: 1, width: 'auto', border: 'solid 2px #c9c9c9', borderRadius: '4px' }}>
          <Typography variant='caption' component="div" color="primary.main" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>リードレベル</Typography>
          <Box component='div' sx={{ mx: 2, width: 'auto' }} >
            {leads.map((l,i) =>
              <FormControlLabel 
                key={`lead-${i}`}
                control={<Checkbox checked={lead[l.id] || false} onChange={(e) => handleSetLead(l.id, e.target.checked)}/>} 
                label={<Typography variant='caption' component="div" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{l.name + "　　"}</Typography>} 
              />
            )}
          </Box>
        </Box>

        <Box component='div' sx={{ mt: 3, mx: 3, mb: 2, display: 'flex', alignItems: 'center'}}>
          <FormControl variant="outlined" size="small">
            <InputLabel id="select-closingdate-label" sx={{verticalAlign: 'middle', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}>受注確定日</InputLabel>
            <Select
              labelId="select-closingdate-label"
              id="select-closingdate"
              label="受注確定日"
              value={closingDate}
              onChange={(e) => setClosingDate(Number(e.target.value))}
              sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}
            >
              <MenuItem key={`closingdate-0`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={0}>指定なし</MenuItem>
              <MenuItem key={`closingdate-1`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={1}>日付指定</MenuItem>
              <MenuItem key={`closingdate-2`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={2}>期間指定</MenuItem>
            </Select>
          </FormControl>
          { closingDate===0 ? (
            <></>
          ) : (
            <Box component='div' sx={{ ml: 3, display: 'flex', alignItems: 'center' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} >
                <DatePicker
                  label={closingDate===1 ? "受注確定日" : "受注確定日（自）"}
                  inputFormat="yyyy年MM月dd日"
                  mask='____年__月__日'
                  value={closingDateFr}
                  onChange={(value: Date | null) => setClosingDateFr(value)}
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
              { closingDate===2 ? (
                <>
                  <Box component="span" sx={{alignSelf: 'center', textAlign: 'center', width: '30px', height: '30px' }}>〜</Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} >
                    <DatePicker
                      label="受注確定日（至）"
                      inputFormat="yyyy年MM月dd日"
                      mask='____年__月__日'
                      value={closingDateTo}
                      onChange={(value: Date | null) => setClosingDateTo(value)}
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

      </Box>
      }

      <Box component='div' sx={{ mt: 2, p: 1, border: 'solid 2px #c9c9c9', borderRadius: '4px'}} >
        <Typography variant='caption' component="div" color="primary.main" sx={{ fontWeight: 'bold', fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>部門</Typography>        
        <Box component='div' sx={{ mx: 3, width: 'auto' }} >
          {divs.map((d,i) =>
            <FormControlLabel 
              key={`div-${i}`}
              control={<Checkbox checked={div[d.id] || false} onChange={(e) => handleSetDiv(d.id, e.target.checked)}/>} 
              label={<Typography variant='caption' component="div" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{d.code === "dep" ? d.depName : `${d.depName} ${d.name}　　`}</Typography>} 
            />
          )}
        </Box>
      </Box>

      <Box component='div' sx={{ my: 2, p: 1, border: 'solid 2px #c9c9c9', borderRadius: '4px'}} >
        <Typography variant='caption' component="div" color="primary.main" sx={{ fontWeight: 'bold', fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>商材</Typography>        
        <Box component='div' sx={{ mx: 3, width: 'auto' }} >
          {products.map((p,i) =>
            <FormControlLabel 
              key={`product-${i}`}
              control={<Checkbox checked={product[p.id] || false} onChange={(e) => handleSetProduct(p.id, e.target.checked)}/>} 
              label={<Typography variant='caption' component="div" sx={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{p.name + "　　"}</Typography>} 
            />
          )}
        </Box>
      </Box>
      <Loading isLoading={isLoading} />
    </Box>
  );
}
export default SalesMainSearchPage;
