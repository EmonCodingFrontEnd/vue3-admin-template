<template>
  <div class='login_container'>
    <el-row :gutter='20'>
      <el-col :span='12' :offset='0' :xs='0'></el-col>
      <el-col :span='12' :offset='0' :xs='24'>
        <el-form ref='loginFormRef' class='login_form' :model='loginForm' :rules='loginRules'>
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop='username'>
            <!-- 这里要注意：若是绑定图标(:prefix-icon="User")，需要在setup中引入；若是使用全局图标(prefix-icon="User")，不需要setup引入。 -->
            <el-input prefix-icon='User' v-model='loginForm.username'></el-input>
          </el-form-item>
          <el-form-item prop='password'>
            <el-input type='password' :prefix-icon='Lock' v-model='loginForm.password' show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' size='default' class='login_btn' @click='login' :loading='loading'>登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang='ts' name='Login'>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Lock } from '@element-plus/icons-vue'
// 引入获取当前时间的函数
import { getTime } from '@/utils/time'
import type { LoginFormData } from '@/api/user/type'
import useUserStore from '@/store/modules/user'
import useElFormHelper from '@/hooks/useElFormHelper'
import { LoginResponseData } from '@/api/user/type'

// 引入用户相关的小仓库
let userStore = useUserStore()
// 获取路由器
let router = useRouter()
// 获取路由
let route = useRoute()

// 控制按钮加载
let loading = ref(false)
// 获取el-form组件
let loginFormRef = ref<FormInstance>()
// 收集账号与密码的数据
let loginForm = reactive<LoginFormData>({
  username: 'admin',/* password: '111111', // 本地mock用户密码*/
  password: 'atguigu123',
})
/**
 * 自定义校验规则函数
 * @param rule - 校验规则对象
 * @param value - 表单元素文本内容
 * @param callback - 回调函数，定义规则是否放行：如果规则符合，则直接调用放行；如果规则不符合，注入错误提示信息！
 */
const validatorUsername = (rule: any, value: any, callback: any) => {
  if (/^\w{5,10}$/.test(value)) {
    callback()
  } else {
    callback(new Error('账号长度5-10位！'))
  }
}
const validatorPassword = (rule: any, value: any, callback: any) => {
  if (/^\w{6,15}$/.test(value)) {
    callback()
  } else {
    callback(new Error('密码长度6-15位！'))
  }
}
// 定义表单校验需要的配置对象
let loginRules = reactive<FormRules<LoginFormData>>({
  /**
   * required 必输项
   * min 文本长度至少多少位
   * max 文本长度至多多少位
   * message 错误的提示信息
   * trigger 触发校验表单的时机， change->文本发生变化触发校验；blur->失去焦点触发校验
   */
  username: [
    // { required: true, min: 5, max: 10, message: '账号长度5-10位', trigger: 'change' },
    { trigger: 'change', validator: validatorUsername },
  ],
  password: [
    // { required: true, min: 6, max: 15, message: '密码长度6-15位', trigger: 'change' },
    { trigger: 'change', validator: validatorPassword },
  ],
})

// 登录按钮回调
const login = async () => {
  // userStore.userLogin(loginForm).then(() => { }).catch(() => { }) // 可以采用promise方式
  try {
    loading.value = true
    // 保证全部表单项校验通过再发请求
    const { validateCallback } = useElFormHelper()
    await loginFormRef.value?.validate(validateCallback)

    await userStore.userLogin(loginForm)
    // 判断登录的时候，路由路径query参数当中是否有redirect参数，如果有就填入本次query中；没有就跳转到首页
    let redirect: string = <string>route.query.redirect
    // 编程式导航跳转到展示数据的首页
    router.push({ path: redirect || '/' })
    ElNotification({
      type: 'success',
      title: `HHI，${getTime()}好`,
      message: '欢迎回来！',
    })
    loading.value = false
  } catch (error) {
    loading.value = false
    ElNotification({
      type: 'error',
      dangerouslyUseHTMLString: true,
      message: (error as Error).message,
    })
  }
}
</script>

<style scoped lang='scss'>
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;

  .login_form {
    width: 80%;
    position: relative;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      color: white;
      font-size: 20px;
      margin: 20px 0px;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>
