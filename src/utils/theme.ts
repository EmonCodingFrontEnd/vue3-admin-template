// 封装本地存储与读取以及删除数据的方法
export const SET_THEME = (themeDark: boolean) => {
  localStorage.setItem('THEME', themeDark.toString())
}
export const GET_THEME = (): boolean => {
  return localStorage.getItem('THEME') !== 'false'
}
export const REMOVE_THEME = () => {
  localStorage.removeItem('THEME')
}
