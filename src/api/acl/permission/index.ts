// 菜单管理模块的接口
import request8212 from '@/utils/request8212'
import type { PermissionResponseData } from '@/api/acl/permission/type'
import { PermissionParams } from '@/api/acl/permission/type'
import { StringResponseData } from '@/api/base'

// 枚举地址
enum API {
  // 获取全部的菜单与按钮的标识数据
  PERMISSION_LIST_URL = '/admin/acl/permission',
  // 给某一级菜单新增一个子菜单
  PERMISSION_SAVE_URL = '/admin/acl/permission/save',
  // 更新某一个已有的菜单
  PERMISSION_UPDATE_URL = '/admin/acl/permission/update',
  // 删除某一个菜单
  PERMISSION_DELETE_URL = '/admin/acl/permission/remove/',
}

export const reqPermissionList = () =>
  request8212.get<any, PermissionResponseData>(API.PERMISSION_LIST_URL)
// 新增或更新菜单
export const reqSaveOrUpdatePermission = (data: PermissionParams) => {
  if (data.id) {
    return request8212.put<any, StringResponseData>(
      API.PERMISSION_UPDATE_URL,
      data,
    )
  } else {
    return request8212.post<any, StringResponseData>(
      API.PERMISSION_SAVE_URL,
      data,
    )
  }
}
// 删除菜单
export const reqDeletePermission = (permissionId: number) =>
  request8212.delete<any, StringResponseData>(
    API.PERMISSION_DELETE_URL + permissionId,
  )
