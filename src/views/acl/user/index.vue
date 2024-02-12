<template>
  <div>
    <el-card style="height: 75px">
      <el-form
        ref="userQryFormRef"
        class="user-qry-form"
        :model="userQryForm"
        :rules="userQryRules"
        :inline="true"
      >
        <el-form-item label="用户名：" prop="username">
          <el-input
            placeholder="请你输入搜索用户名"
            v-model="userQryForm.username"
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
      <el-button type="primary" size="default" icon="Plus" @click="addUser">
        操作用户
      </el-button>
      <el-button
        type="danger"
        size="default"
        icon="Delete"
        :disabled="userSelectedList.length <= 0"
        @click="batchDelete"
      >
        批量删除
      </el-button>
      <!--表格展示用户的信息-->
      <el-table
        ref="userTableRef"
        class="user-table"
        :data="userList"
        :height="tableHeight"
        :max-height="tableHeight"
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
          label="登录名"
          prop="username"
          width="120px"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="用户名称"
          prop="name"
          width="120px"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="用户角色"
          prop="roleName"
          min-width="120px"
          :show-overflow-tooltip="true"
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
              @click="assignRole(row)"
            >
              分配角色
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateUser(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`确定要删除用户 ${row.name} 吗？`"
              width="280px"
              icon="Delete"
              @confirm="deleteUser(row)"
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
    <!--抽屉结构：完成添加新的用户账号|更新已有的账号信息-->
    <el-drawer
      v-model="userDrawerVisible"
      :direction="userDrawerDirection"
      :show-close="false"
    >
      <template #header>
        <h4>添加用户</h4>
      </template>
      <template #default>
        <el-form
          ref="userFormRef"
          class="user-form"
          :model="userForm"
          :rules="userRules"
          label-width="100px"
        >
          <el-form-item label="用户姓名：" prop="username">
            <el-input
              placeholder="请输入用户姓名"
              v-model="userForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户昵称：" prop="name">
            <el-input
              placeholder="请输入用户昵称"
              v-model="userForm.name"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="用户密码："
            prop="password"
            v-show="!userForm.id"
          >
            <el-input
              type="password"
              placeholder="请输入用户密码"
              v-model="userForm.password"
              show-password
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button type="primary" @click="userDrawerVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="saveOrUpdateUser">确定</el-button>
        </div>
      </template>
    </el-drawer>
    <!--抽屉结构：角色分配-->
    <el-drawer
      v-model="roleDrawerVisible"
      :direction="roleDrawerDirection"
      :show-close="false"
    >
      <template #header>
        <h4>角色分配</h4>
      </template>
      <template #default>
        <el-form
          ref="roleFormRef"
          class="role-form"
          :model="roleForm"
          :rules="roleRules"
          label-width="100px"
        >
          <el-form-item label="用户姓名：">
            <el-input :disabled="true" v-model="roleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="角色列表：" class="role-form-item">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
              style="display: inline-block"
            >
              全选
            </el-checkbox>
            <!--显示职位的复选框-->
            <el-checkbox-group
              v-model="userRoles"
              @change="handleCheckedRolesChange"
            >
              <el-checkbox
                v-for="role in allRoles"
                :key="role.id"
                :label="role"
              >
                {{ role.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button type="primary" @click="roleDrawerVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="doAssignRole">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts" name="User">
import { markRaw, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import type {
  AllRole,
  RoleData,
  SetRoleData,
  User,
  UserResponseData,
} from '@/api/acl/user/type'
import {
  reqDeleteUser,
  reqBatchDeleteUser,
  reqSaveOrUpdateUserInfo,
  reqUserList,
  reqAllRole,
  reqSetUserRole,
} from '@/api/acl/user'
import useElFormHelper from '@/hooks/useElFormHelper'
import useElTableHelper from '@/hooks/useElTableHelper'
import * as cloneDeep from 'lodash/cloneDeep'
import useUserStore from '@/store/modules/user'
// ==================================================华丽的分割线==================================================
// 对Form表单的引用
const userQryFormRef = ref<FormInstance>()
// 定义收集数据
const initUserQryForm = markRaw({ username: '' })
// 深度拷贝后使用，避免污染初始的属性
const userQryForm = reactive<User>(cloneDeep(initUserQryForm))
// 定义表单校验需要的配置对象
const userQryRules = reactive<FormRules<User>>({
  username: [{ required: false, trigger: 'blur' }],
})

// 搜索
const search = async () => {
  // 保证全部表单项校验通过再发请求
  const { validateCallback } = useElFormHelper(false)
  await userQryFormRef.value?.validate(validateCallback)

  pageNo.value = 1
  await getUserList()
}
// 重置
const reset = async () => {
  userQryFormRef.value?.resetFields()
  pageNo.value = 1
  await getUserList()
}
// ==================================================华丽的分割线==================================================
// 存储已有用户数据
const userList = ref<User[]>([])

// 获取已有品牌的接口封装为一个函数：在任何情况下想获取数据，调用此函数即可
const getUserList = async () => {
  const { username } = userQryForm
  const result: UserResponseData = await reqUserList(
    pageNo.value,
    pageSize.value,
    username,
  )
  if (result.code === 200) {
    total.value = result.data.total
    userList.value = result.data.records
  } else {
    return Promise.reject(new Error(result.message as string))
  }
}

const {
  tableRef: userTableRef,
  tableHeight,
  pageNo,
  pageSize,
  total,
  handleSizeChange,
  handleCurrentChange,
} = useElTableHelper(83, getUserList)

// 存储已选择的用户数据
const userSelectedList = ref<User[]>([])
const handleSelectionChange = (val: User[]) => {
  userSelectedList.value = val
}
// ==================================================华丽的分割线==================================================
// 抽屉是否显示
const userDrawerVisible = ref<boolean>(false)
// 抽屉的出场方式：rtl-从右到左（默认）
const userDrawerDirection = ref('rtl')
// 对Form表单的引用
const userFormRef = ref<FormInstance>()
// 定义收集数据
const initUserForm = markRaw({
  id: undefined,
  createTime: '',
  updateTime: '',
  username: '',
  name: '',
  password: '',
  phone: '',
  roleName: '',
})
// 深度拷贝后使用，避免污染初始的属性
const userForm = reactive<User>(cloneDeep(initUserForm))
// 校验密码
const validatorPassword = (rule: any, value: any, callback: any) => {
  // 如果是修改，不需要校验密码！
  if (userForm.id) {
    callback()
  }

  if (/^\w{6,64}$/.test(value)) {
    callback()
  } else {
    callback(new Error('密码长度6-64位！'))
  }
}
// 定义表单校验需要的配置对象
const userRules = reactive<FormRules<User>>({
  username: [
    { required: true, min: 5, message: '用户姓名长度至少5位', trigger: 'blur' },
  ],
  name: [
    { required: true, min: 5, message: '用户昵称长度至少5位', trigger: 'blur' },
  ],
  password: [
    {
      trigger: 'blur',
      validator: validatorPassword,
    },
  ],
})

// 引入用户相关的小仓库
const userStore = useUserStore()
// 当前用户是否被修改了？
const currUserChged = ref<boolean>(false)
watch(
  () => userForm.username,
  (nv, ov) => {
    currUserChged.value = userStore.username === nv
  },
  { immediate: true },
)
// [lm's ps]: 20240211 21:52 表单重置方式三：blur+clearValidate【推荐】
// 打开添加用户窗口
const addUser = () => {
  userDrawerVisible.value = true
  Object.assign(userForm, cloneDeep(initUserForm))
  userFormRef.value?.clearValidate()
}
// 打开更新用户窗口
const updateUser = (row: User) => {
  userDrawerVisible.value = true
  Object.assign(userForm, cloneDeep(row)) // 赋值表单
  userFormRef.value?.clearValidate()
}
// 添加或更新用户信息
const saveOrUpdateUser = async () => {
  try {
    // 保证全部表单项校验通过再发请求
    const { validateCallback } = useElFormHelper(false)
    await userFormRef.value?.validate(validateCallback)

    const result = await reqSaveOrUpdateUserInfo(userForm)
    if (result.code === 200) {
      userDrawerVisible.value = false

      // 若是当前用户被修改了，则刷新页面
      if (currUserChged.value) {
        // 浏览器自动刷新一次
        window.location.reload()
      } else {
        if (!userForm.id) pageNo.value = 1 // 若是新增，加载第一页数据；若是修改，更新当前页数据
        await getUserList()
      }
      ElMessage.success(userForm.id ? '更新账号成功！' : '添加账号成功！')
    } else {
      ElMessage.error(
        `${userForm.id ? '更新账号失败！' : '添加账号失败！'}${
          result.data || result.message
        }`,
      )
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}
// 删除用户
const deleteUser = async (row: User) => {
  try {
    const result = await reqDeleteUser(row.id as number)
    if (result.code === 200) {
      pageNo.value = 1
      await getUserList()
      ElMessage.success('删除成功！')
    } else {
      ElMessage.error('删除失败！' + result.data || result.message)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}
// 批量删除用户
const batchDelete = async () => {
  try {
    const idList: number[] = userSelectedList.value.map((item) => {
      return item.id as number
    })
    const result = await reqBatchDeleteUser(idList)
    if (result.code === 200) {
      pageNo.value = 1
      await getUserList()
      ElMessage.success('批量删除成功！')
    } else {
      ElMessage.error('批量删除失败！' + result.data || result.message)
    }
  } catch (error) {
    ElMessage.error((error as Error).message)
  }
}
// ==================================================华丽的分割线==================================================
// 抽屉是否显示
const roleDrawerVisible = ref<boolean>(false)
// 抽屉的出场方式：rtl-从右到左（默认）
const roleDrawerDirection = ref('rtl')
// 对Form表单的引用
const roleFormRef = ref<FormInstance>()
// 深度拷贝后使用，避免污染初始的属性
const roleForm = reactive<User>(cloneDeep(initUserForm))
// 定义表单校验需要的配置对象
const roleRules = reactive<FormRules<User>>({
  // username: [{ required: false, trigger: 'blur' }],
})

const checkAll = ref<boolean>(false) // 是否已经全选
const isIndeterminate = ref(true) // 设置checkbox不确定状态，仅负责样式控制，默认false
const allRoles = ref<AllRole>([]) // 所有选项
const userRoles = ref<AllRole>([]) // 已选
const handleCheckAllChange = (val: boolean) => {
  userRoles.value = val ? allRoles.value : []
  isIndeterminate.value = false
}
const handleCheckedRolesChange = (value: AllRole) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allRoles.value.length
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRoles.value.length
}
// 分配角色
const assignRole = async (row: User) => {
  roleDrawerVisible.value = true
  Object.assign(roleForm, cloneDeep(row)) // 赋值表单
  // 获取全部职位以及当前用户拥有的职位信息
  const result = await reqAllRole(row.id as number)
  if (result.code === 200) {
    allRoles.value = result.data.allRolesList
    userRoles.value = result.data.assignRoles
    handleCheckedRolesChange(userRoles.value)
  }
}
// 执行角色分配
const doAssignRole = async () => {
  try {
    const roleIdList = userRoles.value.reduce(
      (prev: number[], curr: RoleData) => {
        prev.push(curr.id as number)
        return prev
      },
      [],
    )
    const data: SetRoleData = { userId: roleForm.id as number, roleIdList }
    const result = await reqSetUserRole(data)
    if (result.code === 200) {
      roleDrawerVisible.value = false
      await getUserList()
      ElMessage.success('分配角色成功！')
    } else {
      ElMessage.error('分配角色失败！' + result.data || result.message)
    }
  } catch (e) {
    ElMessage.error((e as Error).message)
  }
}
// ==================================================华丽的分割线==================================================
</script>

<style scoped lang="scss">
.user-qry-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-table {
  margin: 10px 0px;
}

.user-form {
  width: 90%;
}

// 深度穿透，配置角色列表的表单项布局
.role-form .role-form-item {
  ::v-deep .el-form-item__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
