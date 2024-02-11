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
