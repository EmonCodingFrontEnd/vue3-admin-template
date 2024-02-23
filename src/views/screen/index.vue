<template>
  <div class="container">
    <!--数据大屏展示内容区域-->
    <div class="screen" ref="screen">
      <div class="top">
        <Top></Top>
      </div>
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist"></Tourist>
          <Sex class="sex"></Sex>
          <Age class="age"></Age>
        </div>
        <div class="center">
          <Map class="map"></Map>
          <Line class="line"></Line>
        </div>
        <div class="right">
          <Rank class="rank"></Rank>
          <Year class="year"></Year>
          <Counter class="counter"></Counter>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Screen">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import debounce from 'lodash/debounce'
import Top from '@/views/screen/components/top/index.vue'
// 引入左侧三个组件
import Tourist from '@/views/screen/components/left/tourist/index.vue'
import Sex from '@/views/screen/components/left/sex/index.vue'
import Age from '@/views/screen/components/left/age/index.vue'
// 引入中间两个组件
import Map from '@/views/screen/components/center/map/index.vue'
import Line from '@/views/screen/components/center/line/index.vue'
// 引入右侧三个组件
import Rank from '@/views/screen/components/right/rank/index.vue'
import Year from '@/views/screen/components/right/year/index.vue'
import Counter from '@/views/screen/components/right/counter/index.vue'
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
        height: 1040px;

        display: flex;
        flex-direction: column;

        .tourist {
          flex: 1.2;
        }

        .sex {
          flex: 1;
        }

        .age {
          flex: 1;
        }
      }

      .center {
        flex: 2;
        margin-top: 33px;
        height: 1007px;
        display: flex;
        flex-direction: column;

        .map {
          flex: 3;
        }

        .line {
          flex: 1;
        }
      }

      .right {
        flex: 1;
        height: 1040px;
        display: flex;
        flex-direction: column;

        .rank {
          flex: 1.5;
        }

        .year {
          flex: 1;
        }

        .counter {
          flex: 1;
        }
      }
    }
  }
}
</style>
