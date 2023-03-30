import client from "./client";

// プロジェクト一覧取得（全件）
export const getProjectsAll = () => {
  return client.get(`/project/index_project_all`);
}

// プロジェクト一覧取得（条件付き）
export interface searchProjectParams {
  approvalDate: number,
  approvalDateFr: Date | null;
  approvalDateTo: Date | null;
  div: number[];
  pl: number[];
  status: string[];
  makeDate: number,
  makeDateFr: Date | null;
  makeDateTo: Date | null;
  make: number[];
  updateDate: number;
  updateDateFr: Date | null;
  updateDateTo: Date | null;
  update: number[];
  scheduledToBeCompleted: number;
  scheduledToBeCompletedFr: Date | null;
  scheduledToBeCompletedTo: Date | null;
}
export const getProjects = (params: searchProjectParams, not_project?: boolean) => {
  return client.patch(`/project/index_project?not_project=${not_project || false}`, params);
}

// プロジェクト新規登録
export interface projectNewParam {
  project: {
    status: string;
    approvalId: number | null;
// JavascriptのDateをJSONに変換するとUTC(世界標準時間)に変換される事象への対策
//    approvalDate: Date | null;
    approvalDate: string;
    divisionId: number | null;
    plId: number | null;
    number: string;
    name: string;
    createdId: number | null;
    updatedId: number | null;
  }
}
export const createProject = (params: projectNewParam) => {
  return client.post(`/project/create_project`, params);
}

// PL、作成者、更新者リスト情報取得
export const getProjectList = (not_project?: boolean) => {
  return client.get(`/project/index_projectlist?not_project=${not_project || false}`);
}

// プロジェクト情報取得（ID指定）
export const getProject = (projectId: number | null) => {
  return client.get(`/project/${projectId}/show_project_where_id`);
}

// プロジェクト登録（ID指定）
export interface phaseParam {
  id: number | null;
  projectId: number | null;
  number: number | null;
  name: string;
  plannedPeriodfr: Date | null;
  plannedPeriodto: Date | null;
  deliverables: string;
  criteria: string;
  del: boolean;
}
export interface riskParam {
  id: number | null;
  projectId: number | null;
  number: number | null;
  contents: string;
  del: boolean;
}
export interface goalParam {
  id: number | null;
  projectId: number | null;
  number: number | null;
  contents: string;
  del: boolean;
}
export interface memberParam {
  id: number | null;
  projectId: number | null;
  number: number | null;
  level: string;
  memberId: number | null;
  memberName: string;
  tag: string;
  del: boolean;
}
export interface logParam {
  changerId: number | null;
  contents: string;
}
export interface projectUpdParam {
  project: {
    id: number | null;
    status: string;
    divisionId: number | null;
    plId: number | null;
    number: string;
    name: string;
    makeDate: Date | null;
    makeId: number | null;
    updateDate: Date | null;
    updateId: number | null;
    companyName: string;
    departmentName: string;
    personinchargeName: string;
    phone: string;
    fax: string;
    email: string;
    developmentPeriodFr: Date | null;
    developmentPeriodTo: Date | null;
    scheduledToBeCompleted: Date | null;
    systemOverview: string;
    developmentEnvironment: string;
    orderAmount: number | null;
    plannedWorkCost: number | null;
    plannedWorkload: number | null;
    plannedPurchasingCost: number | null;
    plannedOutsourcingCost: number | null;
    plannedOutsourcingWorkload: number | null;
    plannedExpensesCost: number | null;
    grossProfit: number | null;
    workPlaceKbn: string;
    workPlace: string;
    customerPropertyKbn: string;
    customerProperty: string;
    customerEnvironment: string;
    purchasingGoodsKbn: string;
    purchasingGoods: string;
    outsourcingKbn: string;
    outsourcing: string;
    customerRequirementKbn: string;
    customerRequirement: string;
    remarks: string;
    updatedId: number | null;
  };
  phases: phaseParam[];
  risks: riskParam[];
  goals: goalParam[];
  members: memberParam[];
  log: logParam;
}
export const updateProject = (projectId: number | null, params: projectUpdParam) => {
  return client.patch(`/project/${projectId}/update_project_where_id`, params);
}

