<template>
  <!-- 顶部左侧 -->
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component :is="fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <!-- 顶部左侧面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 面包屑动态展示路由名字与标题 -->
    <template v-for="item in route.matched" :key="item.path">
      <el-breadcrumb-item v-if="item.meta.title" :to="item.path">
        <div style="display: flex; align-items: center">
          <!-- 面包屑展示匹配路由的图标 -->
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <!-- 面包屑展示匹配路由的标题 -->
          <span>{{ item.meta.title }}</span>
        </div>
      </el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<script setup lang="ts" name="Breadcrumb">
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
// 获取layout配置相关的仓库
import useLayoutSettingStore from '@/store/modules/setting'

let layoutSettingStore = useLayoutSettingStore()
const { fold } = storeToRefs(layoutSettingStore)

// 点击图标的方法
const changeIcon = () => {
  fold.value = !fold.value
}

// 获取路由对象
let route = useRoute()
const handle = () => {
  console.log(route.matched)

  alert(JSON.stringify(route.meta))
}
</script>

<style scoped lang="scss"></style>
