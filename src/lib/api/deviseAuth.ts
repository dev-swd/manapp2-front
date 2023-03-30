import client from "./client";
import Cookies from "js-cookie";

// サインアップ
export interface SignUpParams {
  email: string
  password: string
  passwordConfirmation: string
  employeeNumber: string
  name: string
  nameKana: string
  birthday: Date | null
  address: string
  phone: string
  joiningDate: Date | null
  authorityId: number
}
export const signUp = (params: SignUpParams) => {
  return client.post(`auth`, params);
}

// サインイン
export interface SignInParams {
  email: string
  password: string
}
export const signIn = (params: SignInParams) => {
  return client.post(`auth/sign_in`, params);
}

// サインアウト（ログアウト）
export const signOut = () => {
  return client.delete(`/auth/sign_out`,
    {headers: {
      "access-token": Cookies.get("_access_token"),
      "client": Cookies.get("_client"),
      "uid": Cookies.get("_uid")
    }});
}

// 認証済みのユーザーを取得
export const getCurrentUser = () => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) return
    return client.get(`/auth/sessions`, { headers: {
      "access-token": Cookies.get("_access_token"),
      "client": Cookies.get("_client"),
      "uid": Cookies.get("_uid")
    }}
  );
}

// パスワード変更
export interface ChangePasswordParams {
  password: string
  passwordConfirmation: string
}
export const changePassword = (params: ChangePasswordParams) => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) return
    return client.put(`/auth/password`, params, { headers: {
      "access-token": Cookies.get("_access_token"),
      "client": Cookies.get("_client"),
      "uid": Cookies.get("_uid")
    }}
  );
}
