import client from "./client";

// 商材マスタ一覧取得（全件）
export const getProducts = () => {
  return client.get(`/master/index_product`);
}

// 商材マスタ登録
interface productParam {
  id: number | null;
  code: string;
  name: string;
  colorR: number;
  colorG: number;
  colorB: number;
  colorA: number;
  del: boolean;
}
export interface updateProductParams {
  products: productParam[];
}
export const updateProducts = (params: updateProductParams) => {
  return client.post(`/master/update_product`, params);
}
