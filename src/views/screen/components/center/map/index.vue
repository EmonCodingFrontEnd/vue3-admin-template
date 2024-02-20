<template>
  <div class="map_box">
    <div class="top">
      <div>
        <p class="title">平台高峰预警信息</p>
        <p class="bg"></p>
      </div>
    </div>
    <div class="content">
      <div class="chart_title">景区实时客流量</div>
      <div class="charts" ref="charts"></div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Map">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import chainJSON from './china.json'

// http://datav.aliyun.com/portal/school/atlas/area_selector
// https://www.isqqw.com/
// 定义引用
const charts = ref()
// 注册地图
echarts.registerMap('china', chainJSON)
onMounted(() => {
  // 获取echarts类的实例对象
  const myChart = echarts.init(charts.value)
  // 设置实例的配置项
  myChart.setOption({
    // 地图组件
    geo: {
      map: 'china',
      roam: 'scale', // 鼠标缩放的效果
      scaleLimit: {
        min: 1,
        max: 3,
      },
      zoom: 1.5,
      top: 150,
      label: {
        show: true,
        color: 'rgb(105,224,218)',
        fontSize: 14,
      },
      // 每一个多边形的样式
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgb(0,119,254)', // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'rgb(0,254,186)', // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
        opacity: 0.5,
      },
      // 高亮状态下的多边形和标签样式。
      emphasis: {
        itemStyle: { color: 'rgb(36,207,21)' },
        label: {
          fontSize: 20,
        },
      },
    },
    // 布局组件
    grid: { left: 0, top: 0, right: 0, bottom: 0 },
    series: [
      {
        type: 'lines', // 航线系列
        // 线的特效配置
        effect: {
          show: true, // 是否显示特效
          period: 4, // 特效动画的周期，秒数
          trailLength: 0.2, // 特效尾迹的长度。取从 0 到 1 的值，数值越大尾迹越长。
          symbol: 'arrow', // 特效图形的标记
          symbolSize: 20, // 特效标记的大小
          color: 'rgb(36,207,21)', // 特效标记的颜色
        },
        data: [
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [87.617733, 43.792818], // 终点
            ],
            // 统一的样式设置
            lineStyle: {
              color: 'rgb(80,172,221)',
              width: 1,
              type: 'solid',
              curveness: 0.1,
            },
          },
          {
            coords: [
              [87.617733, 43.792818],
              [116.405285, 39.904989],
            ],
            lineStyle: {
              color: 'rgb(80,172,221)',
              width: 1,
              type: 'solid',
              curveness: 0.1,
            },
          },
          {
            coords: [
              [116.405285, 39.904989],
              [110.33119, 20.031971],
            ],
            lineStyle: {
              color: 'rgb(80,172,221)',
              width: 1,
              type: 'solid',
              curveness: 0.1,
            },
          },
          {
            coords: [
              [104.065735, 30.659462],
              [91.132212, 29.660361],
            ],
            lineStyle: {
              color: 'rgb(80,172,221)',
              width: 1,
              type: 'solid',
              curveness: 0.1,
            },
          },
          {
            coords: [
              [101.778916, 36.623178],
              [126.642464, 45.756967],
            ],
            lineStyle: {
              color: 'rgb(80,172,221)',
              width: 1,
              type: 'solid',
              curveness: 0.1,
            },
          },
        ],
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.map_box {
  width: 100%;

  .top {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

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

  .content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    .chart_title {
      width: 520px;
      height: 30px;
      line-height: 30px;
      margin-top: 10px;
      margin-left: 20px;
      padding-left: 20px;
      color: white;
      background: url(../../../images/map-title-bg.png) no-repeat;
      background-size: 100% 100%;
    }

    .charts {
      width: 100%;
      height: calc(100% - 20px);
    }
  }
}
</style>
