<template>
  <div class="tourist_box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">
        可预约总量
        <span>99999</span>
        人
      </p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <!--盒子将来echarts展示图形图标的节点-->
    <div class="charts" ref="charts">123</div>
  </div>
</template>

<script setup lang="ts" name="Tourist">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import 'echarts-liquidfill'

const people = ref('216908人')

// 定义引用
const charts = ref()
onMounted(() => {
  // 获取echarts类的实例对象
  const myChart = echarts.init(charts.value)
  // 设置实例的配置项
  myChart.setOption({
    // 布局组件
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    // 标题组件
    title: {
      text: '水球图',
      left: 'center',
      top: '50',
      textStyle: {
        color: 'white',
        fontSize: 16,
      },
    },
    // 系列组件
    series: [
      {
        type: 'liquidFill',
        data: [0.6, { value: 0.5, direction: 'left' }, 0.4, 0.3],
        color: ['#15cf78', '#cf5f15', '#24cf15', '#d68522'],
        itemStyle: {
          opacity: 1,
          shadowBlur: 30,
          shadowColor: 'rgb(21,207,120)',
        },
        waveAnimation: true,
        animationDuration: 2000,
        animationDurationUpdate: 0,
        radius: '90%',
        backgroundStyle: {
          color: '#0c2649',
          borderWidth: 3,
          borderColor: 'rgb(36,207,21)',
          shadowBlur: 50,
          shadowColor: 'cyan',
          // itemStyle: {
          //   opacity: 1,
          //   shadowBlur: 30,
          //   shadowColor: 'rgb(161,21,207)',
          // },
        },
        outline: {
          borderDistance: 8,
          itemStyle: {
            opacity: 1,
            borderColor: 'cyan',
            borderWidth: 3,
            shadowBlur: 50,
            shadowColor: 'cyan',
            borderType: [5, 10, 15, 20],
          },
        },
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.tourist_box {
  background: url('../../images/dataScreen-main-lb.png') no-repeat;
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

    .right {
      float: right;
      color: white;
      font-size: 16px;
      margin-right: 10px;

      span {
        color: #ff6600;
      }
    }
  }

  .number {
    display: flex;
    margin: 50px 20px 0;

    span {
      flex: 1;
      height: 47px;
      text-align: center;
      line-height: 47px;
      background: url('../../images/total.png') no-repeat;
      background-size: 100% 100%;
      color: #29fcff;
      font-size: 30px;
    }
  }

  .charts {
    width: 100%;
    height: 251px;
  }
}
</style>
