<template>
  <div>
    <el-card class="box-card">
      <!-- 卡片顶部添加品牌按钮 -->
      <el-button
        type="primary"
        size="default"
        icon="Plus"
        @click="addTrademark"
      >
        添加品牌
      </el-button>
      <!--表格组件：用于展示已有的平台数据-->
      <!--
      table:
        border=>可以设置表格纵向是否有边框
        table_column:
          label=>列标签名称
          width=>列宽
          align=>列对齐方式
      -->
      <el-table
        ref="tableRef"
        class="tableClass"
        :data="trademarkArr"
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
        <el-table-column label="品牌名称" prop="tmName"></el-table-column>
        <el-table-column label="品牌logo" prop="tmName">
          <template v-slot="{ row, $index }">
            <img
              :src="row.logoUrl"
              style="width: 50px; height: 50px"
              alt="图片找不到了"
            />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作" fixed="right" width="120px">
          <template v-slot="{ row, $index }">
            <el-button
              type="warning"
              size="small"
              icon="Edit"
              @click="updateTrademark(row)"
            ></el-button>
            <el-button type="danger" size="small" icon="Delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页器组件-->
      <!--
      pagination:
        v-model:current-page=>设置分页器当前页码
        v-model:page-size=>设置每页展示数据条数
        page-sizes=>每页显示个数选择器的选项设置
        small=>是否使用小型分页器样式
        background=>是否为分页按钮添加背景色
        layout=>组件布局，子组件名用逗号分隔
      -->
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
    </el-card>
    <!--对话框组件：在添加品牌与修改已有品牌的业务时使用-->
    <!--
      v-model:属性用于控制对话框的显示与隐藏 true-显示；false-隐藏
    -->
    <el-dialog v-model="dialogVisible" :title="operType">
      <el-form
        ref="trademarkFormRef"
        :model="trademarkForm"
        :rules="trademarkRules"
        style="width: 80%"
        label-width="120px"
      >
        <!--注意：这里id不需要回显，但为了能被resetFields()方法正确重置，必须要写上，且prop属性是对应字段名-->
        <el-form-item prop="id" v-show="false"></el-form-item>
        <el-form-item label="品牌名称：" prop="tmName">
          <el-input
            placeholder="请您输入品牌名称"
            v-model="trademarkForm.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO：" prop="logoUrl">
          <el-upload
            ref="avatarUploader"
            class="avatar-uploader"
            :action="PICTURE_UPLOAD_URL"
            :show-file-list="true"
            v-model:file-list="avatarFileList"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
          >
            <img
              v-if="trademarkForm.logoUrl"
              :src="trademarkForm.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!--具名插槽：footer-->
      <template v-slot:footer>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
        <el-button
          type="primary"
          size="default"
          @click="confirm"
          :loading="loading"
        >
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="Trademark">
// 引入组合式API函数
import { nextTick, reactive, ref, toRaw } from 'vue'
import type {
  FormInstance,
  FormRules,
  UploadFile,
  UploadInstance,
  UploadProps,
  UploadRawFile,
  UploadUserFile,
} from 'element-plus'
import { ElMessage } from 'element-plus'
import {
  PICTURE_UPLOAD_URL,
  reqAddOrUpdateTrademark,
  reqTrademark,
} from '@/api/product/trademark'
import type {
  Records,
  Trademark,
  TrademarkResponseData,
} from '@/api/product/trademark/type'
import useElTableHelper from '@/hooks/useElTableHelper'
import useElFormHelper from '@/hooks/useElFormHelper'

// 存储已有品牌数据
const trademarkArr = ref<Records>([])

// 获取已有品牌的接口封装为一个函数：在任何情况下想获取数据，调用此函数即可
const getHasTrademark = async () => {
  const result: TrademarkResponseData = await reqTrademark(
    pageNo.value,
    pageSize.value,
  )
  if (result.code === 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
  } else {
    return Promise.reject(new Error(result.message as string))
  }
}

const {
  tableRef,
  tableHeight,
  pageNo,
  pageSize,
  total,
  handleSizeChange,
  handleCurrentChange,
} = useElTableHelper(getHasTrademark)

// ==================================================华丽的分割线==================================================

