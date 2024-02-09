<template>
  <div>
    <el-card style="height: 75px">
      <el-form
        ref="roleQryFormRef"
        class="role-qry-form"
        :model="roleQryForm"
        :rules="roleQryRules"
        :inline="true"
      >
        <el-form-item label="职位搜索：" prop="roleName">
          <el-input
            placeholder="请你输入搜索职位名"
            v-model="roleQryForm.roleName"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="default" @click="search">
            搜索
          </el-button>
          <el-button type="default" size="default" @click="reset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0px">
      <el-button type="primary" size="default" icon="Plus" @click="addRole">
        添加职位
      </el-button>
      <!--表格展示角色的信息-->
      <el-table
        ref="roleTableRef"
        class="role-table"
        :data="roleList"
        :height="tableHeight"
        :max-height="tableHeight"
        border
        stripe
      >
        <el-table-column
          label="#"
          type="index"
          :index="(pageNo - 1) * pageSize + 1"
          width="80px"
          align="center"
          fixed
        ></el-table-column>
        <el-table-column label="ID" prop="id" width="100px"></el-table-column>
        <el-table-column
          label="职位名称"
          align="center"
          prop="roleName"
          min-width="120px"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          width="180px"
        ></el-table-column>
        <el-table-column
          label="更新时间"
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
              @click="assignMenu(row)"
            >
              分配权限
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateRole(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`确定要删除角色 ${row.roleName} 吗？`"
              width="280px"
              icon="Delete"
              @confirm="deleteRole(row)"
            >
              <template #reference>
                <el-button type="danger" size="small" icon="Delete">
                  删除
                </el-button>
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
      />
    </el-card>
    <!--dialog对话框：完成添加新的角色|更新已有的角色信息-->
    <el-dialog v-model="roleDialogVisible" width="550px">
      <template #header>
        <h4>操作角色</h4>
      </template>
      <el-form
        ref="roleFormRef"
        class="role-form"
        :model="roleForm"
        :rules="roleRules"
        label-width="100px"
      >
        <el-form-item label="角色名称：" prop="roleName">
          <el-input
            placeholder="请输入用户姓名"
            v-model="roleForm.roleName"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="flex: auto">
          <el-button type="primary" @click="roleDialogVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="saveOrUpdateRole">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <!--抽屉结构：完成角色权限的分配-->
    <el-drawer
      v-model="menuDrawerVisible"
      :direction="menuDrawerDirection"
      :show-close="false"
    >
      <template #header>
        <h4>分配权限</h4>
      </template>
      <template #default>
        <el-tree
          ref="menuTreeRef"
          :data="menuTreeData"
          :props="menuTreeDefaultProps"
          :node-key="menuTreeNodeId"
          show-checkbox
          :default-expanded-keys="menuTreeDefaultExpendedKeys"
          :default-checked-keys="menuTreeDefaultCheckedKeys"
        />
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button type="primary" @click="menuDrawerVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="doAssignMenu">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts" name="Role">
import { markRaw, reactive, ref } from 'vue'
import * as cloneDeep from 'lodash/cloneDeep'
import type { FormInstance, FormRules, ElTree } from 'element-plus'
import { ElMessage } from 'element-plus'
import type {
  MenuResponseData,
  MenuData,
  Role,
  RoleResponseData,
} from '@/api/acl/role/type'
import {
  reqAssignRolePermission,
  reqDeleteRole,
  reqRoleList,
  reqRolePermission,
  reqSaveOrUpdateRoleInfo,
} from '@/api/acl/role'
import useElFormHelper from '@/hooks/useElFormHelper'
import useElTableHelper from '@/hooks/useElTableHelper'
import { User } from '@/api/acl/user/type'
import { RolePermission } from '@/api/acl/role/type'
// ==================================================华丽的分割线==================================================
// 对Form表单的引用
const roleQryFormRef = ref<FormInstance>()
// 定义收集数据
const initRoleQryForm = markRaw({ roleName: '' })
// 深度拷贝后使用，避免污染初始的属性
const roleQryForm = reactive<Role>(cloneDeep(initRoleQryForm))
// 定义表单校验需要的配置对象
const roleQryRules = reactive<FormRules<Role>>({
  roleName: [{ required: false, trigger: 'blur' }],
})

// 搜索
const search = async () => {
  // 保证全部表单项校验通过再发请求
  const { validateCallback } = useElFormHelper(false)
  await roleQryFormRef.value?.validate(validateCallback)

  pageNo.value = 1
  await getRoleList()
}
// 重置
const reset = async () => {
  roleQryFormRef.value?.resetFields()

  pageNo.value = 1
  await getRoleList()
}
// ==================================================华丽的分割线==================================================
// 存储已有角色数据
const roleList = ref<any>([])

// 获取已有品牌的接口封装为一个函数：在任何情况下想获取数据，调用此函数即可
const getRoleList = async () => {
  const { roleName } = roleQryForm
  const result: RoleResponseData = await reqRoleList(
    pageNo.value,
    pageSize.value,
    roleName,
  )
  if (result.code === 200) {
    total.value = result.data.total
    roleList.value = result.data.records
  } else {
    return Promise.reject(new Error(result.message as string))
  }
}

const {
  tableRef: roleTableRef,
  tableHeight,
  pageNo,
  pageSize,
  total,
  handleSizeChange,
  handleCurrentChange,
} = useElTableHelper(83, getRoleList, 10)

// ==================================================华丽的分割线==================================================
// 抽屉是否显示
const roleDialogVisible = ref<boolean>(false)
// 对Form表单的引用
const roleFormRef = ref<FormInstance>()
// 定义收集数据
const initRoleForm = markRaw({
  id: undefined,
  createTime: '',
  updateTime: '',
  remark: '',
  roleName: '',
})
// 深度拷贝后使用，避免污染初始的属性
const roleForm = reactive<Role>(cloneDeep(initRoleForm))
// 定义表单校验需要的配置对象
const roleRules = reactive<FormRules<Role>>({
  roleName: [
    { required: true, min: 2, message: '角色名长度至少2位', trigger: 'blur' },
  ],
})

// 打开添加角色窗口
const addRole = () => {
  roleDialogVisible.value = true
  Object.assign(roleForm, cloneDeep(initRoleForm))
  roleFormRef.value?.clearValidate()
}

// 打开更新角色窗口
const updateRole = (row: User) => {
  roleDialogVisible.value = true
  Object.assign(roleForm, row) // 赋值表单
}

// 添加或更新角色信息
const saveOrUpdateRole = async () => {
  try {
    // 保证全部表单项校验通过再发请求
    const { validateCallback } = useElFormHelper(false)
    await roleFormRef.value?.validate(validateCallback)

    const result = await reqSaveOrUpdateRoleInfo(roleForm)
    if (result.code === 200) {
      roleDialogVisible.value = false

      if (!roleForm.id) pageNo.value = 1 // 若是新增，加载第一页数据；若是修改，更新当前页数据
      await getRoleList()
      ElMessage.success(roleForm.id ? '更新角色成功！' : '添加角色成功！')
    } else {
      ElMessage.error(
        `${roleForm.id ? '更新角色失败！' : '添加角色失败！'}${
          result.data || result.message
        }`,
      )
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}
// 删除角色
const deleteRole = async (row: User) => {
  try {
    const result = await reqDeleteRole(row.id as number)
    if (result.code === 200) {
      pageNo.value = 1
      await getRoleList()
      ElMessage.success('删除成功！')
    } else {
      ElMessage.error('删除失败！' + result.data || result.message)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}
// ==================================================华丽的分割线==================================================
// 抽屉是否显示
const menuDrawerVisible = ref<boolean>(false)
// 抽屉的出场方式：rtl-从右到左（默认）
const menuDrawerDirection = ref('rtl')
// 定义收集数据
const initMenuForm = markRaw({
  roleId: undefined,
  permissionIdList: [],
})
// 深度拷贝后使用，避免污染初始的属性
const menuForm = reactive<RolePermission>(cloneDeep(initMenuForm))

// 分配权限
const assignMenu = async (row: User) => {
  menuDrawerVisible.value = true
  menuForm.roleId = row.id as number

  /**
   * 提取菜单树数据的叶子节点中的选中项菜单ID，并聚合到初始菜单ID数组
   * @param menuTreeData 菜单树数据
   * @param initMenuIds 初始菜单ID数组
   * @returns 仅包含叶子节点被选中的菜单ID
   */
  function filterSelectedMenuIds(
    menuTreeData: MenuData[],
    initMenuIds: number[],
  ) {
    menuTreeData.forEach((item) => {
      if (item.children && item.children.length > 0) {
        // 如果当前菜单有子菜单，则递归调用filterSelectedMenuIds函数
        filterSelectedMenuIds(item.children, initMenuIds)
      } else {
        if (item.select) {
          // 如果当前菜单被选中，则将其ID添加到初始菜单ID数组中
          initMenuIds.push(item.id)
        }
      }
    })
    return initMenuIds
  }

  const result: MenuResponseData = await reqRolePermission(row.id as number)
  if (result.code === 200) {
    menuTreeData.value = result.data
    menuTreeDefaultCheckedKeys.value = filterSelectedMenuIds(result.data, [])
  } else {
    ElMessage.error('获取角色权限失败！' + result.data || result.message)
  }
}

// 执行权限分配
const doAssignMenu = async () => {
  const halfCheckedKeys = menuTreeRef.value?.getHalfCheckedKeys()
  const checkedKeys = menuTreeRef.value?.getCheckedKeys(false)
  menuForm.permissionIdList = [...halfCheckedKeys, ...checkedKeys]
  const result = await reqAssignRolePermission(menuForm)
  if (result.code === 200) {
    menuDrawerVisible.value = false
    ElMessage.success('分配权限成功！')
  } else {
    ElMessage.error('分配权限失败！' + result.data || result.message)
  }
}
// ==================================================华丽的分割线==================================================
// 创建一个ref，用于存储ElTree实例
const menuTreeRef = ref<InstanceType<typeof ElTree>>()

// 菜单树数据
const menuTreeData = ref<MenuData[]>([])

// 默认菜单树属性
const menuTreeDefaultProps = {
  children: 'children',
  label: 'name',
}

// 菜单树节点的唯一标识符
const menuTreeNodeId = 'id'

// 默认展开的菜单项的键值数组
const menuTreeDefaultExpendedKeys = ref<number[]>([1])

// 默认选中的菜单树节点的键
const menuTreeDefaultCheckedKeys = ref<number[]>([])

// ==================================================华丽的分割线==================================================
</script>

<style scoped lang="scss">
.role-qry-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.role-table {
  margin: 10px 0px;
}

.role-form {
  width: 90%;
}
</style>
