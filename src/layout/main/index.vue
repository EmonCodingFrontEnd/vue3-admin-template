<template>
  <div>
    <!-- 路由组件出口的位置 -->
    <RouterView v-slot="{ Component }">
      <transition name="fade">
        <!-- 渲染layout一级路由组件的子路由 -->
        <component :is="Component" v-if="flag" />
      </transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts" name="Main">
import { ref, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
// 获取骨架的小仓库
import useLayoutSettingStore from '@/store/modules/setting'

let layoutSettingStore = useLayoutSettingStore()
const { refresh } = storeToRefs(layoutSettingStore)

// 控制当前组件是否销毁重建
let flag = ref(true)
watch(refresh, (ov, nv) => {
  // 点击刷新按钮：路由组件销毁
  flag.value = false
  nextTick(() => {
    flag.value = true
  })
})
</script>

<style scoped lang="scss">
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}

.fade-enter-active {
  transition: all 0.3s;
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
