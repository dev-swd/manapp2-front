import { cmnProps } from './cmnConst';
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { isEmpty } from '../../lib/common/isEmpty';

export type ConfirmParam = {
  message: string;
  tag: any;
  width: number | null;
}
type Props = {
  confirm: ConfirmParam;
  handleOK: (tag: any) => void;
  handleCancel: () => void;
}
const ConfirmDlg = (props: Props) => {

  return (
    <>
      { props.confirm.message ? (
        <div className="overlay">
          <Box sx={{ width: '100%', maxWidth: isEmpty(props.confirm.width) ? 400 : props.confirm.width, bgcolor: 'background.paper', borderRadius: '10px', border: '5px solid #1e90ee' }}>
            <Box sx={{ mt: 3, ml: 3, mr: 3, mb:3 }}>
              <Box>
                <Typography fontSize={cmnProps.fontSize} fontFamily={cmnProps.fontFamily}>{props.confirm.message}</Typography>
              </Box>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={(e) => props.handleOK(props.confirm.tag)}>OK</Button>
                <Button variant="contained" sx={{ ml: 2 }} onClick={(e) => props.handleCancel()}>Cancel</Button>            
              </Box>
            </Box>
          </Box> 
        </div>
      ) : (
        <></>
      )}
    </>
  )

}
export default ConfirmDlg;