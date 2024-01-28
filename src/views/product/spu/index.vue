<template>
  <div>
    <Category ref="categoryRef"></Category>
    <el-card style="margin: 10px 0">
      <div v-show="scene === 0">
        <el-button
          type="primary"
          icon="Plus"
          :disabled="disableSpuOpeator"
          @click="addSpu"
        >
          添加Spu
        </el-button>
        <el-table
          ref="spuTableRef"
          class="spu-table"
          :data="spuArr"
          :height="spuTableHeight"
          :max-height="spuTableHeight"
          border
          stripe
        >
          <el-table-column
            label="序号"
            type="index"
            :index="(pageNo - 1) * pageSize + 1"
            width="80px"
            align="center"
            fixed
          ></el-table-column>
          <el-table-column
            label="SPU名称"
            width="200px"
            prop="spuName"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            label="SPU描述"
            prop="description"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            label="SPU操作"
            width="230px"
            align="center"
            fixed="right"
          >
            <template v-slot="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Plus"
                :disabled="disableSpuOpeator"
                title="添加SKU"
                plain
                round
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="warning"
                size="small"
                icon="Edit"
                :disabled="disableSpuOpeator"
                title="修改SPU"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="View"
                :disabled="disableSpuOpeator"
                title="查看SKU列表"
                plain
                round
                @click="viewSku(row)"
              ></el-button>
              <el-popconfirm
                :title="`确定要删除属性 ${row.spuName} 吗？`"
                width="280px"
                icon="Delete"
                @confirm="deleteSpu(row)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    size="small"
                    icon="Delete"
                    :disabled="disableSpuOpeator"
                    title="删除SPU"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 10, 20]"
          :background="true"
          layout="prev, pager, next, jumper, ->, total, sizes"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :disabled="disableSpuOpeator"
        />
      </div>
      <!--添加SPU|修改SPU子组件-->
      <SpuForm
        v-show="scene === 1"
        ref="spuFormRef"
        @changeScene="changeScene"
      ></SpuForm>
      <!--添加SKU子组件-->
      <SkuForm
        v-show="scene === 2"
        ref="skuFormRef"
        @changeScene="changeScene"
      ></SkuForm>
      <!--dialog对话框-->
      <el-dialog v-model="skuDialogVisible" title="SKU列表">
        <el-table :data="skuArr" border stripe>
          <el-table-column
            label="序号"
            type="index"
            width="80px"
            align="center"
            fixed
          ></el-table-column>
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template v-slot="{ row, $index }">
              <img :src="row.skuDefaultImg" style="width: 100px" />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="Spu">
import { computed, nextTick, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import useCategoryStore from '@/store/modules/category'
import type {
  SpuData,
  SpuDataList,
  HasSpuResponseData,
  SkuInfoData,
  SkuData,
} from '@/api/product/spu/type'
import { reqHasSpu, reqSkuInfo, reqDeleteSpuInfo } from '@/api/product/spu'
import useElTableHelper from '@/hooks/useElTableHelper'
// 引入子组件
import SpuForm from '@/views/product/spu/SpuForm.vue'
import SkuForm from '@/views/product/spu/SkuForm.vue'
import { ElMessage } from 'element-plus'

// 引用分类组件
const categoryRef = ref()
const categoryStore = useCategoryStore()
const { c1Id, c2Id, c3Id } = storeToRefs(categoryStore)
// 全局禁用属性操作：若分类信息缺失，禁用操作
const disableSpuOpeator = computed(() => {
  return !c3Id.value
})

// 存储已有的属性与属性值
const spuArr = ref<SpuDataList>([])
// 监听仓库三级分类ID变化
watch(c3Id, () => getSpu())
// 获取已有的属性与属性值
const getSpu = async () => {
  if (!c3Id.value) return
  const result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    <number>c3Id.value,
  )
  if (result.code === 200) {
    total.value = result.data.total
    spuArr.value = result.data.records
  } else {
    return Promise.reject(new Error(result.message))
  }
}

const {
  tableRef: spuTableRef,
  tableHeight: spuTableHeight,
  pageNo,
  pageSize,
  total,
  handleSizeChange,
  handleCurrentChange,
} = useElTableHelper(93, getSpu)
// ==================================================华丽的分割线==================================================
// 定义卡片内容切换的变量：scene=0，显示SPU table；scene=1，显示添加|修改SPU属性；scene=2，添加SKU
const scene = ref<number>(0)
// 监听场景值的变化
watch(
  scene,
  () =>
    nextTick(() => {
      categoryRef.value.setDisabled(scene.value === 1 || scene.value === 2)
    }),
  { immediate: true },
)

// 对SpuForm表单的引用
const spuFormRef = ref()
// 对SkuForm表单的引用
const skuFormRef = ref()
// 子组件SpuForm绑定自定义事件：目前是让自组件通知父组件切换场景值为0
const changeScene = (sceneValue: number, refreshSpuList: boolean = false) => {
  scene.value = sceneValue
  if (refreshSpuList) {
    getSpu()
  }
}

// 添加新的SPU按钮的回调
const addSpu = () => {
  scene.value = 1
  // 调用子组件实例的初始化方法
  spuFormRef.value.init({ category3Id: c3Id.value })
}
// 修改SPU按钮的回调
const updateSpu = (row: SpuData) => {
  scene.value = 1
  // 调用子组件实例的初始化方法
  spuFormRef.value.init(row)
}
// 删除SPU按钮的回调
const deleteSpu = async (row: SpuData) => {
  try {
    const result = await reqDeleteSpuInfo(row.id as number)
    if (result.code === 200) {
      pageNo.value = 1
      await getSpu()
      ElMessage.success('删除SPU成功！')
    } else {
      ElMessage.success('删除SPU失败！')
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}

// 添加SKU按钮的回调
const addSku = (row: SpuData) => {
  scene.value = 2
  skuFormRef.value.init(
    {
      category1Id: c1Id.value,
      category2Id: c2Id.value,
      category3Id: c3Id.value,
    },
    row,
  )
}

const skuDialogVisible = ref<boolean>(false)
// 存储某个商品的全部SKU数据
const skuArr = ref<SkuData[]>([])
// 查看SKU按钮的回调
const viewSku = async (row: SpuData) => {
  try {
    const result: SkuInfoData = await reqSkuInfo(row.id as number)
    if (result.code === 200) {
      skuArr.value = result.data
      skuDialogVisible.value = true
    } else {
      ElMessage.success('查看SKU列表失败！！')
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}
</script>

<style scoped lang="scss">
.spu-table {
  margin: 10px 0;
}
</style>
