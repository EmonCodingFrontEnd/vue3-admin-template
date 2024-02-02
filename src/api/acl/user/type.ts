import type { ResponseData } from '@/api/base'

// 账号信息的ts类型
export interface User {
  id?: number
  createTime?: string
  updateTime?: string
  username: string
  password: string
  name: string
  phone?: null
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
