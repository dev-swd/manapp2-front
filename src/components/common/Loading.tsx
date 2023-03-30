import React from 'react';
import CircularProgress from "@mui/material/CircularProgress";

const Loading = (props: { isLoading: boolean }) => {
  return (
    <>
      { props.isLoading ? (
        <div className="overlay">
          <CircularProgress />
        </div>
    ) : (
      <></>
    )}
    </>
  );
}
export default Loading;
