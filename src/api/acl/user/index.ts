// 用户管理模块的接口
import request8212 from '@/utils/request8212'
import type { User, UserResponseData } from '@/api/acl/user/type'
import type { StringResponseData } from '@/api/base'

// 枚举地址
enum API {
  // 获取全部已有用户账号信息
  USER_LIST_URL = '/admin/acl/user/',
  // 添加一个新的用户账号
  USER_SAVE_URL = '/admin/acl/user/save',
  // 更新一个新的用户账号
  USER_UPDATE_URL = '/admin/acl/user/update',
}

// 获取全部已有用户账号信息的方法
export const reqUserList = (page: number, limit: number) =>
  request8212.get<any, UserResponseData>(API.USER_LIST_URL + `${page}/${limit}`)
// 添加一个新的|更新一个用户账号
export const reqSaveOrUpdateUserInfo = (data: User) => {
  if (data.id) {
    return request8212.put<any, StringResponseData>(API.USER_UPDATE_URL, data)
  } else {
    return request8212.post<any, StringResponseData>(API.USER_SAVE_URL, data)
  }
}
