<template>
  <el-form
    ref="spuFormRef"
    :model="spuForm"
    :rules="spuRules"
    style="width: 80%"
    label-width="120px"
  >
    <el-form-item label="SPU名称：" prop="attrName">
      <el-input
        placeholder="请您输入SPU名称"
        v-model="spuForm.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌：" prop="attrName">
      <el-select v-model="spuForm.tmId">
        <el-option label="华为" value="华为"></el-option>
        <el-option label="oppo" value="oppo"></el-option>
        <el-option label="vivo" value="vivo"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述：">
      <el-input
        type="textarea"
        placeholder="请你输入SPU描述"
        rows="5"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片：">
      <el-upload
        ref="spuImgUploader"
        v-model:file-list="spuImgFileList"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性：" prop="attrName">
      <!--展示销售属性的下拉菜单-->
      <el-select v-model="华为">
        <el-option label="华为" value="华为"></el-option>
        <el-option label="oppo" value="oppo"></el-option>
        <el-option label="vivo" value="vivo"></el-option>
      </el-select>
      <el-button
        style="margin-left: 10px"
        type="primary"
        size="default"
        icon="Plus"
      >
        添加属性值
      </el-button>
      <!--table展示销售属性与属性值的地方-->
      <el-table
        ref="skuTableRef"
        class="sku-table"
        :data="skuArr"
        :height="skuTableHeight"
        :max-height="skuTableHeight"
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
        <el-table-column label="销售属性名称" width="120px"></el-table-column>
        <el-table-column label="销售属性值"></el-table-column>
        <el-table-column
          label="属性操作"
          width="120px"
          align="center"
          fixed="right"
        >
          <template v-slot="{ row, $index }">
            <el-button type="primary" size="small" title="保存">
              <SvgIcon name="save" color="white" />
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="Close"
              title="取消"
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
import { markRaw, reactive, ref } from 'vue'
import type {
  FormInstance,
  FormRules,
  UploadFile,
  UploadInstance,
  UploadProps,
  UploadRawFile,
  UploadUserFile,
} from 'element-plus'
import { Attr } from '@/api/product/attr/type'
import * as cloneDeep from 'lodash/cloneDeep'
import useElFormHelper from '@/hooks/useElFormHelper'
import { SpuData, SpuDataList } from '@/api/product/spu/type'
import useElTableHelper from '@/hooks/useElTableHelper'

const emit = defineEmits(['changeScene'])
// 取消对SPU的操作
const cancelSpu = () => {
  emit('changeScene', 0)
}

// 对Form表单的引用
const spuFormRef = ref<FormInstance>()
// 定义收集SPU的数据
const initSpuForm = markRaw({
  id: undefined,
  spuName: '',
  description: '',
  category3Id: undefined,
  tmId: undefined,
  spuSaleAttrList: null,
  spuImageList: null,
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

// ==================================================华丽的分割线==================================================
// 照片墙组件
const spuImgUploader = ref<UploadInstance>()
// 照片墙组件的fileList
const spuImgFileList = ref<UploadUserFile[]>([
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
])

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

// ==================================================华丽的分割线==================================================

// 存储已有的属性与属性值
const skuArr = ref<any>([{}, {}])

const {
  tableRef: skuTableRef,
  tableHeight: skuTableHeight,
  setHeight: skuSetHeight,
} = useElTableHelper(129, () => {})

defineExpose({ skuSetHeight })
</script>

<style scoped lang="scss">
.sku-table {
  margin: 10px 0;
}
</style>
