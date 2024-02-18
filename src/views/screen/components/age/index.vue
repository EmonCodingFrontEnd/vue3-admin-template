<template>
  <div class="age_box">
    <div class="top">
      <p class="title">年龄比例</p>
      <p class="bg"></p>
    </div>
  </div>
</template>

<script setup lang="ts" name="Age"></script>

<style scoped lang="scss">
.age_box {
  background: url('../../images/dataScreen-main-rb.png') no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;

  .top {
    margin-left: 20px;

    .title {
      color: white;
      font-size: 20px;
    }

    .bg {
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }
  }
}
</style>
