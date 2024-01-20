import type { ResponseData } from '@/api/base'

export interface CategoryObj {
  id: number
  name: string
  category1Id?: number
  category2Id?: number
}

// 分类接口返回数据的类型
export interface CategoryResponseData extends ResponseData {
  data: CategoryObj[]
}

// 属性值对象的ts类型
export interface AttrValue {
  id?: number | undefined // 属性值id
  valueName: string
  attrId?: number | undefined // 属性值归属的属性id
  edit?: boolean
}

// 存储每一个属性值的数组类型
export type AttrValueList = AttrValue[]

// 属性对象
export interface Attr {
  id?: number | undefined // 属性id
  attrName: string
  categoryId: number | undefined // 属性归属的分类id
  categoryLevel: number // 属性归属的分类级别
  attrValueList: AttrValueList
}

// 存储每一个属性的数组类型
export type AttrList = Attr[]

// 属性接口返回的数据ts类型
export interface AttrResponseData extends ResponseData {
  data: AttrList
}
