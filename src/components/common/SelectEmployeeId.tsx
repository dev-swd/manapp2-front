import { useEffect, useState } from 'react';
import { getEmps } from '../../lib/api/organization';
import { cmnProps } from './cmnConst';
import { AlertType } from './cmnType';
import { isEmpty } from '../../lib/common/isEmpty';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

type Emp = {
  id: number | null;
  employeeNumber: string;
  name: string;
  divisionId: number | null;
  depName: string;
  divName: string;
}
type Props = {
  empId: number | null;
  empGet: boolean;
  setEmpId: (empId: number | null) => void;
  setErr: (err: AlertType) => void;
  label: string;
  width?: number;
  required?: boolean;
  error?: boolean;
}
type Option = {
  value: number | null;
  label: string;
}
const SelectEmployeeId = (props: Props) => {
  const [options, setOptions] = useState<Option[]>([]);

  // 初期処理
  useEffect(() => {
    handleGetEmps();
  },[]);

  // 社員情報取得
  const handleGetEmps = async () => {
    try {
      const res = await getEmps();
      const tmpOptions = res.data.emps.map(function(e: Emp) {
        let tmpOption: Option = {value: e.id, label: e.name};
        return tmpOption;
      });
      setOptions(tmpOptions);
    } catch (e) {
      props.setErr({severity: "error", message: "社員情報取得エラー"});
    }
  }

  // リストボックス選択時の処理
  const handleChange = (selectedOption: Option | null) => {
    props.setEmpId(selectedOption?.value || null)
  }

  // リストボックス選択
  const setSelectOption = (empId: number | null) => {
    const selectOption = options.find((v) => v.value === empId);
    return selectOption;
  }

  // リストボックス編集
  // Autocomplateのクセを解消
  // optionsが空の状態で、value初期値の照合が動いても、初期選択にならない（その証拠にリスト選択操作では選択値と画面表示が連動している）
  // optionsもvalue初期値もAPI(非同期処理)での値取得なので、順序性は保証されない（今のところ間違いなくvalue初期値が先）
  // 解消方法として、optionsとvalue初期値が両方揃うまでAutocompleteを生成しないように条件付けした。
  return (
    <>
      {(options.length && props.empGet) &&
      <Autocomplete
        id="emp_id"
        size="small" 
        sx={{ width: props.width || 200 }}
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
            required={props.required ?? false}
            error={props.error ?? false}
            label={props.label}
            variant="outlined"
            InputLabelProps={{ style: {fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily} }}  
            inputProps={{ ...params.inputProps, style: {fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily}}}
          />
        )}
        value={setSelectOption(props.empId) ?? null}
        onChange={(_event,newTerm) => {
          handleChange(newTerm);
        }}
      />
      }
    </>
  );
}
export default SelectEmployeeId;
