import type { ResponseData } from '@/api/base'

// 角色信息的ts类型
export interface Role {
  id?: number
  createTime?: string
  updateTime?: string
  remark?: null
  roleName: string
}

// 角色信息的应答ts类型
export interface RoleResponseData extends ResponseData {
  data: {
    records: Role[]
    total: number
    size: number
    current: number
    pages: number
  }
}

// 菜单与按钮数据的ts类型
export interface MenuData {
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
  children?: MenuData[]
  select: boolean
}

export interface MenuResponseData extends ResponseData {
  data: MenuData[]
}

// 为角色分配权限的ts类型
export interface RolePermission {
  roleId: number
  permissionIdList: number[]
}