// 監査記録一覧取得（プロジェクトIDと種別（plan or report）を条件）
export const getAudits = (projectId: number | null, kinds: 'plan' | 'report') => {
  return client.get(`/project/${projectId}/index_audit_where_project_kinds?kinds=${kinds}`);
}

// 監査記録更新処理（プロジェクトID指定）
// プロジェクト計画書の状態も併せて更新する。
// プロジェクト計画書への状態更新が承認の場合は、変更記録に「初版」を登録する。
export interface auditParam {
  id: number | null;
  projectId: number | null;
  kinds: 'plan' | 'report';
  number: number | null;
  auditorId: number | null;
  auditDate: Date | null;
  title: string;
  contents: string;
  result: string;
  acceptId: number | null;
  acceptDate: Date | null;
  del: boolean;
}
export interface auditsUpdParam {
  status: string;
  audits: auditParam[];
}
export const updateAudits = (projectId: number | null, params: auditsUpdParam) => {
  return client.patch(`/project/${projectId}/update_audits`, params);
}

// ログ取得（プロジェクトID指定）
export const getChangelogs = (projectId: number | null) => {
  return client.get(`/project/${projectId}/index_log_where_project`);
}

// 完了報告書取得（プロジェクトID指定／プロジェクト情報、工程情報、完了報告書情報を取得）
export const getReport = (projectId: number | null) => {
  return client.get(`/project/${projectId}/show_report_where_projectid`);
}

// 完了報告書登録 or 更新（ID指定）
export interface actualPhaseParam {
  id: number | null;
  name: string;
  deliverables: string;
  reviewCount: number | null;
  plannedCost: number | null;
  actualCost: number | null;
  acceptCompDate: Date | null;
  shipNumber: string;
}
export interface reportUpdParam {
  makeDate: Date | null;
  makeId: number | null;
  deliveryDate: Date | null;
  actualWorkCost: number | null;
  actualWorkload: number | null;
  actualPurchasingCost: number | null;
  actualOutsourcingCost: number | null;
  actualOutsourcingWorkload: number | null;
  actualExpensesCost: number | null;
  grossProfit: number | null;
  customerPropertyAcceptResult: string;
  customerPropertyAcceptRemarks: string;
  customerPropertyUsedResult: string;
  customerPropertyUsedRemarks: string;
  purchasingGoodsAcceptResult:string;
  purchasingGoodsAcceptRemarks: string;
  outsourcingEvaluate1: string;
  outsourcingEvaluateRemarks1: string;
  outsourcingEvaluate2: string;
  outsourcingEvaluateRemarks2: string;
  communicationCount: number | null;
  meetingCount: number | null;
  phoneCount: number | null;
  mailCount: number | null;
  faxCount: number | null;
  designChangesCount: number | null;
  specificationChangeCount: number | null;
  designErrorCount: number | null;
  othersCount: number | null;
  improvementCount: number | null;
  correctiveActionCount: number | null;
  preventiveMeasuresCount: number | null;
  projectMeetingCount: number | null;
  statisticalConsideration: string;
  qualitygoalsEvaluate: string;
  totalReport: string;
  createdId: number | null;
  updatedId: number | null;
  project: {
    id: number | null;
    status: string;
  };
  phases: actualPhaseParam[];
}
export const updateReport = (reportId: number | null, params: reportUpdParam) => {
  return client.patch(`/project/${reportId}/update_report_where_id`, params);
}

// プロジェクトToDo取得（社員ID指定）
export const getProjectToDo = (employeeId: number | null) => {
  return client.get(`/project/${employeeId}/index_todo`);  
};

// 内部監査ToDo取得
export const getAuditToDo = () => {
  return client.get(`/project/index_audit_todo`);
}
