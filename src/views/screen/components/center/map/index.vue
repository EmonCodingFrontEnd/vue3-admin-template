<template>
  <div class="map_box" ref="charts">我是地图组件</div>
</template>

<script setup lang="ts" name="Map">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

// 定义引用
const charts = ref()
onMounted(() => {
  // 获取echarts类的实例对象
  const myChart = echarts.init(charts.value)
  // 设置实例的配置项
  myChart.setOption({})
})
</script>

<style scoped lang="scss">
.map_box {
  background-color: pink;
}
</style>
