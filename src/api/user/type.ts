import type { ResponseData } from '@/api/base'

// 定义用户相关数据的TS类型
// 登录接口请求参数类型
export interface LoginFormData {
  username: string
  password: string
}

// 登录接口应答数据类型
export interface LoginResponseData extends ResponseData {
  data: string
}

// 获取用户信息返回数据类型
export interface UserInfoResponseData extends ResponseData {
  data: {
    routes: string[]
    buttons: string[]
    roles: string[]
    name: string
    avatar: string
  }
}

// 退出登录返回类型
export interface LogoutResponseData extends ResponseData {
  data: null
}
