// 日付関連の共通関数
// ラインナップ
// 1.Date型を日付書式表示（ゼロサプレス）
// 2.Date型を日付書式表示（ゼロパディング）
// 3.DateTime型を日時書式表示（ゼロサプレス）
// 4.DateTime型を日時書式表示（ゼロパディング）

// 1.Date型を日付書式表示（ゼロサプレス）
export const formatDate = (d: any, format: string) => {
  if(d===undefined || d===null || d===""){
    return "";    
  }
  var dt = new Date(d);
  var year_str = String(dt.getFullYear());
  var month_str = String(dt.getMonth() + 1);
  var day_str = String(dt.getDate());
  var format_str = format;
  format_str = format_str.replace(/YYYY/g, year_str);
  format_str = format_str.replace(/MM/g, month_str);
  format_str = format_str.replace(/DD/g, day_str);

  return format_str;
}

// 2.Date型を日付書式表示（ゼロパディング）
export const formatDateZero = (d: any, format: string) => {
  if(d===undefined || d===null || d===""){
    return "";
  }
  var dt = new Date(d);
  var year_str = String(dt.getFullYear());
  var month_str = String(dt.getMonth() + 1);
  var day_str = String(dt.getDate());
  var format_str = format;
  month_str = ('0' + month_str).slice(-2);
  day_str = ('0' + day_str).slice(-2);
  format_str = format_str.replace(/YYYY/g, year_str);
  format_str = format_str.replace(/MM/g, month_str);
  format_str = format_str.replace(/DD/g, day_str);

  return format_str;
}

// 3.DateTime型を日時書式表示（ゼロサプレス）
export const formatDateTime = (d: any, format: string) => {
  if(d===undefined || d===null || d===""){
    return "";
  }
  var dt = new Date(d);
  var year_str = String(dt.getFullYear());
  var month_str = String(dt.getMonth() + 1);
  var day_str = String(dt.getDate());
  var hour_str = String(dt.getHours());
  var minute_str = String(dt.getMinutes());
  var second_str = String(dt.getSeconds());
  var format_str = format;
  format_str = format_str.replace(/YYYY/g, year_str);
  format_str = format_str.replace(/MM/g, month_str);
  format_str = format_str.replace(/DD/g, day_str);
  format_str = format_str.replace(/HH/g, hour_str);
  format_str = format_str.replace(/MI/g, minute_str);
  format_str = format_str.replace(/SS/g, second_str);

  return format_str;
}

// 4.DateTime型を日時書式表示（ゼロパディング）
export const formatDateTimeZero = (d: any, format: string) => {
  if(d===undefined || d===null || d===""){
    return "";
  }
  var dt = new Date(d);
  var year_str = String(dt.getFullYear());
  var month_str = String(dt.getMonth() + 1);
  var day_str = String(dt.getDate());
  var hour_str = String(dt.getHours());
  var minute_str = String(dt.getMinutes());
  var second_str = String(dt.getSeconds());
  var format_str = format;
  month_str = ('0' + month_str).slice(-2);
  day_str = ('0' + day_str).slice(-2);
  hour_str = ('0' + hour_str).slice(-2);
  minute_str = ('0' + minute_str).slice(-2);
  second_str = ('0' + second_str).slice(-2);
  format_str = format_str.replace(/YYYY/g, year_str);
  format_str = format_str.replace(/MM/g, month_str);
  format_str = format_str.replace(/DD/g, day_str);
  format_str = format_str.replace(/HH/g, hour_str);
  format_str = format_str.replace(/MI/g, minute_str);
  format_str = format_str.replace(/SS/g, second_str);

  return format_str;
}
