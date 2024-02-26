// 创建用户相关的小仓库
import { defineStore } from 'pinia'
// 引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
// 引入数据类型
import type { UserState } from '@/store/modules/types/type'
// 引入操作本地存储的工具方法
import { GET_TOKEN, SET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入路由
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'
import setting from '@/setting'
import {
  LoginFormData,
  LoginResponseData,
  UserInfoResponseData,
  LogoutResponseData,
} from '@/api/user/type'
import router from '@/router' // .js/.ts/.vue中获取路由器对象router的方式
import cloneDeep from 'lodash/cloneDeep' // [lm's ps]: 20240226 17:28 为了编译通过而调整

// 创建用户小仓库
const useUserStore = defineStore('UserStore', {
  // 小仓库存储数据地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(), // 用户唯一标识
      menuRoutes: constantRoute, // 仓库存储生成菜单需要数组（路由）
      username: '',
      avatar: '',
      buttons: [], // 用户的按钮权限
    }
  },
  // 异步|逻辑的地方
  actions: {
    // 用户登录的方法
    async userLogin(data: LoginFormData) {
      const result: LoginResponseData = await reqLogin(data)
      // mockLogin: true时，若登录服务器返回的code不是200，那么就模拟一个成功的响应
      if (setting.mockLogin && 200 !== result.code) {
        result.code = 200
        result.data = '123'
      }
      if (200 === result.code) {
        // 由于pinia|vuex存储数据其实利用js对象
        this.token = result.data as string
        // 本地持久化存储
        SET_TOKEN(this.token)
        // 能保证当前async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data || result.message))
      }
    },
    // 获取用户信息的方法
    async userInfo() {
      /**
       * @description 过滤异步路由
       * @param asyncRoute
       * @param routes
       */
      function filterAsyncRoute(asyncRoute: any, routes: any) {
        return asyncRoute.filter((item) => {
          if (routes.includes(item.name)) {
            if (item.children && item.children.length > 0) {
              item.children = filterAsyncRoute(item.children, routes)
            }
            return true
          }
          return false
        })
      }

      // 获取用户信息进行存储仓库[用户头像、名字】
      const result: UserInfoResponseData = await reqUserInfo()
      // mockLogin: true时，若登录服务器返回的code不是200，那么就模拟一个成功的响应
      if (setting.mockLogin && 200 !== result.code) {
        result.code = 200
        result.data = {
          name: '李明',
          avatar: 'abc',
          routes: [],
          buttons: [],
          roles: [],
        }
        result.data.routes = [
          'Acl',
          'User',
          'Role',
          'Permission',
          'Product',
          'Attr',
          'Spu',
          'Sku',
        ]
      }
      if (200 === result.code) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        this.buttons = result.data.buttons

        // 深度拷贝解决异步路由被改变的问题
        const copiedAsyncRoute = cloneDeep(asyncRoute)
        const filteredAsyncRoute = filterAsyncRoute(
          copiedAsyncRoute,
          result.data.routes,
        )
        // 菜单渲染需要的数据
        this.menuRoutes = [...constantRoute, ...filteredAsyncRoute, ...anyRoute]
        // 目前路由器管理的只有常量路由：用户计算完毕异步路由、任意路由动态追加
        ;[...filteredAsyncRoute, ...anyRoute].forEach((item: any) => {
          router.addRoute(item)
        })
        // 能保证当前async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message as string))
      }
    },
    // 退出登录
    async userLogout() {
      const result: LogoutResponseData = await reqLogout()
      if (200 === result.code) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message as string))
      }
    },
  },
  // 计算属性
  getters: {},
})

// 对外暴露获取小仓库的方法
export default useUserStore
