<template>
  <div class="top">
    <div class="left">
      <span class="lbtn">首页</span>
    </div>
    <div class="center">
      <div class="title">智慧旅游可视化大数据平台</div>
    </div>
    <div class="right">右侧</div>
  </div>
</template>

<script setup lang="ts" name="Top"></script>

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
      width: 100px;
      height: 40px;
      background: url('../../images/dataScreen-header-btn-bg-l.png') no-repeat;
      background-size: 100% 100%;
      float: right;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
    }
  }

  .center {
    flex: 3;
    //background: url("../../images/dataScreen-header-center-bg.png") no-repeat;
    background-size: cover;

    .title {
      width: 100%;
      height: 74px;
      background: url('../../images/dataScreen-header-center-bg.png') no-repeat;
    }
  }

  .right {
    flex: 1;
    background: url('../../images/dataScreen-header-right-bg.png') no-repeat;
    background-size: cover;
  }
}
</style>
