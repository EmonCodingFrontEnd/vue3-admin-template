<template>
  <el-card>
    <el-table
      ref="skuTableRef"
      class="sku-table"
      :data="skuArr"
      :height="tableHeight"
      :max-height="tableHeight"
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
        label="名称"
        width="220px"
        :show-overflow-tooltip="true"
        prop="skuName"
      ></el-table-column>
      <el-table-column
        label="描述"
        min-width="300px"
        :show-overflow-tooltip="true"
        prop="skuDesc"
      ></el-table-column>
      <el-table-column label="默认图片" width="220px">
        <template v-slot="{ row, $index }">
          <img :src="row.skuDefaultImg" style="width: 100px" />
        </template>
      </el-table-column>
      <el-table-column
        label="重量（克）"
        width="220px"
        prop="weight"
      ></el-table-column>
      <el-table-column
        label="价格（元）"
        width="220px"
        prop="price"
      ></el-table-column>
      <el-table-column label="操作" width="220px" align="center" fixed="right">
        <template v-slot="{ row, $index }">
          <el-button
            :type="row.isSale === 1 ? 'success' : 'danger'"
            size="small"
            :icon="row.isSale === 1 ? 'Bottom' : 'Top'"
            :title="
              row.isSale === 1
                ? '商品已上架，点击下架！'
                : '商品已下架，点击上架！'
            "
            @click="updateSale(row)"
          ></el-button>
          <el-button
            type="warning"
            size="small"
            icon="Edit"
            @click="updateSku(row)"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            icon="InfoFilled"
            @click="viewSku(row)"
          ></el-button>
          <el-button type="danger" size="small" icon="Delete"></el-button>
          <!--<el-popconfirm-->
          <!--  :title="`确定要删除品牌 ${row.tmName} 吗？`"-->
          <!--  width="280px"-->
          <!--  icon="Delete"-->
          <!--  @confirm="removeTrademark($event, row)"-->
          <!--&gt;-->
          <!--  <template #reference>-->
          <!--    <el-button type="danger" size="small" icon="Delete"></el-button>-->
          <!--  </template>-->
          <!--</el-popconfirm>-->
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
    />
    <!--抽屉组件：展示SKU详情-->
    <el-drawer
      v-model="drawerVisible"
      :direction="drawerDirection"
      :show-close="false"
      size="50%"
    >
      <template #header>
        <h4>查看商品的详情</h4>
      </template>
      <template #default>
        <el-row>
          <el-col :span="5">名称：</el-col>
          <!-- 说明：一共24份，不能用完，给el-col的样式留点空间，避免换行！ -->
          <el-col :span="16">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">描述：</el-col>
          <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">价格：</el-col>
          <el-col :span="16">{{ skuInfo.price }}元</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">平台属性：</el-col>
          <el-col :span="16">
            <el-tag
              v-for="attrValue in skuInfo.skuAttrValueList"
              :key="attrValue.id"
              style="margin: 0 10px 10px 0"
            >
              {{ attrValue.attrName }}-{{ attrValue.valueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">销售属性：</el-col>
          <el-col :span="16">
            <el-tag
              type="success"
              v-for="saleAttrValue in skuInfo.skuSaleAttrValueList"
              :key="saleAttrValue.id"
              style="margin: 0 10px 10px 0"
            >
              {{ saleAttrValue.saleAttrName }}-{{
                saleAttrValue.saleAttrValueName
              }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">商品图片：</el-col>
          <el-col :span="16">
            <el-carousel height="550px" :autoplay="true" style="width: 550px">
              <el-carousel-item
                v-for="skuImage in skuInfo.skuImageList"
                :key="skuImage.id"
              >
                <img :src="skuImage.imgUrl" style="height: 550px" />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts" name="Sku">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { SkuData } from '@/api/product/sku/type'
import {
  reqSkuList,
  reqOnSaleSku,
  reqCancelSaleSku,
  reqSkuInfo,
} from '@/api/product/sku'
import useElTableHelper from '@/hooks/useElTableHelper'
import { StringResponseData } from '@/api/base'

// 存储已有SKU数据
const skuArr = ref<SkuData[]>([])

const getSkuList = async () => {
  const result: any = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code === 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
  } else {
    return Promise.reject(new Error(result.message as string))
  }
}

const {
  tableRef: skuTableRef,
  tableHeight,
  pageNo,
  pageSize,
  total,
  handleSizeChange,
  handleCurrentChange,
} = useElTableHelper(83, getSkuList, 10)

// ==================================================华丽的分割线==================================================
// 商品SKU抽屉是否显示
const drawerVisible = ref<boolean>(false)
// 抽屉的出场方式：rtl-从右到左（默认）
const drawerDirection = ref('rtl')
const skuInfo = ref<SkuData>()

// ==================================================华丽的分割线==================================================
// 上架/下架SKU
const updateSale = async (row: SkuData) => {
  const { id: skuId, isSale } = row
  let result: StringResponseData
  if (isSale === 1) {
    result = await reqCancelSaleSku(skuId as number)
  } else {
    result = await reqOnSaleSku(skuId as number)
  }
  if (result.code === 200) {
    await getSkuList()
    ElMessage.success('操作成功！')
  } else {
    ElMessage.error('操作失败！')
  }
}
// 更新SKU
const updateSku = async (row: SkuData) => {
  ElMessage.info('敬请期待！')
}

// 阅览SKU
const viewSku = async (row: SkuData) => {
  const { id: skuId } = row
  const result = await reqSkuInfo(skuId as number)
  if (result.code === 200) {
    skuInfo.value = result.data
    drawerVisible.value = true
  }
}
</script>

<style scoped lang="scss">
.sku-table {
  margin: 10px 0;
}

.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}

.el-col {
  margin: 10px 10px;
}

/*
  深度选择器，在父组件scoped情况下，可以横跨子组件传递样式
  >>>       原生CSS深度选择器
  /deep/    less
  ::v-deep  scss
*/
::v-deep .el-carousel__button {
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
}
</style>
