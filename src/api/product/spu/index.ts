// 这里书写SPU相关的API文件
import request8209 from '@/utils/request8209'
import type { StringResponseData } from '@/api/base'
import type {
  HasSpuResponseData,
  SpuHasImageResponseData,
  SpuHasSaleAttrResponseData,
  AllTrademarkResponseData,
  AllSaleAttrResponseData,
  SpuData,
  SkuData,
  SkuInfoData,
} from '@/api/product/spu/type'

// SPU管理模块接口地址
enum API {
  // 获取已有的SPU的数据
  HASSPU_UR = '/admin/product/',
  // 获取全部品牌的数据
  ALL_TRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  // 获取整个项目全部的销售属性【颜色、版本、尺码】
  ALL_SALE_ATTR_URL = '/admin/product/baseSaleAttrList',
  // 获取某一个SPU全部的售卖商品图片
  SPU_HAS_IMAGE_LIST_URL = '/admin/product/spuImageList/',
  // 获取某一个SPU下全部的已有的销售属性接口地址
  SPU_HAS_SALE_ATTR_LIST_URL = '/admin/product/spuSaleAttrList/',
  // 添加一个新的SPU
  ADD_SPU_URL = '/admin/product/saveSpuInfo',
  // 更新已有的SPU
  UPDATE_SPU_URL = '/admin/product/updateSpuInfo',
  // 图片上传地址 [lm's ps]: 20240226 17:28 为了编译通过而调整
  PICTURE_UPLOAD_URL = (import.meta.env.VITE_APP_BASE_API_8209 +
    '/admin/product/fileUpload') as unknown as number,
  // 追加一个新增的SKU地址
  ADD_SKU_URL = '/admin/product/saveSkuInfo',
  // 查看某一个已有的SPU下全部的售卖商品
  SKU_INFO_URL = '/admin/product/findBySpuId/',
  // 删除已有的SPU
  DELETE_SPU_URL = '/admin/product/deleteSpu/',
}

export const PICTURE_UPLOAD_URL: string = API.PICTURE_UPLOAD_URL.toString()

// 获取某一个三级分类下已有的SPU数据
export const reqHasSpu = (page: number, limit: number, c3Id: number) =>
  request8209.get<any, HasSpuResponseData>(
    API.HASSPU_UR + `${page}/${limit}?category3Id=${c3Id}`,
  )

// 获取全部品牌的数据
export const reqAllTrademark = () =>
  request8209.get<any, AllTrademarkResponseData>(API.ALL_TRADEMARK_URL)
// 获取全部的销售属性
export const reqAllSaleAttr = () =>
  request8209.get<any, AllSaleAttrResponseData>(API.ALL_SALE_ATTR_URL)
// 获取某一个SPU全部的售卖商品图片
export const reqSpuHasImageList = (spuId: number) =>
  request8209.get<any, SpuHasImageResponseData>(
    API.SPU_HAS_IMAGE_LIST_URL + `${spuId}`,
  )
// 获取某一个SPU下全部的已有的销售属性的方法
export const reqSpuHasSaleAttrList = (spuId: number) =>
  request8209.get<any, SpuHasSaleAttrResponseData>(
    API.SPU_HAS_SALE_ATTR_LIST_URL + `${spuId}`,
  )

// 添加或更新
export const reqAddOrUpdateSpuInfo = (data: SpuData) => {
  // 更新已有的SPU
  if (data.id) {
    return request8209.post<any, StringResponseData>(API.UPDATE_SPU_URL, data)
  }
  // 添加一个新的SPU
  else {
    return request8209.post<any, StringResponseData>(API.ADD_SPU_URL, data)
  }
}
// 追加一个新增的SKU的方法
export const reqAddSkuInfo = (data: SkuData) =>
  request8209.post<any, StringResponseData>(API.ADD_SKU_URL, data)
// 查看某一个已有的SPU下全部的售卖商品的方法
export const reqSkuInfo = (spuId: number) =>
  request8209.get<any, SkuInfoData>(API.SKU_INFO_URL + spuId)
// 删除已有的SPU的方法
export const reqDeleteSpuInfo = (spuId: number) =>
  request8209.delete<any, StringResponseData>(API.DELETE_SPU_URL + spuId)
