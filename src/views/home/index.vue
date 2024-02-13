<template>
  <div>
    <el-card class="header">
      <img :src="userStore.avatar" :alt="userStore.username" class="avatar" />
      <div class="profile">
        <h3 class="title">HI，{{ userStore.username }} {{ getTime() }}好！</h3>
        <p class="desc">硅谷甄选运营平台</p>
      </div>
    </el-card>
    <div class="content">
      <SvgIcon name="welcome" width="500" height="500" />
    </div>
  </div>
</template>

<script setup lang="ts" name="Home">
// 引入获取当前时间的函数
import { getTime } from '@/utils/time'
// 引入用户相关的仓库，获取当前用户的头像、昵称
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
</script>

<style scoped lang="scss">
.header {
  ::v-deep .el-card__body {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-right: 20px;
  }

  .profile {
    .title {
      font-size: 30px;
      margin-bottom: 20px;
      font-weight: bold;
    }

    .desc {
      font-size: 14px;
      color: #999;
    }
  }
}

.content {
  text-align: center;
}
</style>
