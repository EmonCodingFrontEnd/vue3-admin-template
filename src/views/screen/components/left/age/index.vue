<template>
  <div class="age_box">
    <div class="top">
      <p class="title">年龄比例</p>
      <p class="bg"></p>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts" name="Age">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const charts = ref()
onMounted(() => {
  // 获取echarts类的实例对象
  const myChart = echarts.init(charts.value)
  // 设置实例的配置项
  myChart.setOption({
    // 布局组件
    grid: { left: 0, top: 0, right: 0, bottom: 0 },
    tooltip: {
      trigger: 'item',
    },
    // 图例组件
    legend: {
      top: 'middle',
      right: 20,
      orient: 'vertical',
      textStyle: {
        color: 'white',
        fontSize: 18,
      },
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        // 是否启用防止标签重叠策略，默认开启
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: 'cyan',
          borderWidth: 1,
        },
        label: {
          show: true,
          position: 'inside',
          color: 'white',
        },
        data: [
          { value: 1048, name: '军事' },
          { value: 735, name: '新闻' },
          { value: 580, name: '直播' },
          { value: 484, name: '娱乐' },
          { value: 300, name: '财经' },
        ],
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.age_box {
  background: url('../../../images/dataScreen-main-lb.png') no-repeat;
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
      background: url(../../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }
  }

  .charts {
    margin-top: 40px;
    width: 100%;
    height: 235px;
  }
}
</style>
