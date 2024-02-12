<template>
  <div
    class="tabbar"
    :class="{ theme_normal: !themeDark, theme_dark: themeDark }"
  >
    <div class="tabbar_left">
      <Breadcrumb></Breadcrumb>
    </div>
    <div class="tabbar_right">
      <Setting></Setting>
    </div>
  </div>
</template>

<script setup lang="ts" name="Tabbar">
import Breadcrumb from '@/layout/tabbar/breadcrumb/index.vue'
import Setting from '@/layout/tabbar/setting/index.vue'
// 获取layout配置相关的仓库
import useLayoutSettingStore from '@/store/modules/setting'
import { storeToRefs } from 'pinia'

let layoutSettingStore = useLayoutSettingStore()
const { themeDark } = storeToRefs(layoutSettingStore)
</script>

<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;

  .tabbar_left {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }

  .tabbar_right {
    display: flex;
    align-items: center;
  }

  &.theme_normal {
    background-image: linear-gradient(
      to right,
      rgb(232, 223, 223),
      rgb(156, 190, 164),
      rgb(197, 165, 165)
    );
  }

  &.theme_dark {
    background-image: linear-gradient(
      to right,
      rgb(38, 35, 35),
      rgb(21, 35, 25),
      rgb(135, 130, 130)
    );
  }
}
</style>
