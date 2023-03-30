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
  fullscreen?: boolean;
}
const ConfirmDlg = (props: Props) => {

  return (
    <>
      { props.confirm.message ? (
        <Box sx={{ position: props.fullscreen ? 'fixed' : 'absolute', zIndex: 1201, top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
        </Box>
      ) : (
        <></>
      )}
    </>
  )

}
export default ConfirmDlg;