// 统一管理用户相关的接口
import request8212 from '@/utils/request8212.ts'
import type {
  LoginFormData,
  LoginResponseData,
  UserInfoResponseData,
} from '@/api/user/type'
import { LogoutResponseData } from '@/api/user/type'

// 项目用户相关的请求地址
enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout',
}

// 登录接口
export const reqLogin = (data: LoginFormData) =>
  request8212.post<any, LoginResponseData>(API.LOGIN_URL, data)

// 获取用户信息接口
export const reqUserInfo = () =>
  request8212.get<any, UserInfoResponseData>(API.USERINFO_URL)

// 退出登录接口
export const reqLogout = () =>
  request8212.post<any, LogoutResponseData>(API.LOGOUT_URL)
