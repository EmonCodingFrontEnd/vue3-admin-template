<template>
  <el-form
    ref="skuFormRef"
    :model="skuForm"
    :rules="skuRules"
    label-width="135px"
  >
    <el-form-item label="SKU名称：" prop="skuName">
      <el-input placeholder="SKU名称" v-model="skuForm.skuName"></el-input>
    </el-form-item>
    <el-form-item label="SKU价格（元）：" prop="price">
      <el-input
        type="number"
        placeholder="SKU价格（元）"
        v-model="skuForm.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU重量（克）：" prop="weight">
      <el-input placeholder="SKU重量（克）" v-model="skuForm.weight"></el-input>
    </el-form-item>
    <el-form-item label="SKU描述：" prop="skuDesc">
      <el-input
        type="textarea"
        placeholder="SKU描述"
        rows="5"
        v-model="skuForm.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性：" prop="skuAttrValueList">
      <el-form :inline="true" label-width="80px">
        <el-form-item
          :label="attr.attrName"
          v-for="attr in attrList"
          :key="attr.id"
          style="margin-bottom: 10px"
        >
          <el-select
            placeholder="请选择"
            v-model="attr.attrIdAndValueId"
            @change="handleSkuAttr"
          >
            <el-option
              :label="attrValue.valueName"
              :value="`${attrValue.attrId}:${attrValue.id}`"
              v-for="attrValue in attr.attrValueList"
              :key="attrValue.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性：" prop="skuSaleAttrValueList">
      <el-form :inline="true" label-width="80px">
        <el-form-item
          :label="saleAttr.saleAttrName"
          v-for="saleAttr in spuSaleAttrList"
          :key="saleAttr.id"
          style="margin-bottom: 10px"
        >
          <el-select
            placeholder="请选择"
            v-model="saleAttr.saleAttrIdAndValueId"
            @change="handleSkuSaleAttr"
          >
            <el-option
              :label="saleAttrValue.saleAttrValueName"
              :value="`${saleAttr.id}:${saleAttrValue.id}`"
              v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
              :key="saleAttrValue.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表：" prop="skuDefaultImg">
      <el-table
        ref="picTableRef"
        :data="spuImageFileList"
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="80px"
          align="center"
          fixed
        ></el-table-column>
        <el-table-column label="图片">
          <template v-slot="{ row, $index }">
            <img :src="row.imgUrl" style="width: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column
          label="操作"
          width="120px"
          align="center"
          fixed="right"
        >
          <template v-slot="{ row, $index }">
            <el-button
              v-if="row.isDefault === '0'"
              type="primary"
              size="small"
              @click="changeDefaultImg(row)"
            >
              设置默认
            </el-button>
            <span v-else style="color: green">默认</span>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="saveSku">
        <SvgIcon name="save" color="white" />
        <span style="margin-left: 5px">保存</span>
      </el-button>
      <el-button type="primary" size="default" @click="cancelSku">
        <SvgIcon name="cancel" color="white" />
        <span style="margin-left: 5px">取消</span>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="SkuForm">
import { nextTick, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules, ElTable } from 'element-plus'
import type { SpuData, SkuData } from '@/api/product/spu/type'
import type { Attr, AttrList, AttrResponseData } from '@/api/product/attr/type'
import { reqAttr } from '@/api/product/attr'
import * as cloneDeep from 'lodash/cloneDeep'
import type {
  SkuAttrValue,
  SkuSaleAttrValue,
  SpuHasImageResponseData,
  SpuHasSaleAttrResponseData,
  SpuImage,
  SpuSaleAttr,
} from '@/api/product/spu/type'
import {
  reqSpuHasImageList,
  reqSpuHasSaleAttrList,
  reqAddSkuInfo,
} from '@/api/product/spu'
import useElFormHelper from '@/hooks/useElFormHelper'
import { StringResponseData } from '@/api/base'

const emit = defineEmits(['changeScene'])
// ==================================================华丽的分割线==================================================
// 对Form表单的引用
const skuFormRef = ref<FormInstance>()
// 定义收集SKU的数据
const initSkuForm = {
  category3Id: undefined, // 三级分类ID
  spuId: undefined, // 已有的SPU的ID
  tmId: undefined, // SPU品牌的ID
  skuName: '', // SKU名称
  price: undefined, // SKU价格
  weight: '', // SKU重量
  skuDesc: '', // SKU的描述
  skuAttrValueList: [
    // 平台属性的收集
    // {
    //   attrId: undefined, // 平台属性的ID
    //   valueId: '', // 平台属性值的ID
    // },
  ],
  skuSaleAttrValueList: [
    // {
    //   saleAttrId: '', // 销售属性ID
    //   saleAttrValueId: '', // 销售属性值的ID
    // },
  ],
  skuDefaultImg: '', // SKU图片地址
}
// 收集表单数据
const skuForm = reactive<SkuData>(cloneDeep(initSkuForm))
const validatorSkuAttrValueList = (rule: any, value: any, callback: any) => {
  if (skuForm.skuAttrValueList.length > 0) {
    callback()
  } else {
    callback(new Error('平台属性至少选择一个！'))
  }
}
const validatorSkuSaleAttrValueList = (
  rule: any,
  value: any,
  callback: any,
) => {
  if (skuForm.skuSaleAttrValueList.length > 0) {
    callback()
  } else {
    callback(new Error('销售属性至少选择一个！'))
  }
}
// 定义表单校验需要的配置对象
const skuRules = reactive<FormRules<SkuData>>({
  skuName: [
    {
      required: true,
      min: 2,
      message: 'SKU名称长度至少2位',
      trigger: 'change',
    },
  ],
  price: [{ required: true, message: 'SKU价格不允许为空', trigger: 'change' }],
  weight: [{ required: true, message: 'SKU重量不允许为空', trigger: 'change' }],
  skuAttrValueList: [{ required: true, validator: validatorSkuAttrValueList }],
  skuSaleAttrValueList: [
    { required: true, validator: validatorSkuSaleAttrValueList },
  ],
  skuDefaultImg: [
    { required: true, message: '请选择SKU默认图片', trigger: 'change' },
  ],
})

