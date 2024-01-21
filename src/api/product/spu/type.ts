import type { ResponseData } from '@/api/base'

// SPU数据的ts类型
export interface SpuData {
  id?: number
  spuName: string
  description: string
  category3Id: number
  tmId: number
  spuSaleAttrList: null
  spuImageList: null
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
