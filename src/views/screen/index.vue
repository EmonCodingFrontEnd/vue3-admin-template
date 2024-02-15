<template>
  <div class="container">
    <!--数据大屏展示内容区域-->
    <div class="screen" ref="screen">
      <div class="top">
        <Top></Top>
      </div>
      <div class="bottom">
        <div class="left">左侧</div>
        <div class="center">中间</div>
        <div class="right">右侧</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Screen">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as debounce from 'lodash/debounce'
import Top from '@/views/screen/components/top/index.vue'

// 获取数据大屏展示内容盒子的DOM元素
const screen = ref()

// 定义大屏缩放比例
function getScale(w = 1920, h = 1080) {
  const ww = window.innerWidth / w
  const wh = window.innerHeight / h
  return Math.min(ww, wh)
}

// 根据屏幕自动计算
const handleFn = debounce(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
}, 10)
onMounted(() => {
  setTimeout(handleFn, 0)
  window.addEventListener('resize', handleFn)
})
onBeforeUnmount(() => window.removeEventListener('resize', handleFn))
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url('images/bg.png') no-repeat;
  background-size: cover;

  .screen {
    width: 1920px;
    height: 1080px;

    position: fixed;
    left: 50%;
    top: 50%;
    transform-origin: left top;

    .top {
      width: 100%;
      height: 40px;
    }

    .bottom {
      display: flex;

      .left {
        flex: 1;
        background-color: #8c939d;
      }

      .center {
        flex: 2;
        background-color: #303133;
      }

      .right {
        flex: 1;
        background-color: skyblue;
      }
    }
  }
}
</style>
