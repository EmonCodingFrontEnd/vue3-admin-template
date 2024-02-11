// 角色管理模块的接口
import request8212 from '@/utils/request8212'
import type { StringResponseData } from '@/api/base'
import type {
  Role,
  RoleResponseData,
  MenuResponseData,
  RolePermission,
} from '@/api/acl/role/type'

// 枚举地址
enum API {
  ROLE_LIST_URL = '/admin/acl/role/',
  // 添加一个新的用户账号
  ROLE_SAVE_URL = '/admin/acl/role/save',
  // 更新一个新的用户账号
  ROLE_UPDATE_URL = '/admin/acl/role/update',
  // 删除账号
  ROLE_DELETE_URL = '/admin/acl/role/remove/',
  // 获取全部的菜单与按钮的数据
  ROLE_PERMISSION_URL = '/admin/acl/permission/toAssign/',
  // 为角色分配角色权限
  ROLE_ASSIGN_URL = '/admin/acl/permission/doAssignAcl',
}

// 获取全部已有角色信息的方法
export const reqRoleList = (page: number, limit: number, roleName = '') =>
  request8212.get<any, RoleResponseData>(
    API.ROLE_LIST_URL + `${page}/${limit}`,
    { params: { roleName } },
  )
// 添加一个新的|更新一个角色
export const reqSaveOrUpdateRoleInfo = (data: Role) => {
  if (data.id) {
    return request8212.put<any, StringResponseData>(API.ROLE_UPDATE_URL, data)
  } else {
    return request8212.post<any, StringResponseData>(API.ROLE_SAVE_URL, data)
  }
}
// 删除角色
export const reqDeleteRole = (roleId: number) =>
  request8212.delete<any, StringResponseData>(API.ROLE_DELETE_URL + roleId)
// 获取全部的菜单与按钮的数据
export const reqRolePermission = (roleId: number) =>
  request8212.get<any, MenuResponseData>(API.ROLE_PERMISSION_URL + roleId)
// 为角色分配角色权限
export const reqAssignRolePermission = (data: RolePermission) =>
  request8212.post<any, StringResponseData>(API.ROLE_ASSIGN_URL, data)
