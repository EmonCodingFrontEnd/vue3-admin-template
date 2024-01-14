// 创建用户相关的小仓库
import { defineStore } from 'pinia'
// 引入接口
import { reqLogin, reqUserInfo } from '@/api/user'
// 引入数据类型
import type { LoginForm, LoginResponseData } from '@/api/user/type'
import type { UserState } from '@/store/modules/types/type'
// 引入操作本地存储的工具方法
import { GET_TOKEN, SET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入路由
import { constantRoute } from '@/router/routes'
import { UserResponseData } from '@/api/user/type'

// 创建用户小仓库
let useUserStore = defineStore('UserStore', {
  // 小仓库存储数据地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(), // 用户唯一标识
      menuRoutes: constantRoute, // 仓库存储生成菜单需要数组（路由）
      username: '',
      avatar: '',
    }
  },
  // 异步|逻辑的地方
  actions: {
    // 用户登录的方法
    async userLogin(data: LoginForm) {
      let result: LoginResponseData = await reqLogin(data)
      if (200 === result.code) {
        // 由于pinia|vueex存储数据其实利用js对象
        this.token = result.data.token as string
        // 本地持久化存储
        SET_TOKEN(this.token)
        // 能保证当前async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data.message as string))
      }
    },
    // 获取用户信息的方法
    async userInfo(): UserResponseData {
      // 获取用户信息进行存储仓库[用户头像、名字】
      let result = await reqUserInfo()
      if (200 === result.code) {
        this.username = result.data.checkUser.username
        this.avatar = result.data.checkUser.avatar
        // 能保证当前async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data.message as string))
      }
    },
    // 退出登录
    userLogout(): void {
      // 目前没有mock接口：退出登录接口（通知服务器本地用户唯一标识失效）
      this.token = ''
      this.username = ''
      this.avatar = ''
      REMOVE_TOKEN()
    },
  },
  // 计算属性
  getters: {},
})

// 对外暴露获取小仓库的方法
export default useUserStore