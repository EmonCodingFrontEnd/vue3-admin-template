import type { ResponseData } from '@/api/base'

// 账号信息的ts类型
export interface User {
  id?: number
  createTime?: string
  updateTime?: string
  username: string
  password: string
  name: string
  phone?: string // [lm's ps]: 20240226 17:28 为了编译通过而调整
  roleName?: string
}

// 账号信息的应答ts类型
export interface UserResponseData extends ResponseData {
  data: {
    records: User[]
    total: number
    size: number
    current: number
    pages: number
  }
}

// 代表一个职位的ts类型
export interface RoleData {
  id?: number
  createTime?: string
  updateTime?: string
  roleName: string
  remark: null | string
}

// 全部职位的列表
export type AllRole = RoleData[]

// 获取全部职位的接口返回的数据ts类型
export interface AllRoleResponseData extends ResponseData {
  data: {
    assignRoles: AllRole
    allRolesList: AllRole
  }
}

// 给用户分配职位接口携带参数的ts类型
export interface SetRoleData {
  roleIdList: number[]
  userId: number
}
