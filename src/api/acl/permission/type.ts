import type { ResponseData } from '@/api/base'

// 菜单与按钮数据的ts类型
export interface Permission {
  id: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: string
  toCode: string
  type: number
  status: null
  level: number
  children?: Permission[]
  select: boolean
}

// 菜单与按钮数据应答的ts类型
export interface PermissionResponseData extends ResponseData {
  data: Permission[]
}

// 添加与修改菜单携带的参数的ts类型
export interface PermissionParams {
  id?: number // ID
  pid: number // 权限数值
  name: string // 菜单的名字
  code: string // 几级菜单
  type: number // 类型 1-菜单；2-功能
  level: number // 父菜单ID
}
