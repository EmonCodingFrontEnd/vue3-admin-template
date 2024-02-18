<template>
  <div class="top">
    <div class="left">
      <span class="lbtn" @click="goHome">首页</span>
    </div>
    <div class="center">
      <div class="title">智慧旅游可视化大数据平台</div>
    </div>
    <div class="right">
      <span class="rbtn">统计报告</span>
      <span class="time">当前时间：{{ time }}</span>
    </div>
  </div>
</template>

<script setup lang="ts" name="Top">
import { useRouter } from 'vue-router'
import moment from 'moment'
import { onBeforeUnmount, onMounted, ref } from 'vue'

let router = useRouter()

const goHome = () => {
  router.push('/home')
}

const time = ref<string>(moment().format('YYYY-MM-DD HH:mm:ss'))
let timerId
onMounted(() => {
  timerId = setInterval(
    () => (time.value = moment().format('YYYY-MM-DD HH:mm:ss')),
    1000,
  )
})
onBeforeUnmount(() => clearInterval(timerId))
</script>

<style scoped lang="scss">
.top {
  width: 100%;
  height: 40px;
  display: flex;

  .left {
    flex: 1;
    background: url('../../images/dataScreen-header-left-bg.png') no-repeat;
    background-size: cover;

    .lbtn {
      width: 150px;
      height: 40px;
      background: url('../../images/dataScreen-header-btn-bg-l.png') no-repeat;
      background-size: 100% 100%;
      float: right;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
      font-size: 20px;
      cursor: pointer;
    }
  }

  .center {
    flex: 2;

    .title {
      width: 100%;
      height: 74px;
      background: url('../../images/dataScreen-header-center-bg.png') no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 74px;
      color: #29fcff;
      font-size: 30px;
    }
  }

  .right {
    flex: 1;
    background: url('../../images/dataScreen-header-right-bg.png') no-repeat;
    background-size: cover;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .rbtn {
      width: 150px;
      height: 40px;
      background: url('../../images/dataScreen-header-btn-bg-r.png') no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
      font-size: 20px;
    }

    .time {
      color: #29fcff;
      font-size: 16px;
      margin-right: 20px;
    }
  }
}
</style>
