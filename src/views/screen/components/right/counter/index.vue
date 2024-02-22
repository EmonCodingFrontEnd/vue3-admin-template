<template>
  <div class="counter_box">
    <div class="top">
      <p class="title">数据统计</p>
      <p class="bg"></p>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts" name="Counter">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const charts = ref()
onMounted(() => {
  // 获取echarts类的实例对象
  const myChart = echarts.init(charts.value)
  // 设置实例的配置项
  myChart.setOption({
    title: {
      text: '游客消费统计',
      textStyle: {
        color: '#fff',
      },
    },
    legend: {
      right: 10,
      textStyle: {
        color: '#fff',
      },
      data: ['购物', '吃饭'],
    },
    // 提示框组件
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}',
    },
    toolbox: {
      data: ['购物', '吃饭'],
    },
    // 雷达图坐标系组件，只适用于雷达图
    radar: {
      // shape: 'circle',
      // 雷达图的指示器，用来指定雷达图中多个变量（维度）
      indicator: [
        { name: '消费', max: 6500, color: 'yellowgreen' },
        { name: '好感度', max: 16000, color: 'ivory' },
        { name: '出行方式', max: 30000, color: 'skyblue' },
        { name: '小吃', max: 38000, color: 'cyan' },
        { name: '爱好', max: 52000, color: 'olive' },
        { name: '经典', max: 25000, color: 'hotpink' },
      ],
    },
    series: [
      {
        name: '预算 vs 开销',
        type: 'radar',
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: '购物',
            itemStyle: {
              color: 'rgb(145, 213, 134)',
            },
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: '吃饭',
            itemStyle: { color: 'rgb(255, 102, 0)' },
          },
        ],
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.counter_box {
  width: 100%;
  height: 100%;
  background: url('../../../images/dataScreen-main-rb.png') no-repeat;
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
