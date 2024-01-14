// 封装本地存储与读取以及删除数据的方法
export const SET_TOKEN = (token: string) => {
  localStorage.setItem('TOKEN', token)
}
export const GET_TOKEN = (): string => {
  return localStorage.getItem('TOKEN') || ''
}
export const REMOVE_TOKEN = () => {
  localStorage.removeItem('TOKEN')
}
