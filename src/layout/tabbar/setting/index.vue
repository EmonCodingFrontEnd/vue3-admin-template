<template>
  <el-button
    size='small'
    icon='Refresh'
    circle
    type='success'
    @click='updateRefresh'
  ></el-button>

  <el-button
    size='small'
    icon='FullScreen'
    circle
    type='warning'
    @click='fullScreen'
  ></el-button>

  <el-popover
    placement='bottom'
    title='主题设置'
    :width='300'
    :visible='settingVisible'
  >
    <el-form class='setting-form'>
      <el-form-item label='主题颜色：'>
        <el-color-picker
          v-model='color'
          show-alpha
          :predefine='predefineColors'
          @change='changeColor'
        />
      </el-form-item>
      <el-form-item label='暗黑模式：'>
        <el-switch
          v-model='dark'
          inline-prompt
          style='--el-switch-on-color: #303133; --el-switch-off-color: #e6e8eb'
          active-icon='MoonNight'
          inactive-icon='Sunny'
          @change='changeDark'
        />
      </el-form-item>
      <el-form-item>
        <el-button @click='settingVisible = false'>关闭</el-button>
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button
        size='small'
        icon='Setting'
        circle
        type='primary'
        @click='settingVisible = true'
      ></el-button>
    </template>
  </el-popover>

  <img
    :src='userStore.avatar'
    style='width: 24px; height: 24px; margin: 0px 10px; border-radius: 50%'
  />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class='el-dropdown-link'>
      {{ userStore.username }}
      <el-icon class='el-icon--right'>
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click='logout'>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang='ts' name='Setting'>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
// 获取用户相关的小仓库
import useUserStore from '@/store/modules/user'
// 获取骨架的小仓库
import useLayoutSettingStore from '@/store/modules/setting'

let router = useRouter() // 路由器对象
let route = useRoute() // 路由对象
let userStore = useUserStore()

let layoutSettingStore = useLayoutSettingStore()
const { refresh, themeDark } = storeToRefs(layoutSettingStore)
// 刷新按钮点击回调
const updateRefresh = () => {
  refresh.value = !refresh.value
}
// ==================================================华丽的分割线==================================================

// 全屏按钮点击回调
const fullScreen = () => {
  // DOM对象的一个属性：可以用来判断当前是不是全屏模式：true-是；false-否。
  let full = document.fullscreenElement
  if (!full) {
    // 利用文档根节点的方法实现全屏模式
    document.documentElement.requestFullscreen()
  } else {
    // 退出全屏模式
    document.exitFullscreen()
  }
}

// ==================================================华丽的分割线==================================================
const settingVisible = ref<boolean>(false)

const color = ref<string>('#1e90ff')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
const changeColor = (val: string) => {
  const html = document.documentElement
  // 设置 css 变量
  html.style.setProperty('--el-color-primary', val)
}

const dark = ref<boolean>(themeDark.value)
const changeDark = (val: boolean) => {
  layoutSettingStore.setThemeDark(val)
  const html = document.documentElement
  if (val) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}
changeDark(dark.value)
// ==================================================华丽的分割线==================================================

// 退出登录点击回调
const logout = async () => {
  // 第一件事：需要向服务器发送请求[退出登录接口]
  // 第二件事情：仓库当中关于用户相关的数据清空[token|username|avatar]
  await userStore.userLogout()
  // 第三件事情：跳转到登录页面
  router.push({ path: '/login', query: { redirect: route.path } })
}
</script>

<style scoped lang='scss'>
.setting-form {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 30px;
}
</style>
