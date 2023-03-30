import { useEffect, useState } from 'react';
import { getEmps } from '../../lib/api/organization';
import { cmnProps } from './cmnConst';
import { AlertType } from './cmnType';
import { isEmpty } from '../../lib/common/isEmpty';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export type Emp = {
  id: number | null;
  employeeNumber: string;
  name: string;
  divisionId: number | null;
  depName: string;
  divName: string;
}
type Props = {
  emp: Emp;
  setEmp: (emp: Emp) => void;
  setErr: (err: AlertType) => void;
  reload?: boolean;
  label: string;
}
type Option = {
  value: number | null;
  label: string;
}
const SelectEmployee = (props: Props) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [emps, setEmps] = useState<Emp[]>([]);

  // 初期処理
  useEffect(() => {
    handleGetEmps();
  },[props.reload]);

  // 社員情報取得
  const handleGetEmps = async () => {
    try {
      const res = await getEmps();
      const tmpOptions = res.data.emps.map(function(e: Emp) {
        let tmpOption: Option = {value: e.id, label: e.name};
        return tmpOption;
      });
      setOptions(tmpOptions);
      setEmps(res.data.emps)
    } catch (e) {
      props.setErr({severity: "error", message: "社員情報取得エラー"});
    }
  }

  // リストボックス選択時の処理
  const handleChange = (selectedOption: any) => {
    if (isEmpty(selectedOption.value)) {
      props.setEmp({id: null, employeeNumber: "", name: "", depName: "", divName: "", divisionId: null});
    } else {
      const selectedEmp = emps.filter(item => item.id === selectedOption.value)
      props.setEmp(selectedEmp[0]);  
    }
  }

  // リストボックス選択
  const setSelectOption = () => {
    const selectOption = options.find((v) => v.value === props.emp.id);
    return selectOption;
  }

  // リストボックス編集
  return (
    <Autocomplete
      id="emp_id"
      size="small" 
      sx={{ width:200 }}
      options={options}
      noOptionsText={<Typography sx={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}}>{"該当なし"}</Typography>}
      renderOption={(props, option) => (
        <Box component="li" style={{fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}} {...props}>
            {option.label}
        </Box>
      )}
      renderInput={(params) => (
        <TextField 
          {...params}
          label={props.label}
          variant="outlined"
          InputLabelProps={{ style: {fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily} }}  
          inputProps={{ ...params.inputProps, style: {fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}}}
        />
      )}
      value={setSelectOption() ?? null}
      onChange={(_event,newTerm) => {
        handleChange(newTerm);
      }}
    />
  );
}
export default SelectEmployee;
