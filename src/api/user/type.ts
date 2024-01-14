// 登录接口需要携带参数ts类型
export interface LoginForm {
  username: string
  password: string
}

// 登录接口返回数据类型
interface DataType {
  token?: string
  message?: string
}
export interface LoginResponseData {
  code: number
  data: DataType
}

// 定义服务器返回用户信息相关的数据类型
interface UserInfo {
  userId: number
  avatar: string
  username: string
  password: string
  desc: string
  roles: string[]
  buttons: string[]
  routes: string[]
  token: string
}
interface User {
  checkUser?: UserInfo
  message?: string
}
export interface UserResponseData {
  code: number
  data: User
}
