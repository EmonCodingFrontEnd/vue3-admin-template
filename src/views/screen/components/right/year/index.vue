<template>
  <div class="year_box">
    <div class="top">
      <p class="title">年度游客量对比</p>
      <p class="bg"></p>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts" name="Year">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const charts = ref()
onMounted(() => {
  // 获取echarts类的实例对象
  const myChart = echarts.init(charts.value)
  // 设置实例的配置项
  myChart.setOption({
    // 布局组件
    grid: { left: 0, right: 0, top: 35, bottom: 0, containLabel: true },
    title: {
      text: '散点图',
      left: 'center',
      textStyle: {
        color: 'white',
        fontSize: 20,
      },
    },
    xAxis: { type: 'category' },
    yAxis: {
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        type: 'scatter',
        data: [
          33, 880, 201, 9, 78, 234, 1213, 1314, 6677, 3, 808, 765, 1002, 7698,
          1, 3002, 1123, 100, 20, 65, 29, 990, 3000, 5210, 3222, 182, 3208,
        ],
        // 标签
        label: {
          show: true,
          position: 'top',
          color: 'white',
        },
        // 标记图形
        symbol: 'diamond',
        symbolSize: function (data: any) {
          return Math.floor((Math.random() * data) % 50)
        },
        itemStyle: {
          color: function (data: any) {
            const colors = [
              'green',
              'red',
              'blue',
              'yellow',
              'orange',
              'purple',
              'pink',
              'black',
              'white',
              'gray',
              'brown',
              'cyan',
              'pink',
              'purple',
              'orange',
              'yellow',
              'green',
              'red',
              'blue',
              'white',
              'gray',
              'brown',
              'cyan',
            ]
            return colors[data.dataIndex]
          },
        },
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.year_box {
  width: 100%;
  height: 100%;
  background: url('../../../images/dataScreen-main-rc.png') no-repeat;
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
    width: 100%;
    height: 216px;
    margin-top: 25px;
  }
}
</style>
