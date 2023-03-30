import { useEffect, useState } from 'react';
import { cmnProps } from './../common/cmnConst';
import { integerOnly } from '../../lib/common/inputRegulation';
import { isEmpty, isEmptyOrZero } from '../../lib/common/isEmpty';
import TextField from '@mui/material/TextField';

type Props = {
  value: number | null;
  setValue: (value: number) => void;
  label: string;
  maxLength: number;
  fullWidth?: boolean;
  width?: string;
  id?: string;
  name?: string;
  startChar?: string;
  endChar?: string;
}
const InputNumber = (props: Props) => {
  const [localValue, setLocalValue] = useState<string>("");
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const handleFocus = () => setIsFocus(true);
  const handleBlur = () => setIsFocus(false);
  const handleChange = (v: string) => {
    props.setValue(Number(v));
    setLocalValue(v);
  }
  const isValid: boolean = /^[-]?(\d+)[.]?(\d+)?$/.test(localValue);
  const displayValue = (() => {
    if(isFocus || !isValid) {
      return localValue;
    } else if(isValid) {
      if (!isEmpty(props.startChar)){
        if (!isEmpty(props.endChar)){
          return props.startChar + (+localValue).toLocaleString() + props.endChar;
        } else {
          return props.startChar + (+localValue).toLocaleString();
        }
      } else {
        if (!isEmpty(props.endChar)){
          return (+localValue).toLocaleString() + props.endChar;
        } else {
          return (+localValue).toLocaleString();
        }
      }
    }
    return "";
  })();

  useEffect(() => {
    setLocalValue(String(isEmpty(props.value) ? "" : props.value));
  },[props.value]);

  return (
    <>
      {props.fullWidth ? (
        <TextField
          fullWidth
          id={isEmpty(props.id) ? "" : props.id}
          name={isEmpty(props.name) ? "" : props.name}
          label={props.label}
          value={displayValue}
          variant="outlined"
          size="small"
          inputProps={{maxLength:props.maxLength, style: {textAlign: 'right', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
          InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
          onChange={(e) => handleChange(integerOnly(e.target.value))}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      ) : (
        <TextField
          id={isEmpty(props.id) ? "" : props.id}
          name={isEmpty(props.name) ? "" : props.name}
          label={props.label}
          value={displayValue}
          variant="outlined"
          size="small"
          sx={{width: isEmpty(props.width) ? "200px" : props.width}}
          inputProps={{maxLength:props.maxLength, style: {textAlign: 'right', fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
          InputLabelProps={{ style: {fontSize:cmnProps.fontSize, fontFamily:cmnProps.fontFamily} }}
          onChange={(e) => handleChange(integerOnly(e.target.value))}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      )}
    </>
  );
}
export default InputNumber;
