// 小仓库：layout组件相关配置仓库
import { defineStore } from 'pinia'
// 引入操作本地存储的工具方法
import { GET_THEME, SET_THEME, REMOVE_THEME } from '@/utils/theme'

const useLayoutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, // 用于控制菜单折叠还是收起
      refresh: false, // 仓库这个属性用于控制刷新效果
      themeDark: GET_THEME(), // 是否开启暗黑模式
    }
  },
  actions: {
    // 用于设置暗黑模式
    setThemeDark(val: boolean) {
      this.themeDark = val
      SET_THEME(val)
    },
  },
})

export default useLayoutSettingStore
