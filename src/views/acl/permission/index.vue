<template>
  <div>
    <el-card>
      <el-table
        ref="permissionTableRef"
        class="permission-table"
        :data="permissionList"
        :height="tableHeight"
        :max-height="tableHeight"
        border
        stripe
        row-key="id"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column
          label="名称"
          prop="name"
          width="200px"
          fixed="left"
        ></el-table-column>
        <el-table-column label="权限值" prop="code"></el-table-column>
        <el-table-column
          label="修改时间"
          prop="updateTime"
          width="180px"
        ></el-table-column>
        <el-table-column
          label="操作"
          width="300px"
          align="center"
          fixed="right"
        >
          <template v-slot="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="User"
              :disabled="row.type === 2"
              @click="addPermission(row)"
            >
              添加
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              :disabled="row.level === 1"
              @click="updatePermission(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`确定要删除权限 ${row.name} 吗？`"
              width="280px"
              icon="Delete"
              @confirm="deletePermission(row)"
            >
              <template #reference>
                <el-button
                  type="danger"
                  size="small"
                  icon="Delete"
                  :disabled="row.level === 1"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--dialog对话框：完成添加新的角色|更新已有的角色信息-->
    <el-dialog v-model="permissionDialogVisible" width="550px">
      <template #header>
        <h4>操作菜单</h4>
      </template>
      <el-form
        ref="permissionFormRef"
        class="permission-form"
        :model="permissionForm"
        :rules="permissionRules"
        label-width="100px"
      >
        <el-form-item label="菜单名称：" prop="name">
          <el-input
            placeholder="请输入菜单姓名"
            v-model="permissionForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限值：" prop="code">
          <el-input
            placeholder="请输入权限值"
            v-model="permissionForm.code"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="flex: auto">
          <el-button type="primary" @click="permissionDialogVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="saveOrUpdatePermission">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="Permission">
import { markRaw, nextTick, reactive, ref } from 'vue'
import type {
  Permission,
  PermissionResponseData,
} from '@/api/acl/permission/type'
import { reqPermissionList } from '@/api/acl/permission'
import useElTableHelper from '@/hooks/useElTableHelper'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import * as cloneDeep from 'lodash/cloneDeep'
import { User } from '@/api/acl/user/type'
import useElFormHelper from '@/hooks/useElFormHelper'
import { reqDeleteRole, reqSaveOrUpdateRoleInfo } from '@/api/acl/role'

// ==================================================华丽的分割线==================================================
const permissionList = ref<Permission[]>([])

// 获取已有品牌的接口封装为一个函数：在任何情况下想获取数据，调用此函数即可
const getPermissionList = async () => {
  const result: PermissionResponseData = await reqPermissionList()
  if (result.code === 200) {
    permissionList.value = result.data
  } else {
    return Promise.reject(new Error(result.message as string))
  }
}

const { tableRef: permissionTableRef, tableHeight } = useElTableHelper(
  53,
  getPermissionList,
  10,
)
// ==================================================华丽的分割线==================================================
// 对话框是否显示
const permissionDialogVisible = ref<boolean>(false)
// 对Form表单的引用
const permissionFormRef = ref<FormInstance>()
// 定义收集数据
const initPermissionForm = markRaw({
  id: undefined,
  code: '',
  toCode: '',
  type: undefined,
  pid: undefined,
  name: '',
})
// 深度拷贝后使用，避免污染初始的属性
const permissionForm = reactive<Permission>(cloneDeep(initPermissionForm))
// 定义表单校验需要的配置对象
const permissionRules = reactive<FormRules<Permission>>({
  name: [
    { required: true, min: 2, message: '菜单名长度至少2位', trigger: 'blur' },
  ],
  code: [
    { required: true, min: 2, message: '权限值长度至少2位', trigger: 'blur' },
  ],
})

// 打开添加菜单窗口
const addPermission = (row: Permission) => {
  permissionDialogVisible.value = true
  Object.assign(permissionForm, cloneDeep(initPermissionForm))
  permissionFormRef.value?.clearValidate()
}

// 打开更新菜单窗口
const updatePermission = (row: Permission) => {
  permissionDialogVisible.value = true
  Object.assign(permissionForm, cloneDeep(row)) // 赋值表单
  permissionFormRef.value?.clearValidate()
}

// 添加或更新角色信息
const saveOrUpdatePermission = async () => {
  try {
    // 保证全部表单项校验通过再发请求
    const { validateCallback } = useElFormHelper(false)
    await permissionFormRef.value?.validate(validateCallback)

    const result = await reqSaveOrUpdateRoleInfo(permissionForm)
    if (result.code === 200) {
      permissionDialogVisible.value = false

      await getPermissionList()
      ElMessage.success(permissionForm.id ? '更新菜单成功！' : '添加菜单成功！')
    } else {
      ElMessage.error(
        `${permissionForm.id ? '更新菜单失败！' : '添加菜单失败！'}${
          result.data || result.message
        }`,
      )
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}
// 删除菜单
const deletePermission = async (row: User) => {
  try {
    const result = await reqDeleteRole(row.id as number)
    if (result.code === 200) {
      await getPermissionList()
      ElMessage.success('删除成功！')
    } else {
      ElMessage.error('删除失败！' + result.data || result.message)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}
// ==================================================华丽的分割线==================================================
</script>

<style scoped lang="scss">
.permission-table {
  margin: 10px 0px;
}

.permission-form {
  width: 90%;
}
</style>
