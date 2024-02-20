<template>
  <div class="line_box">
    <div class="top">
      <p class="title">未来7天游客量趋势图</p>
      <p class="bg"></p>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts" name="Line">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

// 定义引用
const charts = ref()
onMounted(() => {
  // 获取echarts类的实例对象
  const myChart = echarts.init(charts.value)
  // 设置实例的配置项
  myChart.setOption({
    // 布局组件
    grid: { left: 0, top: 15, right: 15, bottom: 0, containLabel: true },
    // 标题组件
    title: {
      text: '游客访问量趋势图',
      left: 'center',
      top: '50',
      textStyle: {
        color: 'white',
        fontSize: 16,
      },
    },
    xAxis: {
      type: 'category', // 设置在x轴均匀分布
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      // 坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
      boundaryGap: false,
      // 坐标轴在 grid 区域中的分隔线。
      splitLine: {
        show: false,
      },
      // 坐标轴轴线相关设置
      axisLine: {
        show: true,
      },
      // 轴线刻度
      axisTick: {
        show: true,
      },
    },
    yAxis: {
      type: 'value',
      // 坐标轴在 grid 区域中的分隔线。
      splitLine: {
        show: false,
      },
      // 坐标轴轴线相关设置
      axisLine: {
        show: true,
      },
      // 轴线刻度
      axisTick: {
        show: true,
      },
    },
    series: [
      {
        data: [120, 800, 66, 960, 321, 890, 1200],
        type: 'line',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgb(214,133,34)', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgb(135,130,130)', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.line_box {
  width: calc(100% - 20px);
  background: url('../../../images/dataScreen-main-cb.png') no-repeat;
  background-size: 100% 100%;
  margin: 0 10px;

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
    height: 178px;
  }
}
</style>
