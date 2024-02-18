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
    <div class="chart_content">
      <div class="rate">
        <p>男士 58%</p>
        <p>女士 42%</p>
      </div>
      <div class="charts" ref="charts"></div>
    </div>
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
        data: [58],
        // 柱状图的宽度
        barWidth: 20,
        z: 5,
        itemStyle: {
          color: '#007afe',
          borderRadius: 20,
        },
      },
      {
        type: 'bar',
        data: [100],
        // 柱状图的宽度
        barWidth: 20,
        // 调整女士柱条位置
        barGap: '-100%',
        itemStyle: {
          color: '#ff4b7a',
          borderRadius: 20,
        },
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.sex_box {
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
  }

  .sex {
    display: flex;
    justify-content: center;
    margin-top: 40px;

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

  .chart_content {
    display: flex;
    flex-direction: column;
    align-items: center;

    .rate {
      width: 80%;
      display: flex;
      justify-content: space-between;
      color: white;
    }

    .charts {
      width: 80%;
      height: 64px;
    }
  }
}
</style>
