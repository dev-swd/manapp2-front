import client from "./client";

// リードレベル一覧取得（全件）
export const getLeads = () => {
  return client.get(`/prospect/index_lead`);
}

// リードレベルマスタ登録
interface leadParam {
  id: number | null;
  name: string;
  periodKbn: string;
  period: number | null;
  colorR: number;
  colorG: number;
  colorB: number;
  colorA: number;
  del: boolean;
}
export interface updateLeadParams {
  leads: leadParam[];
}
export const updateLeads = (params: updateLeadParams) => {
  return client.post(`/prospect/update_lead`, params);
}

// アクション一覧取得（全件）
export const getSalesActions = () => {
  return client.get(`/prospect/index_salesaction`);
}

// アクションマスタ登録
interface actionParam {
  id: number | null;
  name: string;
  colorR: number;
  colorG: number;
  colorB: number;
  colorA: number;
  del: boolean;
}
export interface updateActionParams {
  salesactions: actionParam[];
}
export const updateSalesActions = (params: updateActionParams) => {
  return client.post(`/prospect/update_salesaction`, params);
}

// 案件一覧取得（全件）
export interface searchProspectParams {
  confirmed: boolean;
  createdAt: number;
  createdAtFr: Date | null;
  createdAtTo: Date | null;
  lead: number[];
  closingDate: number;
  closingDateFr: Date | null;
  closingDateTo: Date | null;
  unconfirmed: boolean;
  unCreatedAt: number;
  unCreatedAtFr: Date | null;
  unCreatedAtTo: Date | null;
  unLead: number[];
  div: number[];
  product: number[];
}
export const getProspects = (params: searchProspectParams) => {
  return client.post(`/prospect/index_prospect`, params);
}
export const getProspectsAll = () => {
  return client.get(`/prospect/index_prospect_all`);
}

// 案件情報登録
export interface prospectParam {
  id: number | null;
  name: string;
  divisionId: number | null;
  makeId: number | null;
  updateId: number | null;
  companyName: string;
  departmentName: string;
  personInChargeName: string;
  phone: string;
  fax: string;
  email: string;
  productId: number | null;
  leadId: number | null;
  content: string;
  periodFr: Date | null;
  periodTo: Date | null;
  mainPersonId: number | null;
  orderAmount: number | null;
  salesChannels: string;
  salesPerson: string;
}
export const createProspect = (params: prospectParam) => {
  return client.post(`/prospect/create_prospect`, params);
}

// 案件情報取得（ID指定）
export const getProspect = (prospectId: number | null) => {
  return client.get(`/prospect/${prospectId}/show_prospect_where_id`);
}

// 案件情報更新（ID指定）
export const updateProspect = (prospectId: number | null, params: prospectParam) => {
  return client.patch(`/prospect/${prospectId}/update_prospect_where_id`, params);
}

// 案件情報成約更新（ID指定）
export interface closingParam {
  closingDate: Date | null;
  updateId: number | null;
}
export const closingProspect = (prospectId: number | null, params: closingParam) => {
  return client.patch(`/prospect/${prospectId}/closing_prospect_where_id`, params);
}

// 月別商材別確定件数
export const countClosingByMonthProduct = (dateFr: Date | null, dateTo: Date | null) => {
  return client.get(`/prospect/count_closing_by_month_product?date_fr=${dateFr}&date_to=${dateTo}`);
}

// 月別リード数
export const countLeadByMonth = (dateFr: Date | null, dateTo: Date | null) => {
  return client.get(`/prospect/count_lead_by_month?date_fr=${dateFr}&date_to=${dateTo}`);
}

// 営業報告登録
export interface salesReportParam {
  id: number | null;
  reportDate: Date | null;
  makeId: number | null;
  updateId: number | null;
  salesactionId: number | null;
  topics: string;
  content: string;
}
export const createSalesReport = (prospectId: number | null, params: salesReportParam) => {
  return client.post(`/prospect/${prospectId}/create_salesreport`, params);
}

// 営業報告一覧取得（見込み案件ID指定）
export const getSalesreportsWhereProspect = (prospectId: number | null) => {
  return client.get(`/prospect/${prospectId}/index_salesreport_where_prospect/`);
}

// 営業報告取得（ID指定）
export const getSalesreport = (reportId: number | null) => {
  return client.get(`/prospect/${reportId}/show_salesreport_where_id`);
}

// 営業報告更新（ID指定）
export const updateSalesreport = (reportId: number | null, params: salesReportParam) => {
  return client.patch(`/prospect/${reportId}/update_salesreport_where_id`, params);
}

// 営業報告Action別月別集計（見込み案件ID指定）
export const countByActionMonthWhereProspect = (prospectId: number | null) => {
  return client.get(`/prospect/${prospectId}/count_by_action_month_where_prospect`);
}
