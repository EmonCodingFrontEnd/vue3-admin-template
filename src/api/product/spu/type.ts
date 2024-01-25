import type { ResponseData } from '@/api/base'
import { Trademark } from '@/api/product/trademark/type'

// SPU数据的ts类型
export interface SpuData {
  id?: number
  spuName: string // 商品名称
  tmId: number // 品牌ID
  description: string // 商品描述
  category3Id: number
  spuImageList: null | SpuImage[]
  spuSaleAttrList: null | SpuSaleAttr[]
}

// 数组：元素都是已有SPU数据类型
export type SpuDataList = SpuData[]

// 定义获取已有的SPU接口返回的数据ts类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: SpuDataList
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

// 品牌接口返回的数据ts类型
export interface AllTrademarkResponseData extends ResponseData {
  data: Trademark[]
}

// 已有的全部SPU的返回数据ts类型
export interface SaleAttr {
  id: number
  name: string
}

export interface AllSaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

// 商品图片的TS类型
export interface SpuImage {
  id?: number
  spuId?: number
  imgName: string
  imgUrl: string
  createTime?: string
  updateTime?: string
  name: string // non-backend-field
  url: string // non-backend-field
}

// 已有的SPU的照片墙数据的类型
export interface SpuHasImageResponseData extends ResponseData {
  data: SpuImage[]
}

// 已有的销售属性值对象ts类型
export interface SpuSaleAttrValue {
  id?: number
  spuId?: number
  baseSaleAttrId: number
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
  createTime?: null
  updateTime?: null
}

// 存储已有的销售属性数组类型
export type SpuSaleAttrValueList = SpuSaleAttrValue[]

// 销售属性对象ts类型
export interface SpuSaleAttr {
  id?: number
  spuId?: number
  baseSaleAttrId: number
  saleAttrName: string
  spuSaleAttrValueList: SpuSaleAttrValueList
  createTime?: null
  updateTime?: null
  edit?: boolean // non-backend-field
  saleAttrValueName?: string // non-backend-field
}

// SPU已有的销售属性接口返回数据ts类型
export interface SpuHasSaleAttrResponseData extends ResponseData {
  data: SpuSaleAttr[]
}
