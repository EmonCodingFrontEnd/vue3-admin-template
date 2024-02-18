<template>
  <div class="sex_box">
    <div class="top">
      <p class="title">男女比例</p>
      <p class="bg"></p>
    </div>
    <div class="sex">
      <div class="man">
        <img src="../../images/man.png" alt="" />
      </div>
      <div class="woman">
        <img src="../../images/woman.png" alt="" />
      </div>
    </div>
    <div class="rate">
      <p>男士58%</p>
      <p>女士42%</p>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts" name="Sex">
// 定义引用
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
    xAxis: { show: false, min: 0, max: 100 },
    yAxis: { show: false, type: 'category' },
    series: [
      {
        type: 'bar',
        data: [78],
        color: 'orange',
        // 柱状图的宽度
        barWidth: 20,
        // 设置背景颜色
        showBackground: true,
        backgroundStyle: { color: '#eee' },
        // 文本标签
        label: {
          show: true,
          // 改变文本标签的内容
          formatter: '|',
          // 文本标签的位置
          position: 'right',
        },
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.sex_box {
  background: url('../../images/dataScreen-main-cb.png') no-repeat;
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

  .sex {
    display: flex;
    justify-content: center;

    .man {
      margin: 20px;
      width: 111px;
      height: 115px;
      background: url('../../images/man-bg.png');
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .woman {
      margin: 20px;
      width: 111px;
      height: 115px;
      background: url('../../images/woman-bg.png');
      background-size: 100% 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .rate {
    display: flex;
    justify-content: space-between;
    color: white;
  }

  .charts {
    width: 100%;
    height: 108px;
  }
}
</style>