// 存储获取分类下已有的属性与属性值
const attrList = ref<AttrList>([])

const handleSkuAttr = () => {
  skuFormRef.value?.clearValidate('skuAttrValueList')
}
const handleSkuSaleAttr = () => {
  skuFormRef.value?.clearValidate('skuSaleAttrValueList')
}
// ==================================================华丽的分割线==================================================
// 对Table表格的引用
const picTableRef = ref<InstanceType<typeof ElTable>>()
// 照片墙组件的fileList
const spuImageFileList = ref<SpuImage[]>([
  // {
  //   name: '',
  //   url: '',
  // },
])
// SPU的销售属性列表
const spuSaleAttrList = ref<SpuSaleAttr[]>([])
/*
 * 选择图片触发事件
 * selection 是spuImageFileList的子集，由选中的元素组成
 * [{id,imgName,imgUrl,spuId}]
 */
const handleSelectionChange = (selection: SpuImage[]) => {
  // 不需要干啥
}
// [lm's ps]: 20240211 21:43 表单重置方式二
// 设置默认图片的方法回调
const changeDefaultImg = (row: SpuImage) => {
  spuImageFileList.value.forEach((e) => (e.isDefault = '0'))
  picTableRef.value?.clearSelection()

  // 选中对应复选框
  row.isDefault = '1'
  picTableRef.value?.toggleRowSelection(row, true)

  // 收集默认的图片地址
  skuForm.skuDefaultImg = <string>row.imgUrl
  // 清除图片的校验错误信息
  /*
  清理表单验证信息：假若表单验证使用了change而不是blur
  为什么使用setTimeout？点击修改=>返回商品列表=>点击新增，此时触发验证，显示了校验错误信息
  注意：这里使用resetFields()可行，但过重！使用nextTick也无效！
  */
  setTimeout(() => skuFormRef.value?.clearValidate('skuDefaultImg'), 0)
}
// ==================================================华丽的分割线==================================================
const init = async (
  { category1Id, category2Id, category3Id },
  spuInfo: SpuData,
) => {
  const { id: spuId, tmId } = spuInfo

  Object.assign(skuForm, cloneDeep(initSkuForm))

  skuForm.category3Id = category3Id
  skuForm.spuId = spuId as number
  skuForm.tmId = tmId

  /*
  清理表单验证信息：假若表单验证使用了change而不是blur
  为什么使用setTimeout？点击修改=>返回商品列表=>点击新增，此时触发验证，显示了校验错误信息
  注意：这里使用resetFields()可行，但过重！使用nextTick也无效！
  */
  setTimeout(() => skuFormRef.value?.clearValidate(), 0)

  // 获取分类下已有的属性与属性值地址接口方法
  const attrResult: AttrResponseData = await reqAttr(
    category3Id,
    category2Id,
    category3Id,
  )
  if (attrResult.code === 200) {
    attrList.value = attrResult.data
  }
  // 获取SPU的图片信息
  const spuImageResult: SpuHasImageResponseData = await reqSpuHasImageList(
    spuId as number,
  )
  if (spuImageResult.code === 200) {
    spuImageFileList.value = spuImageResult.data.map((item) => {
      return {
        imgName: item.imgName,
        imgUrl: item.imgUrl,
        isDefault: '0',
      } as SpuImage
    })
  }
  // 获取SPU的销售属性信息
  const spuSaleAttrResult: SpuHasSaleAttrResponseData =
    await reqSpuHasSaleAttrList(spuId as number)
  if (spuSaleAttrResult.code === 200) {
    spuSaleAttrList.value = spuSaleAttrResult.data
  }
}
// ==================================================华丽的分割线==================================================
// 保存对SKU的操作
const saveSku = async () => {
  try {
    // 整理参数
    skuForm.skuAttrValueList = attrList.value.reduce(
      (prev: SkuAttrValue[], curr: Attr) => {
        if (curr.attrIdAndValueId) {
          const [attrId, valueId] = (<string>curr.attrIdAndValueId)?.split(':')
          prev.push({ attrId, valueId } as SkuAttrValue)
        }
        return prev
      },
      [],
    )
    skuForm.skuSaleAttrValueList = spuSaleAttrList.value.reduce(
      (prev: SkuSaleAttrValue[], curr: SpuSaleAttr) => {
        if (curr.saleAttrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = (<string>(
            curr.saleAttrIdAndValueId
          ))?.split(':')
          prev.push({ saleAttrId, saleAttrValueId } as SkuSaleAttrValue)
        }
        return prev
      },
      [],
    )

    // 保证全部表单项校验通过再发请求
    const { validateCallback } = useElFormHelper()
    await skuFormRef.value?.validate(validateCallback)

    const result: StringResponseData = await reqAddSkuInfo(skuForm)
    if (result.code === 200) {
      emit('changeScene', 0)
      // 再次发送请求
      ElMessage.success('添加商品SKU成功！')
    } else {
      ElMessage.error('添加商品SKU失败！' + (result.data || result.message))
    }
  } catch (error) {
    ElMessage.error({
      dangerouslyUseHTMLString: true,
      message: (error as Error).message,
    })
  }
}
// 取消对SKU的操作
const cancelSku = () => {
  emit('changeScene', 0)
}
// ==================================================华丽的分割线==================================================
defineExpose({ init })
</script>

<style scoped lang="scss"></style>