const dialogVisible = ref<boolean>(false)
// 操作类型
const operType = ref('')
// 添加品牌按钮的回调
const addTrademark = () => {
  operType.value = '新增品牌'
  dialogVisible.value = true
  trademarkFormRef.value?.resetFields() // 重置该表单项，将其值重置为初始值，并移除校验结果
  avatarUploader.value?.clearFiles() // 清空已上传的文件列表
}
// 修改品牌按钮的回调
const updateTrademark = (row: Trademark) => {
  operType.value = '修改品牌'
  dialogVisible.value = true
  // 注意：这里使用nextTick的原因是，确保表单项初始化的值是空，进而能保证表单重置 resetFields() 时具有清空的效果
  nextTick(() => {
    Object.assign(trademarkForm, row) // 赋值表单
    avatarFileList.value = [
      { name: trademarkForm.tmName, url: trademarkForm.logoUrl },
    ] // 赋值文件
  })
}

// 控制按钮加载
let loading = ref(false)
// 对Form表单的引用
const trademarkFormRef = ref<FormInstance>()
// 定义收集新增品牌的数据
const trademarkForm = reactive<Trademark>({
  id: undefined,
  tmName: '',
  logoUrl: '',
})
// 定义表单校验需要的配置对象
const trademarkRules = reactive<FormRules<Trademark>>({
  /**
   * required 必输项
   * min 文本长度至少多少位
   * max 文本长度至多多少位
   * message 错误的提示信息
   * trigger 触发校验表单的时机， change->文本发生变化触发校验；blur->失去焦点触发校验
   */
  tmName: [
    {
      required: true,
      min: 2,
      message: '品牌名称长度至少2位',
      trigger: 'change',
    },
  ],
  logoUrl: [{ required: true, message: '请选择品牌LOGO', trigger: 'change' }],
})

// 上传图片组件
const avatarUploader = ref<UploadInstance>()
// 上传图片组件的fileList，与:show-file-list='true'建议联合使用，否则会出现文件表现不一致的情况（不影响业务所需提交的文件）
const avatarFileList = ref<UploadUserFile[]>([])
// 上传图片组件->上传之前的回调函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (
  rawFile: UploadRawFile,
) => {
  if (
    rawFile.type !== 'image/jpeg' &&
    rawFile.type !== 'image/png' &&
    rawFile.type !== 'image/gif'
  ) {
    ElMessage.error('上传的头像图片必须是 JPG|PNG|GIF 格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('上传的头像图片大小不能超过 2MB！')
    return false
  }
  return true
}
// 上传图片组件->上传成功的回调函数
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response: any,
  uploadFile: UploadFile,
) => {
  // response->即为当前这次上传图片post请求服务器返回的数据
  // trademarkForm.logoUrl = URL.createObjectURL(uploadFile.raw!) // blob:http://localhost:5173/406a0752-38ac-4360-accb-d5dc92e43cff
  trademarkForm.logoUrl = response.data
  if (avatarFileList.value.length > 1) avatarFileList.value.shift() // 剔除掉上一个文件
}

// 对话框底部取消按钮的回调
const cancel = () => {
  loading.value = false // 关闭进度提示
  dialogVisible.value = false // 关闭对话框
}
// 对话框底部确认按钮的回调
const confirm = async () => {
  try {
    loading.value = true
    // 保证全部表单项校验通过再发请求
    const { validateCallback } = useElFormHelper(true)
    await trademarkFormRef.value?.validate(validateCallback)

    const result: any = await reqAddOrUpdateTrademark(trademarkForm)
    if (result.code === 200) {
      await getHasTrademark() // 再次发送请求获取已有全部的品牌数据
      ElMessage.success(`${operType.value}成功！`)
    } else {
      ElMessage.error(`${operType.value}失败！${result.data}`)
    }
    loading.value = false // 关闭进度提示
    dialogVisible.value = false // 关闭对话框
  } catch (error) {
    loading.value = false
    ElMessage.error({
      dangerouslyUseHTMLString: true,
      message: (error as Error).message,
    })
  }
}
</script>

<style scoped lang="scss">
.tableClass {
  margin: 10px 0;
}

// 定义显示图片的大小
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style lang="scss">
// 后代选择器，定义头像框的边框线条+圆角边框+鼠标悬浮指针风格
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

// 后代选择器，定义悬浮时的样式
.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

// 交集选择器，定义+号的颜色和占用空间
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
