import pinia from '@/store'
import useUserStore from '@/store/modules/user'

// 这里并不必要引入pinia，因为都是在.vue文件中引用的指令使用的
const userStore = useUserStore(pinia)

export const isHasButtonAuth = (app: any) => {
  // 全局自定义指令：实现按钮的权限控制
  app.directive('auth', {
    // 使用该指令的DOM|组件挂载完毕时执行一次
    mounted(el: any, binding: any) {
      const { value } = binding
      if (!userStore.buttons.includes(value)) {
        el.parentNode.removeChild(el)
      }
    },
  })
}
