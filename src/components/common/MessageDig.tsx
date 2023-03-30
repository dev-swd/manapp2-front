import { cmnProps } from './cmnConst';
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { isEmpty } from '../../lib/common/isEmpty';

export type MessageParams = {
  message: string;
  width: number | null;
}
type Props = {
  params: MessageParams;
  handleOK: () => void;
}
const MessageDig = (props: Props) => {
  return (
    <>
      { props.params.message ? (
        <div className="overlay">
          <Box sx={{ width: '100%', maxWidth: isEmpty(props.params.width) ? 400 : props.params.width, bgcolor: 'background.paper', borderRadius: '10px', border: '5px solid #1e90ee' }}>
            <Box sx={{ mt: 3, ml: 3, mr: 3, mb:3 }}>
              <Box>
                <Typography fontSize={cmnProps.fontSize} fontFamily={cmnProps.fontFamily}>{props.params.message}</Typography>
              </Box>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={(e) => props.handleOK()}>OK</Button>
              </Box>
            </Box>
          </Box>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
export default MessageDig;
