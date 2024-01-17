<template>
  <div>
    <h1 ref="home">我是一级路由，负责展示登录成功以后的数据！</h1>
  </div>
</template>

<script setup lang="ts" name="Home">
// 引入组合式API函数之生命周期函数
import { ref } from 'vue'
let home = ref()
</script>

<style scoped lang='scss'></style>
