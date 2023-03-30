import { useEffect, useRef, useState } from 'react';
import { cmnProps } from '../../common/cmnConst';
import { AlertType } from '../../common/cmnType';
import { getDivsWhereDep } from '../../../lib/api/organization';
import DivNodeTree from './DivNodeTree';

import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

type Dep = {
  id: number | null;
  code: string;
  name: string;
}
type DepNodeProps = {
  dep: Dep;
  updDep: (id: number | null) => void;
  delDep: (dep: Dep) => void;
  newDiv: (dep: Dep) => void;
  updDiv: (id: number | null) => void;
  delDiv: (div: Div) => void;
  assign: (level: string, id: number | null, name1: string, name2: string) => void;
  admin: (level: string, id: number | null, name1: string, name2: string) => void;
  setErr: (err: AlertType) => void;
  leftLock: boolean;
}
type Div = {
  id: number | null;
  code: string;
  name: string;
  depCode: string;
  depName: string;
}
const DepNodeTree = (props: DepNodeProps) => {
  const [divs, setDivs] = useState<Div[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);

  // 初期処理
  useEffect(() => {
    hendleGetDivs();
  }, [props.dep]);

  // 課情報取得
  const hendleGetDivs = async () => {
    try {
      const res = await getDivsWhereDep(props.dep.id);
      setDivs(res.data.divs);
    } catch (e) {
      props.setErr({severity: "error", message: "課情報取得エラー"});
    }   
  }

  // チェックボックスのクリックでisOpenステートを更新
  const handleChange = (checked: boolean) => {
    setIsOpen(checked);
  }
  
  // メニュー描画と制御
  const DepMenu = () => {
    const menuRef = useRef<HTMLUListElement>(null!);

    // menuオープンの場合は、フォーカスを当てる
    useEffect(() => {
      isOpenMenu && menuRef.current.focus();
    }, [isOpenMenu]);

    // メニュークリック時の処理
    const handleMenuClick = (i: number) => {
      setIsOpenMenu(false);
      switch (i) {
        case 1: // 変更
          props.updDep(props.dep.id);
          break;
        case 2: // 管理者設定
          props.admin("dep", props.dep.id, props.dep.name, "");
          break;
        case 3: // 社員追加／解除
          props.assign("dep", props.dep.id, props.dep.name, "");
          break;
        case 4: // 課追加
          props.newDiv(props.dep);
          break;
        case 5: // 削除
          props.delDep(props.dep);
          break;
        default:
      }
    }

    // フォーカスアウトした際にはmenuクローズ
    return (
      <ul className="dropdown-menu"
        style={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily, width: '130px', top: '95%', left: 'calc(100% - 135px)' }}
        key={"dep-" + props.dep.id}
        ref={menuRef} onBlur={() => setIsOpenMenu(false)} 
        hidden={!isOpenMenu}
        tabIndex={1}
      >
        <li key={"dep-" + props.dep.id + "-1"} onClick={() => handleMenuClick(1)}>
          {"変更"}
        </li>
        <li key={"dep-" + props.dep.id + "-2"} onClick={() => handleMenuClick(2)}>
          {"管理者設定"}
        </li>
        <li key={"dep-" + props.dep.id + "-3"} onClick={() => handleMenuClick(3)}>
          {"社員追加／解除"}
        </li>
        <li key={"dep-" + props.dep.id + "-4"} onClick={() => handleMenuClick(4)}>
          {"課追加"}
        </li>
        <li key={"dep-" + props.dep.id + "-5"} onClick={() => handleMenuClick(5)}>
          {"削除"}
        </li>
      </ul>
    );    
  }

  return (
    <>
      <div key={"dep-" + props.dep.id} className="node-tree">
        <label>
          { (divs===undefined || divs.length===0) ? (
            <div>
              <input type="checkbox" disabled />
              <ArrowRightIcon color="disabled" />
            </div>
          ) : (
            <>
              <input type="checkbox" onChange={(e) => handleChange(e.target.checked)} />
              { isOpen ? (
                <ArrowDropUpIcon />
              ) : (
                <ArrowDropDownIcon />
              )}
            </>
          )}
          <span style={{ fontSize: cmnProps.fontSize, fontFamily: cmnProps.fontFamily }}>{props.dep.code + ": " + props.dep.name}</span>
          <IconButton size="small" onClick={() => setIsOpenMenu(!isOpenMenu)} disabled={props.leftLock} sx={{ "@media screen and (max-width: 800px)": { display: 'none' } }}>
            <MoreVertIcon fontSize='small' />
          </IconButton>
        </label>
        <DepMenu />
      </div>
      <div style={{ display: isOpen ? '' : 'none' }}>
        { divs.length ? (
          divs.map((d,i) => (
            <DivNodeTree key={i} div={d} updDiv={props.updDiv} delDiv={props.delDiv} assign={props.assign} admin={props.admin} setErr={props.setErr} leftLock={props.leftLock} />
          ))
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
export default DepNodeTree;
