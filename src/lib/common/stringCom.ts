export const zeroPadding = (v: any , totalLen: number) => {
  if(v===undefined || v===null || v===""){
    return ""
  } else {
    return ( Array(totalLen).join('0') + v ).slice( -totalLen );
  }
}
