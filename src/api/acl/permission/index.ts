// 菜单管理模块的接口
import request8212 from '@/utils/request8212'
import type { PermissionResponseData } from '@/api/acl/permission/type'

// 枚举地址
enum API {
  PERMISSION_LIST_URL = '/admin/acl/permission',
}

export const reqPermissionList = () =>
  request8212.get<any, PermissionResponseData>(API.PERMISSION_LIST_URL)
