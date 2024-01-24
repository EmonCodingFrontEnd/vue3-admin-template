<template>
  <el-form
    ref="spuFormRef"
    :model="spuForm"
    :rules="spuRules"
    style="width: 80%"
    label-width="120px"
  >
    <el-form-item label="SPU名称：" prop="spuName">
      <el-input
        placeholder="请您输入SPU名称"
        v-model="spuForm.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌：" prop="tmId">
      <el-select v-model="spuForm.tmId">
        <el-option
          :label="trademark.tmName"
          :value="trademark.id"
          v-for="trademark in allTradeMark"
          :key="trademark.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述：">
      <el-input
        type="textarea"
        placeholder="请你输入SPU描述"
        rows="5"
        v-model="spuForm.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片：">
      <el-upload
        ref="spuImageUploaderRef"
        v-model:file-list="spuImageList"
        :action="PICTURE_UPLOAD_URL"
        list-type="picture-card"
        :before-upload="beforeUpload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="预览图片"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性：">
      <!--展示销售属性的下拉菜单-->
      <el-select
        v-model="attrIdAndAttrName"
        :placeholder="
          unSelectSaleAttr.length
            ? `还有 ${unSelectSaleAttr.length} 未选择`
            : `无`
        "
      >
        <el-option
          :label="saleAttr.name"
          :value="`${saleAttr.id}:${saleAttr.name}`"
          v-for="saleAttr in unSelectSaleAttr"
          :key="saleAttr.id"
        ></el-option>
      </el-select>
      <el-button
        style="margin-left: 10px"
        type="primary"
        size="default"
        icon="Plus"
        :disabled="!attrIdAndAttrName"
        @click="addSaleAttr"
      >
        添加属性值
      </el-button>
      <!--table展示销售属性与属性值的地方-->
      <el-table
        ref="skuTableRef"
        class="sku-table"
        :data="spuSaleAttrList"
        border
        stripe
      >
        <el-table-column
          label="序号"
          type="index"
          width="80px"
          align="center"
          fixed
        ></el-table-column>
        <el-table-column
          label="销售属性名称"
          width="120px"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="销售属性值">
          <template v-slot="{ row, $index }">
            <el-tag
              v-for="item in row.spuSaleAttrValueList"
              :key="item.id"
              style="margin-left: 5px"
              closable
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-button
              type="primary"
              size="small"
              icon="Plus"
              style="margin-left: 5px"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120px"
          align="center"
          fixed="right"
        >
          <template v-slot="{ row, $index }">
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              title="删除"
              @click="spuSaleAttrList.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default">
        <SvgIcon name="save" color="white" />
        <span style="margin-left: 5px">保存</span>
      </el-button>
      <el-button type="primary" size="default" icon="Close" @click="cancelSpu">
        取消
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="SpuForm">
import { computed, markRaw, reactive, ref } from 'vue'
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
import { Attr } from '@/api/product/attr/type'
import type {
  AllSaleAttrResponseData,
  AllTrademarkResponseData,
  SaleAttr,
  SpuData,
  SpuHasImageResponseData,
  SpuHasSaleAttrResponseData,
  SpuImage,
  SpuSaleAttr,
} from '@/api/product/spu/type'
import {
  PICTURE_UPLOAD_URL,
  reqAllSaleAttr,
  reqAllTrademark,
  reqSpuHasImageList,
  reqSpuHasSaleAttrList,
} from '@/api/product/spu'
import type { Trademark } from '@/api/product/trademark/type'
import * as cloneDeep from 'lodash/cloneDeep'

const emit = defineEmits(['changeScene'])
// 取消对SPU的操作
const cancelSpu = () => {
  emit('changeScene', 0)
}

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
// 定义表单校验需要的配置对象
const spuRules = reactive<FormRules<Attr>>({
  attrName: [
    {
      required: true,
      min: 2,
      message: '属性名称长度至少2位',
      trigger: 'change',
    },
  ],
})

// 存储全部品牌的数据
const allTradeMark = ref<Trademark[]>([])
// 平台销售属性列表
const allSaleAttr = ref<SaleAttr[]>([])
// SPU的销售属性列表
const spuSaleAttrList = ref<SpuSaleAttr[]>([])
// SPU的图片列表
const spuImageList = ref<SpuImage[]>([])

// ==================================================华丽的分割线==================================================
// 照片墙组件
const spuImageUploaderRef = ref<UploadInstance>()
// 照片墙组件的fileList
// const spuImageFileList = ref<UploadUserFile[]>([
//   // {
//   //   name: '',
//   //   url: '',
//   // },
// ])
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
// 添加销售属性的回调
const addSaleAttr = () => {
  const [baseSaleAttrIdStr, saleAttrName] = attrIdAndAttrName.value?.split(':')
  const baseSaleAttrId: number = baseSaleAttrIdStr as number
  const newSaleAttr: SpuSaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  spuSaleAttrList.value.push(newSaleAttr)
  attrIdAndAttrName.value = ''
}

// 对Table表格的引用
const skuTableRef = ref()
// ==================================================华丽的分割线==================================================
// 初始化方法
const init = async (spuInfo: SpuData) => {
  const { id: spuId } = spuInfo
  if (spuId) {
    // 修改
    Object.assign(spuForm, cloneDeep(spuInfo))
    attrIdAndAttrName.value = ''
  } else {
    // 新增
    Object.assign(spuForm, cloneDeep(initSpuForm))
    attrIdAndAttrName.value = ''
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
  // 获取SPU的销售属性信息
  const spuSaleAttrResult: SpuHasSaleAttrResponseData =
    await reqSpuHasSaleAttrList(spuId as number)
  if (spuSaleAttrResult.code === 200) {
    spuSaleAttrList.value = spuSaleAttrResult.data
  }
  // 获取SPU的图片信息
  const spuImageResult: SpuHasImageResponseData = await reqSpuHasImageList(
    spuId as number,
  )
  if (spuImageResult.code === 200) {
    spuImageList.value = spuImageResult.data.map((item) => {
      return { name: item.imgName, url: item.imgUrl } as SpuImage
    })
  }
}

defineExpose({ init })
</script>

<style scoped lang="scss">
.sku-table {
  margin: 10px 0;
}
</style>
