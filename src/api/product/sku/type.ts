import type { ResponseData } from '@/api/base'

// 定义SKU对象的ts类型
export interface SkuAttrValue {
  attrId: number // 平台属性的ID
  attrName: string
  valueId: number // 平台属性值的ID
  valueName: string
}

export interface SkuSaleAttrValue {
  saleAttrId: number // 销售属性ID
  saleAttrName: string
  saleAttrValueId: number // 销售属性值的ID
  saleAttrValueName: number
}

// 商品SKU图片的TS类型
export interface SkuImage {
  id: number
  skuId: number
  spuImgId: number
  imgName: string
  imgUrl: string
  createTime?: string
  updateTime?: string
  isDefault: string
}

export interface SkuData {
  id?: number
  category3Id: number // 三级分类ID
  spuId: number // 已有的SPU的ID
  tmId: number // SPU品牌的ID
  isSale: number // 商品是否在售
  skuName: string // SKU名称
  price: number // SKU价格
  weight: string // SKU重量
  skuDesc: string // SKU的描述
  skuAttrValueList: SkuAttrValue[] // 平台属性的收集
  skuSaleAttrValueList: SkuSaleAttrValue[] // 销售属性的收集
  skuImageList: SkuImage[] // 商品SKU的图片
  skuDefaultImg: string // SKU图片地址
}

// 获取SKU接口返回的数据ts类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
  }
}

// 获取SKU商品详情接口的ts类型
export interface SkuInfoData extends ResponseData {
  data: SkuData
}
