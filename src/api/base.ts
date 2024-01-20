// 定义全部接口应答数据的基类
export interface ResponseData {
  code: number
  message: string
  ok: string
}

// 定义不需要返回值的应答类型
export interface StringResponseData extends ResponseData {
  data: string
}
