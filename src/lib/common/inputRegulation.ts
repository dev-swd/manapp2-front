// 入力規制用の共通関数
// 入力項目のonChangeで使用することで入力制限可能 
// ラインナップ
// 1.整数形式のみ
// 2.小数形式のみ
// 3.電話番号形式のみ
// 4.半角のみ

// 整数形式の入力のみ許可（数字のみ許可）
export const integerOnly = (v: string) => {
  let ret:string = "";
  Array.prototype.forEach.call(v, function(c: string) {
    if (c.match(/[\d]/)) {
      ret += c;
    }
  });
  return ret;
}

// 小数形式の入力のみ許可（数字とピリオド１つのみ許可）
export const decimalOnly = (v: string) => {
  let ret:string = "";
  let cnt:number = 0;
  Array.prototype.forEach.call(v, function(c: string) {
    if (c.match(/[\d\.]/)) {
      if(c==="."){
        if(cnt===0){
          ret += c;
        }
        cnt += 1;
      } else if(c==="0") {
        if(ret!=="0") {
          ret += c;
        }
      } else {
        ret += c;
      }
    }
  });
  return ret;
}

// 電話番号形式のみ許可（数字とハイフンのみ許可）
export const phoneOnly = (v: string) => {
  let ret:string = "";
  Array.prototype.forEach.call(v, function(c: string) {
    if (
      c.match(/[\d\-]/)
    ) {
      ret += c;
    }
  });
  return ret;
}

// 半角のみ許可
export const hankakuOnly = (v: string) => {
  let ret: string = "";
  Array.prototype.forEach.call(v, function(c: string) {
    if (
      c.match(/^[a-zA-Z0-9!-/:-@¥[-`{-~]+$/)
    ) {
      ret += c;
    }
  });
  return ret;
}
