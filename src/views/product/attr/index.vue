<template>
  <div>
    <!--三级分类全局组件-->
    <Category ref="categoryRef"></Category>
    <el-card style="margin: 10px 0">
      <div v-show="scene === 0">
        <el-button
          type="primary"
          icon="Plus"
          :disabled="disableAttrOpeator"
          @click="addAttr"
        >
          添加平台属性
        </el-button>
        <el-table
          ref="attrTableRef"
          class="attr-table"
          :data="attrArr"
          :height="attrTableHeight"
          :max-height="attrTableHeight"
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
            label="属性名称"
            prop="attrName"
            width="120px"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template v-slot="{ row, $index }">
              共{{ row.attrValueList.length }}个
              <el-tag
                v-for="item in row.attrValueList"
                :key="item.id"
                style="margin-left: 5px"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="属性操作"
            width="120px"
            align="center"
            fixed="right"
          >
            <template v-slot="{ row, $index }">
              <el-button
                type="warning"
                size="small"
                icon="Edit"
                :disabled="disableAttrOpeator"
                @click="updateAttr(row)"
              ></el-button>
              <el-popconfirm
                :title="`确定要删除属性 ${row.attrName} 吗？`"
                width="280px"
                icon="Delete"
                @confirm="removeAttr($event, row)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    size="small"
                    icon="Delete"
                    :disabled="disableAttrOpeator"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene === 1">
        <el-form
          ref="attrFormRef"
          :model="attrForm"
          :rules="attrRules"
          :inline="true"
          label-width="134px"
        >
          <el-form-item label="属性名称：" prop="attrName">
            <el-input
              placeholder="请您输入属性名称"
              v-model="attrForm.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="Plus"
          :disabled="!attrForm.attrName"
          @click="addAttrValue"
        >
          添加属性值
        </el-button>
        <el-button type="default" @click="cancelAttr">取消</el-button>
        <el-table
          ref="attrValueTableRef"
          class="attr-value-table"
          :data="attrForm.attrValueList"
          :height="attrValueTableHeight"
          :max-height="attrValueTableHeight"
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
          <el-table-column label="属性值名称" prop="attrValueName">
            <template v-slot="{ row, $index }">
              <el-input
                v-if="row.edit"
                placeholder="请输入属性值名称"
                v-model.trim="row.valueName"
                @blur="toReadMode(row, $index)"
                @keyup.enter="inputRefArr[$index].blur()"
                :ref="(el) => (inputRefArr[$index] = el)"
              ></el-input>
              <div
                v-else
                @click="toEditMode(row, $index)"
                class="attr-value-div"
              >
                {{ row.valueName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="属性值操作"
            width="120px"
            align="center"
            fixed="right"
          >
            <template v-slot="{ row, $index }">
              <el-button
                type="danger"
                size="small"
                icon="Delete"
                @click="removeAttrValue($index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="saveAttrValue"
          :disabled="attrForm.attrValueList.length === 0"
        >
          保存
        </el-button>
        <el-button type="default" @click="cancelAttr">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="Attr">
import { computed, markRaw, nextTick, reactive, ref, watch } from 'vue' // 引入获取已有属性与属性值接口
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import cloneDeep from 'lodash/cloneDeep' // [lm's ps]: 20240226 17:28 为了编译通过而调整
import type { FormInstance, FormRules } from 'element-plus'
import useCategoryStore from '@/store/modules/category'
import {
  reqAttr,
  reqAddOrUpdateAttrInfo,
  reqRemoveAttrInfo,
} from '@/api/product/attr'
import type {
  Attr,
  AttrList,
  AttrValue,
  AttrResponseData,
} from '@/api/product/attr/type'
import { StringResponseData } from '@/api/base'
import useElTableHelper from '@/hooks/useElTableHelper'
import useElFormHelper from '@/hooks/useElFormHelper'

// 引用分类组件
const categoryRef = ref()
const categoryStore = useCategoryStore()
const { c3Id } = storeToRefs(categoryStore)
// 全局禁用属性操作：若分类信息缺失，禁用操作
const disableAttrOpeator = computed(() => {
  return !c3Id.value
})

// 存储已有的属性与属性值
const attrArr = ref<AttrList>([])
// 监听仓库三级分类ID变化
watch(c3Id, () => getAttr())
// 获取已有的属性与属性值
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  if (!c3Id) return
  const result: AttrResponseData = await reqAttr(
    <number>c1Id,
    <number>c2Id,
    <number>c3Id,
  )
  if (result.code === 200) {
    attrArr.value = result.data
  } else {
    return Promise.reject(new Error(result.message))
  }
}

const { tableRef: attrTableRef, tableHeight: attrTableHeight } =
  useElTableHelper(61, () => {})
// ==================================================华丽的分割线==================================================
// 定义卡片内容切换的变量：scene=0，显示table；scene=1，显示添加|修改属性
const scene = ref<number>(0)

// 监听场景值的变化
watch(
  scene,
  () =>
    nextTick(() => {
      categoryRef.value.setDisabled(scene.value === 1)
      // scene=1时触发调整属性添加|修改页面中table的高度
      if (scene.value === 1) attrValueSetHeight()
    }),
  { immediate: true },
)

// [lm's ps]: 20240211 21:44 表单重置方式二：change+clearValidate
// 添加属性的回调->进入添加页面
const addAttr = () => {
  scene.value = 1
  // 展示属性添加页面时，先清空数据；注意：resetFields()是有局限性的，仅能重置<el-form-item>标签的prop属性指定过的属性
  Object.assign(attrForm, cloneDeep(initAttrForm))
  // 重置到初始化的效果
  attrForm.categoryId = c3Id.value
  /*
  清理表单验证信息：假若表单验证使用了change而不是blur
  为什么使用setTimeout？点击修改=>返回商品列表=>点击新增，此时触发验证，显示了校验错误信息
  注意：这里使用resetFields()可行，但过重！使用nextTick也无效！
   */
  setTimeout(() => attrFormRef.value?.clearValidate(), 0)
}
// 修改属性的回调->进入修改页面
const updateAttr = (row: Attr) => {
  scene.value = 1
  // 表单验证使用了change而不是blur时，这里会触发重新验证
  Object.assign(attrForm, cloneDeep(row))
}
// 删除属性的回调->进入修改页面
const removeAttr = async (event: MouseEvent, row: Attr) => {
  try {
    const result: StringResponseData = await reqRemoveAttrInfo(row.id as number)
    if (result.code === 200) {
      await getAttr() // 再次发送请求获取已有全部的属性数据
      ElMessage.success(`删除属性成功！`)
    } else {
      ElMessage.error(`删除属性失败！${result.data || result.message}`)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}
// 取消操作属性的回调
const cancelAttr = () => {
  scene.value = 0
}

// 对Form表单的引用
const attrFormRef = ref<FormInstance>()
// 定义收集属性的数据
const initAttrForm = markRaw({
  id: undefined,
  attrName: '',
  categoryId: undefined,
  categoryLevel: 3,
  attrValueList: [
    // {
    //   attrId: undefined,
    //   id: undefined,
    //   valueName: '',
    // },
  ],
})
// 深度拷贝后使用，避免污染初始的属性
const attrForm = reactive<Attr>(cloneDeep(initAttrForm))
// 定义表单校验需要的配置对象
const attrRules = reactive<FormRules<Attr>>({
  attrName: [
    {
      required: true,
      min: 2,
      message: '属性名称长度至少2位',
      trigger: 'change',
    },
  ],
})

// 准备一个数组：将来存储对应的组件实例el-input
const inputRefArr = ref<any>([])

// 添加属性及其值的回调->收集数据
const addAttrValue = async () => {
  try {
    // 保证全部表单项校验通过再发请求
    const { validateCallback } = useElFormHelper()
    await attrFormRef.value?.validate(validateCallback)

    attrForm.attrValueList.push({
      valueName: '',
      edit: true,
    })

    await nextTick(() =>
      inputRefArr.value[attrForm.attrValueList.length - 1].focus(),
    )
  } catch (error) {
    ElMessage.error({
      dangerouslyUseHTMLString: true,
      message: (error as Error).message,
    })
  }
}
// 删除属性值的回调
const removeAttrValue = ($index) => {
  inputRefArr.value.splice($index, 1)
  attrForm.attrValueList.splice($index, 1)
}
// 进入阅读模式
const toReadMode = (row: AttrValue, $index: number) => {
  if (!row.valueName) {
    attrForm.attrValueList.splice($index, 1)
    return ElMessage.error('属性值不允许为空！')
  }
  const existDuplicate = attrForm.attrValueList
    .filter((item) => item !== row)
    .some((item) => item.valueName === row.valueName)
  if (existDuplicate) {
    attrForm.attrValueList.splice($index, 1)
    return ElMessage.error('属性值不允许重复！')
  }
  row.edit = false
}
// 进入编辑模式
const toEditMode = (row: AttrValue, $index: number) => {
  row.edit = true
  nextTick(() => inputRefArr.value[$index].focus())
}
// 保存属性及其值的回调->保存数据
const saveAttrValue = async () => {
  try {
    // 保证全部表单项校验通过再发请求
    const { validateCallback } = useElFormHelper()
    await attrFormRef.value?.validate(validateCallback)

    const existInvalid = attrForm.attrValueList.some((item) => !item.valueName)
    if (existInvalid) {
      return ElMessage.error('存在属性值为空的记录！')
    }

    const result: StringResponseData = await reqAddOrUpdateAttrInfo(attrForm)
    if (result.code === 200) {
      scene.value = 0
      ElMessage.success(attrForm.id ? '修改属性成功！' : '添加属性成功！')
      await getAttr() // 刷新属性列表
    } else {
      ElMessage.error(
        (attrForm.id ? '修改属性失败！' : '添加属性失败！') +
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
const {
  tableRef: attrValueTableRef,
  tableHeight: attrValueTableHeight,
  setHeight: attrValueSetHeight,
} = useElTableHelper(93, () => {})
</script>

<style scoped lang="scss">
.attr-table {
  margin: 10px 0;
}

.attr-value-table {
  margin: 10px 0;
}

.attr-value-div {
  background-image: linear-gradient(
    to right,
    pink,
    skyblue,
    yellowgreen,
    green
  );
  color: black;
}
</style>
