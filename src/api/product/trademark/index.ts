// 书写品牌管理模块接口
import request8209 from '@/utils/request8209'
import type {
  Trademark,
  TrademarkResponseData,
  ResponseData,
} from '@/api/product/trademark/type'

// 品牌管理模块接口地址
enum API {
  // 获取已有品牌接口
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  // 添加品牌
  ADD_TRADEMARK_URL = '/admin/product/baseTrademark/save',
  // 修改已有品牌
  UPDATE_TRADEMARK_URL = '/admin/product/baseTrademark/update',
  // 图片上传地址
  PICTURE_UPLOAD_URL = import.meta.env.VITE_APP_BASE_API_8209 +
    '/admin/product/fileUpload',
}

export const PICTURE_UPLOAD_URL: string = API.PICTURE_UPLOAD_URL.toString()

// 获取已有品牌接口方法
/**
 * page:获取第几页，默认第一页
 * limit:获取几个已有品牌的数据
 */
export const reqTrademark = (page: number, limit: number) =>
  request8209.get<any, TrademarkResponseData>(
    API.TRADEMARK_URL + `${page}/${limit}`,
  )

// 添加品牌或修改已有品牌
export const reqAddOrUpdateTrademark = (data: Trademark) => {
  // 修改已有品牌
  if (data.id) {
    return request8209.put<any, ResponseData>(API.UPDATE_TRADEMARK_URL, data)
  }
  // 添加品牌
  else {
    return request8209.post<any, ResponseData>(API.ADD_TRADEMARK_URL, data)
  }
}
