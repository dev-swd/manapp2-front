import { useEffect, useRef, useState } from 'react';
import { cmnProps } from '../../common/cmnConst';
import { AlertType } from '../../common/cmnType';

import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

type Div = {
  id: number | null;
  code: string;
  name: string;
  depCode: string;
  depName: string;
}
type DivNodeProps = {
  div: Div;
  updDiv: (id: number | null) => void;
  delDiv: (div: Div) => void;
  assign: (level: string, id: number | null, name1: string, name2: string) => void;
  admin: (level: string, id: number | null, name1: string, name2: string) => void;
  setErr: (err: AlertType) => void;
  leftLock: boolean;
}
const DivNodeTree = (props: DivNodeProps) => {
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);

  // メニュー描画と制御
  const DivMenu = () => {
    const menuRef = useRef<HTMLUListElement>(null!);

    // menuオープンの場合は、フォーカスを当てる
    useEffect(() => {
      isOpenMenu && menuRef.current.focus();
    }, []);

    // メニュークリック時の処理
    const handleMenuClick = (i: number) => {
      setIsOpenMenu(false);
      switch (i) {
        case 1: // 変更
          props.updDiv(props.div.id);
          break;
        case 2: // 管理者設定
          props.admin("div", props.div.id, props.div.depName, props.div.name);
          break;
        case 3: // 社員追加／解除
          props.assign("div", props.div.id, props.div.depName, props.div.name);
          break;
        case 4: // 削除
          props.delDiv(props.div);
          break;
        default:
      }
    }
    
    // フォーカスアウトした際にmenuクローズ
    return (
      <ul className="dropdown-menu"
        style={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily, width: '130px', top: '95%', left: 'calc(100% - 135px)' }}
        key={"div-" + props.div.id}
        ref={menuRef} onBlur={() => setIsOpenMenu(false)} 
        hidden={!isOpenMenu}
        tabIndex={1}
      >
        <li key={"div-"+ props.div.id + "-1"} onClick={() => handleMenuClick(1)}>
          {"変更"}
        </li>
        <li key={"div-"+ props.div.id + "-2"} onClick={() => handleMenuClick(2)}>
          {"管理者設定"}
        </li>
        <li key={"div-"+ props.div.id + "-3"} onClick={() => handleMenuClick(3)}>
          {"社員追加／解除"}
        </li>
        <li key={"div-"+ props.div.id + "-4"} onClick={() => handleMenuClick(4)}>
          {"削除"}
        </li>
      </ul>
    );
  }

  return (
    <>
      <div key={"div-" + props.div.id} className="node-tree">
        <label style={{ paddingLeft: "1rem" }}>
          <input type="checkbox" disabled />  {/* メニューオープン防止 */}
          <ArrowRightIcon color="disabled" />
          <span style={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{props.div.code + ": " + props.div.name}</span>
          <IconButton size="small" onClick={() => setIsOpenMenu(!isOpenMenu)} disabled={props.leftLock} sx={{ "@media screen and (max-width: 800px)": { display: 'none' } }}>
            <MoreVertIcon fontSize='small' />
          </IconButton>
        </label>
        <DivMenu />
      </div>
    </>
  );
}
export default DivNodeTree;
