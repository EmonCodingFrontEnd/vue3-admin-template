<template>
  <el-form
    ref='spuFormRef'
    :model='spuForm'
    :rules='spuRules'
    style='width: 80%'
    label-width='120px'
  >
    <!--注意：该字段不需要回显，但为了能被resetFields()方法正确重置，必须要写上，且prop属性是对应字段名-->
    <el-form-item prop='category3Id' v-show='false'></el-form-item>
    <el-form-item label='SPU名称：' prop='spuName'>
      <el-input
        placeholder='请您输入SPU名称'
        v-model='spuForm.spuName'
      ></el-input>
    </el-form-item>
    <el-form-item label='SPU品牌：' prop='tmId'>
      <el-select v-model='spuForm.tmId'>
        <el-option
          :label='trademark.tmName'
          :value='trademark.id'
          v-for='trademark in allTradeMark'
          :key='trademark.id'
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label='SPU描述：'>
      <el-input
        type='textarea'
        placeholder='请你输入SPU描述'
        rows='5'
        v-model='spuForm.description'
      ></el-input>
    </el-form-item>
    <el-form-item label='SPU图片：' prop='spuImageList'>
      <el-upload
        ref='spuImageUploaderRef'
        v-model:file-list='spuImageFileList'
        :action='PICTURE_UPLOAD_URL'
        list-type='picture-card'
        :before-upload='beforeUpload'
        :on-success='handleAvatarSuccess'
        :on-preview='handlePreview'
        :on-remove='handleRemove'
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model='dialogVisible'>
        <img
          w-full
          :src='dialogImageUrl'
          alt='预览图片'
          style='width: 100%; height: 100%'
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label='SPU销售属性：' prop='spuSaleAttrList'>
      <!--展示销售属性的下拉菜单-->
      <el-select
        v-model='attrIdAndAttrName'
        :placeholder='
          unSelectSaleAttr.length
            ? `还有 ${unSelectSaleAttr.length} 未选择`
            : `无`
        '
      >
        <el-option
          :label='saleAttr.name'
          :value='`${saleAttr.id}:${saleAttr.name}`'
          v-for='saleAttr in unSelectSaleAttr'
          :key='saleAttr.id'
        ></el-option>
      </el-select>
      <el-button
        style='margin-left: 10px'
        type='primary'
        size='default'
        icon='Plus'
        :disabled='!attrIdAndAttrName'
        @click='addSaleAttr'
      >
        添加属性值
      </el-button>
      <!--table展示销售属性与属性值的地方-->
      <el-table
        ref='skuTableRef'
        class='sku-table'
        :data='spuSaleAttrList'
        border
        stripe
      >
        <el-table-column
          label='序号'
          type='index'
          width='80px'
          align='center'
          fixed
        ></el-table-column>
        <el-table-column
          label='销售属性名称'
          width='120px'
          prop='saleAttrName'
        ></el-table-column>
        <el-table-column label='销售属性值'>
          <template v-slot='{ row, $index }'>
            <el-tag
              v-for='(item, index) in row.spuSaleAttrValueList'
              :key='item.id'
              style='margin-left: 5px'
              closable
              @close='row.spuSaleAttrValueList.splice(index, 1)'
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              v-if='row.edit'
              placeholder='请你输入属性值'
              size='small'
              style='width: 100px; margin-left: 5px'
              v-model.trim='row.saleAttrValueName'
              @blur='toReadMode($event, row, $index)'
              @keyup.enter='inputRefArr[$index].blur()'
              :ref='(el) => (inputRefArr[$index] = el)'
            ></el-input>
            <el-button
              v-else
              type='primary'
              size='small'
              icon='Plus'
              style='margin-left: 5px'
              @click='toEditMode(row, $index)'
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column
          label='操作'
          width='120px'
          align='center'
          fixed='right'
        >
          <template v-slot='{ row, $index }'>
            <el-button
              type='danger'
              size='small'
              icon='Delete'
              title='删除'
              @click='spuSaleAttrList.splice($index, 1)'
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type='primary' size='default' @click='saveSpu'>
        <SvgIcon name='save' color='white' />
        <span style='margin-left: 5px'>保存</span>
      </el-button>
      <el-button type='primary' size='default' @click='cancelSpu'>
        <SvgIcon name='cancel' color='white' />
        <span style='margin-left: 5px'>取消</span>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang='ts' name='SpuForm'>
import { computed, markRaw, nextTick, reactive, ref } from 'vue'
import type {
  FormInstance,
  FormRules,
  UploadFile,
  UploadFiles,
  UploadInstance,
  UploadProps,
  UploadRawFile,
  UploadUserFile,
} from 'element-plus'
import { ElMessage } from 'element-plus'
import type {
  AllSaleAttrResponseData,
  AllTrademarkResponseData,
  SaleAttr,
  SpuData,
  SpuHasImageResponseData,
  SpuHasSaleAttrResponseData,
  SpuImage,
  SpuSaleAttr,
  SpuSaleAttrValue,
} from '@/api/product/spu/type'
import {
  PICTURE_UPLOAD_URL,
  reqAllSaleAttr,
  reqAllTrademark,
  reqSpuHasImageList,
  reqSpuHasSaleAttrList,
  reqAddOrUpdateSpuInfo,
} from '@/api/product/spu'
import type { Trademark } from '@/api/product/trademark/type'
import * as cloneDeep from 'lodash/cloneDeep'
import { StringResponseData } from '@/api/base'
import useElFormHelper from '@/hooks/useElFormHelper'

