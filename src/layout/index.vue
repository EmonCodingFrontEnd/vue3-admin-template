<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider">
      <Logo></Logo>
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          background-color="#001529"
          text-color="white"
          :router="false"
          :collapse="fold"
          :collapse-transition="true"
          :default-active="currentPath"
          active-text-color="yellowgreen"
        >
          <!-- 根据路由动态生成菜单 -->
          <Menu :menuList="menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar" :class="{ fold }">
      <Tabbar></Tabbar>
    </div>
    <!-- 内容展示区 -->
    <div class="layout_main" :class="{ fold }">
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts" name="Layout">
// 引入路由
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
// 引入左侧菜单logo子组件
import Logo from '@/layout/logo/index.vue'
// 引入顶部组件
import Tabbar from '@/layout/tabbar/index.vue'
// 引入菜单组件
import Menu from '@/layout/menu/index.vue'
// 引入右侧内容展示区组件
import Main from '@/layout/main/index.vue'
// 获取用户相关的小仓库
import useUserStore from '@/store/modules/user'
// 获取layout配置相关的仓库
import useLayoutSettingStore from '@/store/modules/setting'

let userStore = useUserStore()
const { menuRoutes } = storeToRefs(userStore)

// 获取路由对象
let route = useRoute()
let currentPath = route.path

let layoutSettingStore = useLayoutSettingStore()
const { fold } = storeToRefs(layoutSettingStore)
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    color: white;
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    transition: all 0.3s;

    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);

      .el-menu {
        border-right: none;
      }
    }
  }

  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    left: $base-menu-width;
    top: 0px;
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }

  .layout_main {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: calc(100% - $base-tabbar-height);
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
</style>
