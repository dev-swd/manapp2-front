import client from "./client";

// ロール一覧取得（全件）
export const getApplicationRoles = () => {
  return client.get(`/application/index_role_all`);
}

// 機能Temp一覧取得（全件）
export const getApplicationTemps = () => {
  return client.get(`/application/index_temp_all`);
}

// 機能Temp登録
interface tempParam {
  id: number | null;
  code: string;
  name: string;
  del: boolean;  
}
export interface updateTempParams {
  temps: tempParam[];
}
export const updateApplicationTemps = (params: updateTempParams) => {
  return client.post(`/application/update_temp`, params);
}

// ロール新規登録
export interface ApplicationParams {
  id: number | null;
  applicationtempId: number | null;
  permission: boolean;
}
export interface RoleParams {
  id: number | null;
  code: string;
  name: string;
  apps: ApplicationParams[];
}
export const createRole = (params: RoleParams) => {
  return client.post(`/application/create_role`, params);
}

// ロール削除（ID指定）
export const deleteRole = (roleId: number | null) => {
  return client.delete(`/application/${roleId}/destroy_role_where_id`);
};

// ロール検索（ID指定）
export const getRole = (roleId: number | null) => {
  return client.get(`/application/${roleId}/show_role_where_id`);
} 

// ロール更新（ID指定）
export const updateRole = (roleId: number | null, params: RoleParams) => {
  return client.patch(`/application/${roleId}/update_role_where_id`, params);
}