const emit = defineEmits(['changeScene'])
// ==================================================华丽的分割线==================================================
// 对Form表单的引用
const spuFormRef = ref<FormInstance>()
// 定义收集SPU的数据
const initSpuForm = markRaw({
  id: undefined,
  spuName: '',
  tmId: undefined,
  description: '',
  category3Id: undefined,
  spuImageList: [
    // {
    //   id: undefined,
    //   spuId: undefined,
    //   imgName: '',
    //   imgUrl: '',
    // },
  ],
  spuSaleAttrList: [
    // {
    // id: undefined,
    // spuId: undefined,
    // baseSaleAttrId: undefined,
    // saleAttrName: '',
    // spuSaleAttrValueList: [
    //   {
    //     id: undefined,
    //     spuId: undefined,
    //     baseSaleAttrId: undefined,
    //     saleAttrValueName: '',
    //     saleAttrName: '',
    //     isChecked: null,
    //   },
    // ],
    // },
  ],
})
// 深度拷贝后使用，避免污染初始的属性
const spuForm = reactive<SpuData>(cloneDeep(initSpuForm))
const validatorSpuImageList = (rule: any, value: any, callback: any) => {
  if (spuImageFileList.value.length > 0) {
    callback()
  } else {
    callback(new Error('商品图片至少一张！'))
  }
}
const validatorSpuSaleAttrList = (rule: any, value: any, callback: any) => {
  if (spuSaleAttrList.value.length > 0) {
    callback()
  } else {
    callback(new Error('商品属性至少一个！'))
  }
}
// 定义表单校验需要的配置对象
const spuRules = reactive<FormRules<SpuData>>({
  spuName: [
    {
      required: true,
      min: 2,
      message: '商品名称长度至少2位',
      trigger: 'change',
    },
  ],
  tmId: [
    {
      required: true,
      message: '商品品牌不允许为空',
      trigger: 'change',
    },
  ],
  // 虽然页面不展示分类，但只要添加了<el-form-item prop='category3Id'>就能触发校验
  category3Id: [
    {
      required: true,
      message: '商品分类不允许为空',
      trigger: 'change',
    },
  ],
  spuImageList: [{ trigger: 'change', validator: validatorSpuImageList }],
  spuSaleAttrList: [{ trigger: 'change', validator: validatorSpuSaleAttrList }],
})

// 存储全部品牌的数据
const allTradeMark = ref<Trademark[]>([])
// 平台销售属性列表
const allSaleAttr = ref<SaleAttr[]>([])

