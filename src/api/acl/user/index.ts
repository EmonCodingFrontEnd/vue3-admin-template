// 用户管理模块的接口
import request8212 from '@/utils/request8212'
import type { StringResponseData } from '@/api/base'
import type {
  User,
  UserResponseData,
  AllRoleResponseData,
  SetRoleData,
} from '@/api/acl/user/type'

// 枚举地址
enum API {
  // 获取全部已有用户账号信息
  USER_LIST_URL = '/admin/acl/user/',
  // 添加一个新的用户账号
  USER_SAVE_URL = '/admin/acl/user/save',
  // 更新一个新的用户账号
  USER_UPDATE_URL = '/admin/acl/user/update',
  // 获取全部职位以及当前用户拥有的职位信息
  USER_TO_ASIGN_ROLE_URL = '/admin/acl/user/toAssign/',
  // 根据用户分配角色
  USER_DO_ASIGN_ROLE_URL = '/admin/acl/user/doAssignRole',
  // 删除账号
  USER_DELETE_URL = '/admin/acl/user/remove/',
  // 批量删除
  USER_BATCH_DELETE_URL = '/admin/acl/user/batchRemove',
}

// 获取全部已有用户账号信息的方法
export const reqUserList = (
  page: number,
  limit: number,
  username = '',
  name = '',
) =>
  request8212.get<any, UserResponseData>(
    API.USER_LIST_URL + `${page}/${limit}`,
    { params: { username, name } },
  )
// 添加一个新的|更新一个用户账号
export const reqSaveOrUpdateUserInfo = (data: User) => {
  if (data.id) {
    return request8212.put<any, StringResponseData>(API.USER_UPDATE_URL, data)
  } else {
    return request8212.post<any, StringResponseData>(API.USER_SAVE_URL, data)
  }
}
// 获取全部职位以及当前用户拥有的职位信息
export const reqAllRole = (id: number) =>
  request8212.get<any, AllRoleResponseData>(API.USER_TO_ASIGN_ROLE_URL + id)
// 根据用户分配角色
export const reqSetUserRole = (data: SetRoleData) =>
  request8212.post<any, StringResponseData>(API.USER_DO_ASIGN_ROLE_URL, data)
// 删除账号
export const reqDeleteUser = (id: number) =>
  request8212.delete<any, StringResponseData>(API.USER_DELETE_URL + id)
// 批量删除
export const reqBatchDeleteUser = (idList: number[]) =>
  request8212.delete<any, StringResponseData>(API.USER_BATCH_DELETE_URL, {
    data: idList,
  })
