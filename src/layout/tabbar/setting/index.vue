<template>
  <el-button
    size='small'
    icon='Refresh'
    circle
    type='success'
    @click='updateRefresh'
  ></el-button>
  <el-button
    size='small'
    icon='FullScreen'
    circle
    type='warning'
    @click='fullScreen'
  ></el-button>
  <el-button size='small' icon='Setting' circle type='primary'></el-button>
  <img
    :src='userStore.avatar'
    style='width: 24px; height: 24px; margin: 0px 10px; border-radius: 50%'
  />

  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class='el-dropdown-link'>
      {{ userStore.username }}
      <el-icon class='el-icon--right'>
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click='logout'>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang='ts' name='Setting'>
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
// 获取用户相关的小仓库
import useUserStore from '@/store/modules/user'
// 获取骨架的小仓库
import useLayoutSettingStore from '@/store/modules/setting'

let router = useRouter() // 路由器对象
let route = useRoute() // 路由对象
let userStore = useUserStore()

let layoutSettingStore = useLayoutSettingStore()
const { refresh } = storeToRefs(layoutSettingStore)
// 刷新按钮点击回调
const updateRefresh = () => {
  refresh.value = !refresh.value
}

// 全屏按钮点击回调
const fullScreen = () => {
  // DOM对象的一个属性：可以用来判断当前是不是全屏模式：true-是；false-否。
  let full = document.fullscreenElement
  if (!full) {
    // 利用文档根节点的方法实现全屏模式
    document.documentElement.requestFullscreen()
  } else {
    // 退出全屏模式
    document.exitFullscreen()
  }
}

// 退出登录点击回调
const logout = async () => {
  // 第一件事：需要向服务器发送请求[退出登录接口]
  // 第二件事情：仓库当中关于用户相关的数据清空[token|username|avatar]
  await userStore.userLogout()
  // 第三件事情：跳转到登录页面
  router.push({ path: '/login', query: { redirect: route.path } })
}
</script>

<style scoped lang='scss'></style>