// ==================================================华丽的分割线==================================================
// 照片墙组件
const spuImageUploaderRef = ref<UploadInstance>()
// 照片墙组件的fileList
const spuImageFileList = ref<UploadUserFile[]>([
  // {
  //   name: '',
  //   url: '',
  // },
])
// 照片墙预览对话框是否显示
const dialogVisible = ref<boolean>(false)
// 预览时展示的图片地址
const dialogImageUrl = ref<string>('')
// 照片墙的图片上传之前回调，用于控制上传的图片大小与类型
const beforeUpload: UploadProps['beforeUpload'] = (rawFile: UploadRawFile) => {
  if (
    rawFile.type !== 'image/jpeg' &&
    rawFile.type !== 'image/png' &&
    rawFile.type !== 'image/gif'
  ) {
    ElMessage.error('上传的头像图片必须是 JPG|PNG|GIF 格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('上传的头像图片大小不能超过 5MB！')
    return false
  }
  return true
}
// 上传图片组件->上传成功的回调函数
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response: any,
  uploadFile: UploadFile,
) => {
  spuFormRef.value?.clearValidate('spuImageList') // 清除图片的校验
}
// 点击预览
const handlePreview: UploadProps['onPreview'] = (uploadFile: UploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
// 点击删除
const handleRemove: UploadProps['onRemove'] = (
  uploadFile: UploadFile,
  uploadFiles: UploadFiles,
) => {
  console.log(uploadFile, uploadFiles)
}

// ==================================================华丽的分割线==================================================
// SPU的销售属性列表
const spuSaleAttrList = ref<SpuSaleAttr[]>([])
// 计算当前SPU尚未拥有的销售属性
const unSelectSaleAttr = computed(() => {
  return allSaleAttr.value.filter((item) => {
    return spuSaleAttrList.value.every(
      (innerItem) => innerItem.saleAttrName !== item.name,
    )
  })
})

// 收集商品销售属性
const attrIdAndAttrName = ref<string>('')
// 准备一个数组：将来存储对应的组件实例el-input
const inputRefArr = ref<any>([])

// 添加销售属性的回调
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = attrIdAndAttrName.value?.split(':')
  const newSaleAttr: SpuSaleAttr = {
    baseSaleAttrId: baseSaleAttrId as number,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  spuSaleAttrList.value.push(newSaleAttr)
  attrIdAndAttrName.value = ''
}

// 进入阅读模式
const toReadMode = ($event: Event, row: SpuSaleAttr, $index: number) => {
  const { baseSaleAttrId, saleAttrName, saleAttrValueName } = row
  if (!saleAttrValueName) {
    return ElMessage.error('属性值名称不允许为空！')
  }
  const existDuplicate = row.spuSaleAttrValueList.some(
    (item) => item.saleAttrValueName === saleAttrValueName,
  )
  if (existDuplicate) {
    return ElMessage.error('属性值不允许重复！')
  }

  const newSaleAttrValue: SpuSaleAttrValue = {
    baseSaleAttrId,
    saleAttrName,
    saleAttrValueName: saleAttrValueName as string,
  }
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  // 收集后，删除属性值名称
  delete row.saleAttrValueName
  row.edit = false
}

// 进入编辑模式
const toEditMode = (row: SpuSaleAttr, $index: number) => {
  row.edit = true
  nextTick(() => inputRefArr.value[$index].focus())
}
// 对Table表格的引用
const skuTableRef = ref()
// ==================================================华丽的分割线==================================================
// 初始化方法
const init = async (spuInfo: SpuData) => {
  const { id: spuId } = spuInfo
  // 修改
  if (spuId) {
    Object.assign(spuForm, cloneDeep(spuInfo))
    attrIdAndAttrName.value = ''
  }
  // 新增
  else {
    // 展示属性添加页面时，先清空数据；注意：resetFields()是有局限性的，仅能重置<el-form-item>标签的prop属性指定过的属性
    Object.assign(spuForm, cloneDeep(initSpuForm), spuInfo)
    attrIdAndAttrName.value = ''
    /*
    清理表单验证信息
    为什么使用setTimeout？点击修改=>返回商品列表=>点击新增，此时触发验证，显示了校验错误信息
    注意：这里使用resetFields()可行，但过重！使用nextTick也无效！
     */
    setTimeout(() => spuFormRef.value?.clearValidate(), 0)
  }

  // 获取全部品牌的数据
  const trademarkResult: AllTrademarkResponseData = await reqAllTrademark()
  if (trademarkResult.code === 200) {
    allTradeMark.value = trademarkResult.data
  }
  // 获取平台全部售卖属性
  const saleAttrResult: AllSaleAttrResponseData = await reqAllSaleAttr()
  if (saleAttrResult.code === 200) {
    allSaleAttr.value = saleAttrResult.data
  }
  
  if (spuId) {
    // 获取SPU的图片信息
    const spuImageResult: SpuHasImageResponseData = await reqSpuHasImageList(
      spuId as number,
    )
    if (spuImageResult.code === 200) {
      spuImageFileList.value = spuImageResult.data.map((item) => {
        return { name: item.imgName, url: item.imgUrl } as UploadUserFile
      })
    }
    // 获取SPU的销售属性信息
    const spuSaleAttrResult: SpuHasSaleAttrResponseData =
      await reqSpuHasSaleAttrList(spuId as number)
    if (spuSaleAttrResult.code === 200) {
      spuSaleAttrList.value = spuSaleAttrResult.data
    }
  } else {
    spuImageFileList.value = []
    spuSaleAttrList.value = []
  }
}

// ==================================================华丽的分割线==================================================
// 保存对SPU的操作
const saveSpu = async () => {
  try {
    // 保证全部表单项校验通过再发请求
    const { validateCallback } = useElFormHelper()
    await spuFormRef.value?.validate(validateCallback)

    // 整理参数
    spuForm.spuImageList = spuImageFileList.value.map((item) => {
      return {
        imgName: item.name,
        imgUrl: (item.response && item.response.data) || item.url,
      } as SpuImage
    })
    spuForm.spuSaleAttrList = spuSaleAttrList.value
    const result: StringResponseData = await reqAddOrUpdateSpuInfo(spuForm)
    if (result.code === 200) {
      emit('changeScene', 0, true)
      // 再次发送请求
      ElMessage.success(spuForm.id ? '修改商品成功！' : '添加商品成功！')
    } else {
      ElMessage.error(
        (spuForm.id ? '修改商品失败！' : '添加商品失败！') +
        (result.data || result.message),
      )
    }
  } catch (error) {
    ElMessage.error({
      dangerouslyUseHTMLString: true,
      message: (error as Error).message,
    })
  }
}
// 取消对SPU的操作
const cancelSpu = () => {
  emit('changeScene', 0)
}

defineExpose({ init })
</script>

<style scoped lang='scss'>
.sku-table {
  margin: 10px 0;
}
</style>
