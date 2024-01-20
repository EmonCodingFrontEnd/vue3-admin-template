// 这里书写属性相关的API文件
import request8209 from '@/utils/request8209'
import { StringResponseData } from '@/api/base'
import type {
  CategoryResponseData,
  AttrResponseData,
  Attr,
} from '@/api/product/attr/type'

// 属性管理模块接口地址
enum API {
  // 获取一级分类接口地址
  C1_URL = '/admin/product/getCategory1',
  // 获取二级分类接口地址
  C2_URL = '/admin/product/getCategory2/',
  // 获取二级分类接口地址
  C3_URL = '/admin/product/getCategory3/',
  // 获取分类下已有的属性与属性值地址
  ATTR_URL = '/admin/product/attrInfoList/',
  // 添加属性与修改属性接口地址
  ADD_OR_UPDATE_ATTR_URL = '/admin/product/saveAttrInfo',
  // 删除属性接口地址
  REMOVE_ATTR_URL = '/admin/product/deleteAttr/',
}

// 获取一级分类的接口方法
export const reqC1 = () =>
  request8209.get<any, CategoryResponseData>(API.C1_URL)
// 获取二级分类的接口方法
export const reqC2 = (c1Id: number) =>
  request8209.get<any, CategoryResponseData>(API.C2_URL + `${c1Id}`)
// 获取三级分类的接口方法
export const reqC3 = (c2Id: number) =>
  request8209.get<any, CategoryResponseData>(API.C3_URL + `${c2Id}`)
// 获取分类下已有的属性与属性值地址接口方法
export const reqAttr = (c1Id: number, c2Id: number, c3Id: number) =>
  request8209.get<any, AttrResponseData>(
    API.ATTR_URL + `${c1Id}/${c2Id}/${c3Id}`,
    { timeout: 15000 },
  )
// 添加属性与修改属性的接口方法
export const reqAddOrUpdateAttrInfo = (data: Attr) =>
  request8209.post<any, StringResponseData>(API.ADD_OR_UPDATE_ATTR_URL, data)
// 删除属性接口地址的接口方法
export const reqRemoveAttrInfo = (attrId: number) =>
  request8209.delete<any, StringResponseData>(API.REMOVE_ATTR_URL + attrId)
