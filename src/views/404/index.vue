<template>
  <div class="box">
    <img src="../../assets/images/error_images/404.png" alt="" />
    <el-button
      type="primary"
      @click="goHome"
      style="width: 100px; height: 100px"
    >
      回首页
    </el-button>
  </div>
</template>

<script setup lang="ts" name="404">
import { useRouter } from 'vue-router'

let router = useRouter()

const goHome = () => {
  router.push('/home')
}
</script>

<style scoped lang="scss">
.box {
  width: 100vw;
  height: 100vh;
  background: yellowgreen;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 1014px;
    height: 556px;
  }
}
</style>
