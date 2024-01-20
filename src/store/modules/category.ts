import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import type { CategoryResponseData } from '@/api/product/attr/type'
import type { CategoryState } from '@/store/modules/types/type'

const useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      c1Arr: [],
      c1Id: undefined,
      c2Arr: [],
      c2Id: undefined,
      c3Arr: [],
      c3Id: undefined,
    }
  },
  actions: {
    // 获取一级分类数据
    async getC1() {
      const result: CategoryResponseData = await reqC1()
      if (result.code === 200) {
        this.c1Arr = result.data
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message as string))
      }
    },
    // 获取二级分类数据
    async getC2() {
      const result: CategoryResponseData = await reqC2(<number>this.c1Id)
      if (result.code === 200) {
        this.c2Arr = result.data
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message as string))
      }
    },
    // 获取三级分类数据
    async getC3() {
      const result: CategoryResponseData = await reqC3(<number>this.c2Id)
      if (result.code === 200) {
        this.c3Arr = result.data
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message as string))
      }
    },
  },
  getters: {},
})

export default useCategoryStore
