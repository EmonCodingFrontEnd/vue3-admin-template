import type { RouteRecordRaw } from 'vue-router'
import type { CategoryObj } from '@/api/product/attr/type'

// 定义user小仓库数据state类型
export interface UserState {
  token: string | null
  menuRoutes: any // RouteRecordRaw[] [lm's ps]: 20240226 17:28 为了编译通过而调整
  username: string
  avatar: string
  buttons: string[]
}

// 定义分类仓库state对象的ts类型
export interface CategoryState {
  c1Arr: CategoryObj[]
  c1Id: number | undefined
  c2Arr: CategoryObj[]
  c2Id: number | undefined
  c3Arr: CategoryObj[]
  c3Id: number | undefined
}
