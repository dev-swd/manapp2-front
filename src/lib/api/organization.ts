import client from "./client";

// 事業部一覧取得（全件）
export const getDeps = () => {
  return client.get(`/organization/index_dep_all`);
}

// 事業部新規作成
export interface createDepParams {
  code: string;
  name: string;
}
export const createDep = (params: createDepParams) => {
  return client.post(`/organization/create_dep`, params);
}

// 事業部取得（ID条件）
export const getDep = (depId: number | null) => {
  return client.get(`/organization/${depId}/show_dep_where_id`);
} 

// 事業部更新
export interface updateDepParams {
  code: string;
  name: string;
}
export const updateDep = (depId: number | null, params: updateDepParams) => {
  return client.patch(`/organization/${depId}/update_dep_where_id`, params);
}

// 事業部削除（ID指定）
export const deleteDep = (depId: number | null) => {
  return client.delete(`/organization/${depId}/destroy_dep_where_id`);
};

// 課一覧取得（全件）
export const getDivs = () => {
  return client.get(`/organization/index_div_all`);
}

// 課一覧取得（事業部条件）
export const getDivsWhereDep = (depId: number | null) => {
  return client.get(`/organization/${depId}/index_div_where_dep/`);
}

// 課新規作成
export interface createDivParams {
  department_id: number | null;
  code: string;
  name: string;
}
export const createDiv = (params: createDivParams) => {
  return client.post(`/organization/create_div`, params);
}

// 課取得（ID指定）
export const getDiv = (divId: number | null) => {
  return client.get(`/organization/${divId}/show_div_where_id`);
}

// 課更新
export interface updateDivParams {
  code: string;
  name: string;
}
export const updateDiv = (divId: number | null, params: updateDivParams) => {
  return client.patch(`/organization/${divId}/update_div_where_id`, params);
}

// 課削除（ID指定）
export const deleteDiv = (divId: number | null) => {
  return client.delete(`/organization/${divId}/destroy_div_where_id`);
};

// 課取得（事業部ダミー課1件のみ／事業部ID指定）
export const getDivWhereDepDummy = (depId: number | null) => {
  return client.get(`/organization/${depId}/show_div_where_depdummy`);
}

// 社員一覧取得（全件）
export const getEmps = () => {
  return client.get(`/organization/index_emp_all`);
}

// 社員一覧取得（未所属）
export const getEmpsWhereNotAssign = () => {
  return client.get(`/organization/index_emp_where_not_assign`);
}

// 社員一覧取得（事業部直轄=事業部ID指定）
export const getEmpsWhereDepDirect = (depId: number | null) => {
  return client.get(`/organization/${depId}/index_emp_where_dep_direct`);
}

// 社員一覧取得（課所属=課ID指定）
export const getEmpsWhereDiv = (divId: number | null) => {
  return client.get(`/organization/${divId}/index_emp_where_div`);
}

// 社員取得（ID指定）
export const getEmp = (empId: number | null) => {
  return client.get(`/organization/${empId}/show_emp_where_id`);
}

// 社員更新（ID指定）
export interface updateEmpParams {
  employeeNumber: string;
  name: string;
  nameKana: string;
  birthday: Date | null;
  address: string;
  phone: string;
  joiningDate: Date | null;
  authorityId: number | null;
}
export const updateEmp = (empId: number | null, params: updateEmpParams | {divisionId: number | null}) => {
  return client.patch(`/organization/${empId}/update_emp_where_id`, params);
}

// 承認者一覧取得（事業部直轄=事業部ID指定）
export const getApprovalsWhereDepDirect = (depId: number | null) => {
  return client.get(`/organization/${depId}/index_approval_where_dep_direct`);
}

// 承認者一覧取得（課所属=課ID指定）
export const getApprovalsWhereDiv = (divId: number | null) => {
  return client.get(`/organization/${divId}/index_approval_where_div`);
}

// 承認権限登録
export interface createApprovalParams {
  userId: Number | null;
  divisionId: Number | null;
}
export const createApproval = (params: createApprovalParams) => {
  return client.post(`/organization/create_approval`, params);
}

// 承認権限削除（ID指定）
export const deleteApproval = (approvalId: number | null) => {
  return client.delete(`/organization/${approvalId}/destroy_approval_where_id`);
};

// Deviseパスワード変更(社員ID指定／現在のパスワード不要)
export interface resetPasswordParams {
  password: string
  passwordConfirmation: string
}
export const updatePasswordReset = (empId: number | null, params: resetPasswordParams) => {
  return client.patch(`/organization/${empId}/update_password_without_currentpassword/`, params);
}
