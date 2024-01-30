// SKU模块接口管理
import request8209 from '@/utils/request8209'
import type { SkuResponseData, SkuInfoData } from '@/api/product/sku/type'
import type { StringResponseData } from '@/api/base'

// 枚举地址
enum API {
  // 获取已有的商品的数据-SKU
  SKU_URL = '/admin/product/list/',
  // 商品SKU上架
  SKU_ON_SALE_URL = '/admin/product/onSale/',
  // 商品SKU下架
  SKU_CANCEL_SALE_URL = '/admin/product/cancelSale/',
  // 获取商品SKU信息接口
  SKU_INFO_URL = '/admin/product/getSkuInfo/',
  // 删除商品SKU
  SKU_DELETE_URL = '/admin/product/deleteSku/',
}

// 获取商品SKU的接口
export const reqSkuList = (page: number, limit: number) =>
  request8209.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)
// 上架商品SKU的接口
export const reqOnSaleSku = (skuId: number) =>
  request8209.get<any, StringResponseData>(API.SKU_ON_SALE_URL + `${skuId}`)
// 下架商品SKU的接口
export const reqCancelSaleSku = (skuId: number) =>
  request8209.get<any, StringResponseData>(API.SKU_CANCEL_SALE_URL + `${skuId}`)
// 获取商品SKU信息接口
export const reqSkuInfo = (skuId: number) =>
  request8209.get<any, SkuInfoData>(API.SKU_INFO_URL + skuId)
// 删除商品SKU信息接口
export const reqDeleteSku = (skuId: number) =>
  request8209.delete<any, StringResponseData>(API.SKU_DELETE_URL + skuId)
