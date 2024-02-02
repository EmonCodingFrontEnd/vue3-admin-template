<template>
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
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px">
    <el-button type="primary" size="default" icon="Plus" @click="addUser">
      添加用户
    </el-button>
    <el-button type="danger" size="default" icon="Delete" @click="batchDelete">
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
      ></el-table-column>
      <el-table-column
        label="用户名称"
        prop="name"
        width="120px"
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
      <el-table-column label="操作" width="300px" align="center" fixed="right">
        <template v-slot="{ row, $index }">
          <el-button type="primary" size="small" icon="User">
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
            :title="`确定要删除用户 ${row.tmName} 吗？`"
            width="280px"
            icon="Delete"
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
    v-model="drawerVisible"
    :direction="drawerDirection"
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
        <el-form-item label="用户密码：" prop="password">
          <el-input
            type="password"
            placeholder="请输入用户密码"
            v-model="userForm.password"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button type="primary" @click="drawerVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="saveOrUpdateUser">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="User">
import { markRaw, nextTick, reactive, ref } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import type { User, UserResponseData } from '@/api/acl/user/type'
import { reqSaveOrUpdateUserInfo, reqUserList } from '@/api/acl/user'
import useElFormHelper from '@/hooks/useElFormHelper'
import useElTableHelper from '@/hooks/useElTableHelper'
import * as cloneDeep from 'lodash/cloneDeep'
import { TrademarkResponseData } from '@/api/product/trademark/type'
import { reqTrademark } from '@/api/product/trademark'
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
const reset = () => {
  userQryFormRef.value?.resetFields()
}
// ==================================================华丽的分割线==================================================
// 存储已有用户数据
const userList = ref<User[]>([])

// 获取已有品牌的接口封装为一个函数：在任何情况下想获取数据，调用此函数即可
const getUserList = async () => {
  const result: UserResponseData = await reqUserList(
    pageNo.value,
    pageSize.value,
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

// ==================================================华丽的分割线==================================================
// 抽屉是否显示
const drawerVisible = ref<boolean>(false)
// 抽屉的出场方式：rtl-从右到左（默认）
const drawerDirection = ref('rtl')
// 对Form表单的引用
const userFormRef = ref<FormInstance>()
// 定义收集数据
const initUserForm = markRaw({
  id: undefined,
  username: '',
  name: '',
  password: '',
})
// 深度拷贝后使用，避免污染初始的属性
const userForm = reactive<User>(cloneDeep(initUserForm))
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
      required: true,
      min: 6,
      max: 64,
      message: '密码长度6-64位',
      trigger: 'blur',
    },
  ],
})

// 更新用户
const saveOrUpdateUser = async () => {
  try {
    // 保证全部表单项校验通过再发请求
    const { validateCallback } = useElFormHelper(false)
    await userFormRef.value?.validate(validateCallback)

    const result = await reqSaveOrUpdateUserInfo(userForm)
    if (result.code === 200) {
      drawerVisible.value = false
      await getUserList()
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
// ==================================================华丽的分割线==================================================

// 添加用户
const addUser = () => {
  drawerVisible.value = true
  Object.assign(userForm, cloneDeep(initUserForm))
  userFormRef.value?.clearValidate()
}
// 批量删除用户
const batchDelete = () => {}
// 更新用户
const updateUser = (row: User) => {
  drawerVisible.value = true
  Object.assign(userForm, row) // 赋值表单
}
</script>

<style scoped lang="scss">
.user-qry-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-form {
  width: 90%;
}

.user-table {
  margin: 10px 0px;
}
</style>
