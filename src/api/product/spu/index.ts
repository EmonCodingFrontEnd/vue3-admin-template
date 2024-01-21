// 这里书写SPU相关的API文件
import request8209 from '@/utils/request8209'
import { StringResponseData } from '@/api/base'
import type {
  SpuData,
  SpuDataList,
  HasSpuResponseData,
} from '@/api/product/spu/type'

// SPU管理模块接口地址
enum API {
  // 获取已有的SPU的数据
  HASSPU_UR = '/admin/product/',
}

// 获取某一个三级分类下已有的SPU数据
export const reqHasSpu = (page: number, limit: number, c3Id: number) =>
  request8209.get<any, HasSpuResponseData>(
    API.HASSPU_UR + `${page}/${limit}?category3Id=${c3Id}`,
  )
