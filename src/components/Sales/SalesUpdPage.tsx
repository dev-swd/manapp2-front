import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from './../../App';
import { AlertType } from './../common/cmnType';
import { cmnProps } from './../common/cmnConst';
import ConfirmDlg, { ConfirmParam } from './../common/ConfirmDlg';
import Loading from './../common/Loading';
import { phoneOnly } from '../../lib/common/inputRegulation';
import { getProducts } from '../../lib/api/master';
import { getLeads } from '../../lib/api/prospect';
import { getDivs } from '../../lib/api/organization';
import { getProspect, updateProspect, prospectParam } from '../../lib/api/prospect';
import SelectEmployeeId from '../common/SelectEmployeeId';
import InputNumber from '../common/InputNumber';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from "@mui/material/MenuItem";
import { LocalizationProvider, DatePicker } from  '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import ja from 'date-fns/locale/ja'
import { isEmpty } from '../../lib/common/isEmpty';

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

// 初期日付
const initProspect = {
  name: "",
  divisionId: null,
  depName: "",
  divName: "",
  makeId: null,
  makeName: "",
  updateId: null,
  updateName: "",
  companyName: "",
  departmentName: "",
  personInChargeName: "",
  phone: "",
  fax: "",
  email: "",
  productId: null,
  productName: "",
  leadId: null,
  leadName: "",
  leadPeriodKbn: "",
  leadPeriod: null,
  content: "",
  periodFr: null,
  periodTo: null,
  mainPersonId: null,
  mainPersonName: "",
  orderAmount: null,
  salesChannels: "",
  salesPerson: "",
  createdAt: null,
  updatedAt: null,
}
type Prospect = {
  name: string;
  divisionId: number | null;
  depName: string;
  divName: string;
  makeId: number | null;
  makeName: string;
  updateId: number | null;
  updateName: string;
  companyName: string;
  departmentName: string;
  personInChargeName: string;
  phone: string;
  fax: string;
  email: string;
  productId: number | null;
  productName: string;
  leadId: number | null;
  leadName: string;
  leadPeriodKbn: string;
  leadPeriod: number | null;
  content: string;
  periodFr: Date | null;
  periodTo: Date | null;
  mainPersonId: number | null;
  mainPersonName: string;
  orderAmount: number | null;
  salesChannels: string;
  salesPerson: string;
  createdAt: Date | null;
  updatedAt: Date | null;
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
type Emp = {
  id: number | null;
  flg: boolean;
}
type Props = {
  show: boolean;
  prospectId: number | null;
  close: (refresh?: boolean) => void;
}
const SalesUpdPage = (props: Props) => {
  const { currentUser } = useContext(GlobalContext);
  const [name, setName] = useState<string>("");
  const [divisionId, setDivisionId] = useState<number | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [departmentName, setDepartmentName] = useState<string>("");
  const [personInChargeName, setPersonInChargeName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [fax, setFax] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [productId, setProductId] = useState<number | null>(null);
  const [leadId, setLeadId] = useState<number | null>(null);
  const [content, setContent] = useState<string>("");
  const [periodFr, setPeriodFr] = useState<Date | null>(null);
  const [periodTo, setPeriodTo] = useState<Date | null>(null);
  const [mainPersonId, setMainPersonId] = useState<Emp>({id: null, flg: false});
  const [orderAmount, setOrderAmount] = useState<number | null>(null);
  const [salesChannels, setSalesChannels] = useState<string>("");
  const [salesPerson, setSalesPerson] = useState<string>("");

  const [prospect, setProspect] = useState<Prospect>(initProspect);
  const [products, setProducts] = useState<Master[]>([]);
  const [leads, setLeads] = useState<Master[]>([]);
  const [divs, setDivs] = useState<Div[]>([]);
  const [err, setErr] = useState<AlertType>({ severity: null, message: "" });
  const [confirm, setConfirm] = useState<ConfirmParam>( { message: "", tag: "", width: null });
  const [isLoading1, setIsLoading1] = useState<boolean>(false);
  const [isLoading2, setIsLoading2] = useState<boolean>(false);

  // 初期処理
  useEffect(() => {
    if(props.show){
      setIsLoading1(true);
      setIsLoading2(true);
      handleGetProspect();
      handleGetListData();  
    }
  }, [props.show]);
  
  // マスター情報取得
  const handleGetListData = async () => {
    try {
      const res1 = await getDivs();
      setDivs(res1.data.divs);
      const res2 = await getProducts();
      setProducts(res2.data.products);
      const res3 = await getLeads();
      setLeads(res3.data.leads);
    } catch (e) {
      setErr({severity: "error", message: "マスタ取得エラー"});
    } 
    setIsLoading2(false);
  }

  // 案件情報取得
  const handleGetProspect = async () => {
    try {
      const res = await getProspect(props.prospectId);
      setProspect(res.data.prospect);
      setName(res.data.prospect.name);
      setDivisionId(res.data.prospect.divisionId);
      setCompanyName(res.data.prospect.companyName);
      setDepartmentName(res.data.prospect.departmentName);
      setPersonInChargeName(res.data.prospect.personInChargeName);
      setPhone(res.data.prospect.phone);
      setFax(res.data.prospect.fax);
      setEmail(res.data.prospect.email);
      setContent(res.data.prospect.content);
      setPeriodFr(res.data.prospect.periodFr);
      setPeriodTo(res.data.prospect.periodTo);
      setOrderAmount(res.data.prospect.orderAmount);
      setProductId(res.data.prospect.productId);
      setLeadId(res.data.prospect.leadId);
      setMainPersonId({id: res.data.prospect.mainPersonId, flg: true});
      setSalesChannels(res.data.prospect.salesChannels);
      setSalesPerson(res.data.prospect.salesPerson);
    } catch (e) {
      setErr({severity: "error", message: "案件情報取得エラー"});
    } 
    setIsLoading1(false);
  }

  // 登録ボタン押下時の処理
  const handleSubmit = () => {
    setConfirm({
      message: "案件情報を登録します。よろしいですか？",
      tag: "",
      width: 400
    });
  }

  // 確認ダイアログでOKの場合の処理
  const handleConfirmOK = (dummy: string) => {
    setConfirm({
      message: "",
      tag: "",
      width: null
    });
    setIsLoading1(true);
    saveSales();
  }

  // 登録処理
  const saveSales = async () => {
    const params: prospectParam = {
      id: null,
      name: name,
      divisionId: divisionId,
      makeId: currentUser.id,
      updateId: currentUser.id,
      companyName: companyName,
      departmentName: departmentName,
      personInChargeName: personInChargeName,
      phone: phone,
      fax: fax,
      email: email,
      productId: productId,
      leadId: leadId,
      content: content,
      periodFr: periodFr,
      periodTo: periodTo,
      mainPersonId: mainPersonId.id,
      orderAmount: orderAmount,
      salesChannels: salesChannels,
      salesPerson: salesPerson
    }
    try {
      const res = await updateProspect(props.prospectId, params);
      if (res.status === 200){
        props.close(true);
        setName("");
        setDivisionId(null);
        setCompanyName("");
        setDepartmentName("");
        setPersonInChargeName("");
        setPhone("");
        setFax("");
        setEmail("");
        setProductId(null);
        setLeadId(null);
        setContent("");
        setPeriodFr(null);
        setPeriodTo(null);
        setMainPersonId({id: null, flg: false});
        setOrderAmount(null);
        setSalesChannels("");
        setSalesPerson("");
        setProspect(initProspect);
        setErr({severity: null, message: ""});
      } else {
        setErr({severity: "error", message: "案件情報更新エラー(" + res.status + ")"});
      }
    } catch (e) {
      setErr({severity: "error", message: "案件情報更新エラー"});
    }
    setIsLoading1(false);
  }

  // 確認ダイアログでキャンセルの場合の処理
  const handleCofirmCancel = () => {
    setConfirm({
      message: "",
      tag: "",
      width: null
    });
  }

  // 閉じるボタン押下時の処理
  const handleClose = () => {
    props.close();
    setName("");
    setDivisionId(null);
    setCompanyName("");
    setDepartmentName("");
    setPersonInChargeName("");
    setPhone("");
    setFax("");
    setEmail("");
    setProductId(null);
    setLeadId(null);
    setContent("");
    setPeriodFr(null);
    setPeriodTo(null);
    setMainPersonId({id: null, flg: false});
    setOrderAmount(null);
    setSalesChannels("");
    setSalesPerson("");
    setProspect(initProspect);
    setErr({severity: null, message: ""});
  }

  // 主担当変更時の処理
  const handleChangeMainPersonId = (id: number | null) => {
    setMainPersonId({id: id, flg: true});
  }

  // 画面編集
  return (
    <>
      { props.show ? (
        <div className="overlay-dark">
          <Box component='div' sx={{ backgroundColor: '#fff', height: '90%', width: '60vw', minWidth: '400px', border: "0.5px solid #000", boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}>
            <AppBar position='static'>
              <Toolbar variant="dense">
                <Typography variant='caption' component="div" sx={{ flexGrow: 1, fontSize: cmnProps.topFontSize, fontFamily: cmnProps.fontFamily }}>案件情報登録</Typography>
                <IconButton
                  size="medium"
                  edge="end"
                  color='inherit'
                  aria-label="close"
                  onClick={(e) => handleClose()}
                >
                  <CloseIcon />
                </IconButton>
              </Toolbar>
            </AppBar>

            <Box component='div' sx={{overflow: 'auto', height: 'calc(100% - 50px)'}}>

              {(err.severity) &&
                <Stack sx={{width: '100%'}} spacing={1}>
                  <Alert severity={err.severity}>{err.message}</Alert>
                </Stack>
              }

              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<SaveAltIcon />}
                disabled={isEmpty(name) || isEmpty(productId) || isEmpty(leadId)}
                style={{marginTop:20, marginLeft:20, marginBottom:30}}
                onClick={(e) => handleSubmit()}
              >
                更新
              </Button>

              <Box component="div" sx={{ mx: 2 }}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  name="name"
                  label="案件名"
                  value={name}
                  variant="outlined"
                  size="small"
                  inputProps={{maxLength:30, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  fullWidth
                  id="company-name"
                  name="company-name"
                  label="顧客会社名"
                  value={companyName}
                  variant="outlined"
                  size="small"
                  sx={{mt: 2}}
                  inputProps={{maxLength:30, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                <TextField
                  fullWidth
                  id="department-name"
                  name="department-name"
                  label="顧客部署名"
                  value={departmentName}
                  variant="outlined"
                  size="small"
                  sx={{mt: 2}}
                  inputProps={{maxLength:30, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setDepartmentName(e.target.value)}
                />
                <TextField
                  fullWidth
                  id="person-in-charge-name"
                  name="person-in-charge-name"
                  label="顧客担当者名"
                  value={personInChargeName}
                  variant="outlined"
                  size="small"
                  sx={{mt: 2}}
                  inputProps={{maxLength:30, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setPersonInChargeName(e.target.value)}
                />
                <TextField
                  fullWidth
                  id="phone"
                  name="phone"
                  label="顧客電話番号"
                  value={phone}
                  variant="outlined"
                  type="tel"
                  size="small"
                  sx={{mt: 2}}
                  inputProps={{maxLength:15, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setPhone(phoneOnly(e.target.value))}
                />
                <TextField
                  fullWidth
                  id="fax"
                  name="fax"
                  label="顧客Fax"
                  value={fax}
                  variant="outlined"
                  type="tel"
                  size="small"
                  sx={{mt: 2}}
                  inputProps={{maxLength:15, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setFax(phoneOnly(e.target.value))}
                />
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="顧客Email"
                  value={email}
                  variant="outlined"
                  size="small"
                  type="email"
                  sx={{mt: 2}}
                  inputProps={{maxLength:255, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  id="content"
                  name="content"
                  label="概要"
                  value={content}
                  variant="outlined"
                  size="small"
                  sx={{mt: 2}}
                  inputProps={{maxLength:255, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setContent(e.target.value)}
                />
                <Box component="div" sx={{mt: 2, display: 'flex'}}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} >
                    <DatePicker
                      label="想定期間（自）"
                      inputFormat="yyyy年MM月dd日"
                      mask='____年__月__日'
                      value={periodFr}
                      onChange={(value: Date | null) => setPeriodFr(value)}
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
                  <Box component="span" sx={{alignSelf: 'center', textAlign: 'center', width: '30px', height: '30px' }}>〜</Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} >
                    <DatePicker
                      label="想定期間（至）"
                      inputFormat="yyyy年MM月dd日"
                      mask='____年__月__日'
                      value={periodTo}
                      onChange={(value: Date | null) => setPeriodTo(value)}
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
                </Box>
                <Box component="div" sx={{mt: 2}}>
                  <InputNumber 
                    value={orderAmount}
                    setValue={setOrderAmount}
                    label="想定受注金額"
                    maxLength={10}
                    width="230px"
                    id="order-amount"
                    name="order-amount"
                    startChar='¥'
                  />
                </Box>
                <Box component="div" sx={{mt: 2}}>
                  <FormControl variant="outlined" fullWidth size="small" required>
                    <InputLabel id="select-product-label" sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}>商材</InputLabel>
                    <Select
                      labelId="select-product-label"
                      id="select-product"
                      label="商材"
                      value={productId ?? ''}
                      onChange={(e) => setProductId(Number(e.target.value))}
                      sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}
                    >
                      { products.map((p,i) =>
                      <MenuItem key={`product-${i}`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={p.id}>{p.name}</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Box>
                <Box component="div" sx={{mt: 2}}>
                  <FormControl variant="outlined" fullWidth size="small" required>
                    <InputLabel id="select-lead-label" sx={{verticalAlign: 'middle', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}>リードレベル</InputLabel>
                    <Select
                      labelId="select-lead-label"
                      id="select-lead"
                      label="リードレベル"
                      value={leadId ?? ''}
                      onChange={(e) => setLeadId(Number(e.target.value))}
                      sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}
                    >
                      { leads.map((l,i) =>
                      <MenuItem key={`lead-${i}`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={l.id}>{l.name}</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Box>
                <Box component="div" sx={{mt: 2}}>
                  <FormControl variant="outlined" fullWidth size="small">
                    <InputLabel id="select-division-label" sx={{verticalAlign: 'middle', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}>担当部門</InputLabel>
                    <Select
                      labelId="select-division-label"
                      id="select-division"
                      label="担当部門"
                      value={divisionId ?? ''}
                      onChange={(e) => setDivisionId(Number(e.target.value))}
                      sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}}
                    >
                      { divs.map((d,i) =>
                      <MenuItem key={`division-${i}`} sx={{fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily}} value={d.id}>{d.code === "dep" ? d.depName : d.depName + " " + d.name}</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Box>
                <Box component="div" sx={{mt: 2}}>
                  <SelectEmployeeId 
                    empId={mainPersonId.id}
                    empGet={mainPersonId.flg}
                    setEmpId={handleChangeMainPersonId}
                    setErr={setErr}
                    label="主担当"
                    width={230}
                  />
                </Box>
                <TextField
                  fullWidth
                  id="salesChannels"
                  name="salesChannels"
                  label="商流"
                  value={salesChannels}
                  variant="outlined"
                  size="small"
                  sx={{mt: 2}}
                  inputProps={{maxLength:255, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setSalesChannels(e.target.value)}
                />
                <TextField
                  fullWidth
                  id="salesPerson"
                  name="salesPerson"
                  label="（商流）担当者"
                  value={salesPerson}
                  variant="outlined"
                  size="small"
                  sx={{my: 2}}
                  inputProps={{maxLength:255, style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
                  onChange={(e) => setSalesPerson(e.target.value)}
                />
              </Box>
            </Box>
          </Box>
          <ConfirmDlg confirm={confirm} handleOK={handleConfirmOK} handleCancel={handleCofirmCancel} />
          <Loading isLoading={isLoading1 || isLoading2} />
        </div>  
      ) : (
        <></>
      )}
    </>
  );
}
export default SalesUpdPage;
