<template>
  <div class="rank_box">
    <div class="top">
      <p class="title">热门景区排行</p>
      <p class="bg"></p>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts" name="Rank">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const charts = ref()
onMounted(() => {
  // 一个容器可以同时展示多种类型的图表
  // 获取echarts类的实例对象
  const myChart = echarts.init(charts.value)
  // 设置实例的配置项
  myChart.setOption({
    // 布局组件
    grid: { left: 0, right: 0, top: 55, bottom: 0, containLabel: true },
    title: {
      text: '景区排行',
      link: 'https://www.baidu.com',
      left: 'center',
      textStyle: {
        color: 'white',
        fontSize: 20,
      },
      subtext: '各大景区排行',
      subtextStyle: {
        color: 'white',
        fontSize: 16,
      },
    },
    xAxis: {
      // 设置x轴均匀分布
      type: 'category',
    },
    yAxis: {
      splitLine: {
        show: false,
      },
    },
    // 系列：决定显示图形图表是哪一种的
    series: [
      {
        type: 'bar',
        data: [10, 60, 30, 80, 150, 60, 20, 80, 15, 100],
        // 坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
        boundaryGap: false,
        // 柱状图的：图形上的文本标签
        label: {
          show: true,
          position: 'insideTop',
          color: 'rgb(255,255,255)',
          fontSize: 14,
          fontWeight: 'bold',
        },
        // 图形样式。
        itemStyle: {
          color: function (data: any) {
            const arr = [
              'red',
              'orange',
              'yellowgreen',
              'hotpink',
              'purple',
              'pink',
              'black',
              'white',
              'gray',
              'rgb(0,119,254)',
            ]
            return {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: arr[data.dataIndex], // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgb(0,254,186)', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            }
          },
          opacity: 0.9,
          borderRadius: [5, 5, 0, 0],
        },
        // 是否显示背景颜色
        showBackground: true,
        backgroundStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgb(36,207,21)', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgb(135,130,130)', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
          opacity: 0.3,
        },
      },
      {
        type: 'line',
        data: [10, 60, 30, 80, 150, 60, 20, 80, 15, 10],
        smooth: true,
        itemStyle: {
          color: function (data: any) {
            const arr = [
              'red',
              'orange',
              'yellowgreen',
              'hotpink',
              'purple',
              'pink',
              'black',
              'white',
              'gray',
              'rgb(0,119,254)',
            ]
            return arr[data.dataIndex]
          },
        },
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.rank_box {
  width: 100%;
  height: 100%;
  background: url('../../../images/dataScreen-main-rt.png') no-repeat;
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
    height: 346px;
    margin-top: 35px;
  }
}
</style>
