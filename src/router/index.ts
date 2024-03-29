// 通过vue-router插件实现模板路由配置

import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoute } from '@/router/routes'

// 创建路由器
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoute,
  scrollBehavior() {
    return { left: 0, top: 0 }
  }, // 滚动行为
})

export default router
