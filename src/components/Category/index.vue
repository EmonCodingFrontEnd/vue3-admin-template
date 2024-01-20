<template>
  <el-card>
    <el-form :inline="true" label-width="100px">
      <el-form-item label="一级分类：">
        <el-select
          v-model="c1Id"
          @change="handlerC1"
          :disabled="globalDisabled"
        >
          <el-option
            v-for="c1 in c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类：">
        <el-select
          v-model="c2Id"
          @change="handlerC2"
          :disabled="globalDisabled"
        >
          <el-option
            v-for="c2 in c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类：">
        <el-select v-model="c3Id" :disabled="globalDisabled">
          <el-option
            v-for="c3 in c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts" name="Category">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import useCategoryStore from '@/store/modules/category'

const globalDisabled = ref<boolean>(false)
const setDisabled = (disabled: boolean) => {
  globalDisabled.value = disabled
}
defineExpose({ setDisabled })

const categoryStore = useCategoryStore()
const { c1Arr, c1Id, c2Arr, c2Id, c3Arr, c3Id } = storeToRefs(categoryStore)

// 分类全局组件挂在完毕，通知仓库发送请求获取一级分类的数据
onMounted(() => {
  getC1()
})

// 卸载组件之前，清理分类数据信息
onBeforeUnmount(() => categoryStore.$reset())

// 通知仓库获取一级分类的方法
const getC1 = async () => {
  await categoryStore.getC1()
}

// 一级分类下拉菜单change事件
const handlerC1 = () => {
  c2Id.value = undefined
  c3Arr.value = []
  c3Id.value = undefined
  categoryStore.getC2()
}
// 二级分类下拉菜单change事件
const handlerC2 = () => {
  c3Id.value = undefined
  categoryStore.getC3()
}
</script>

<style scoped lang="scss"></style>
