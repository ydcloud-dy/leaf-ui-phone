<template>
  <div class="profile">
    <van-nav-bar title="我的" fixed placeholder />

    <!-- 用户信息 -->
    <div class="user-info" v-if="userStore.isLoggedIn">
      <van-image
        round
        width="60"
        height="60"
        :src="userStore.avatar"
      />
      <div class="info">
        <div class="username">{{ userStore.username }}</div>
        <div class="bio">欢迎来到我的博客</div>
      </div>
    </div>

    <div class="user-info" v-else>
      <van-button type="primary" round @click="$router.push('/login')">
        登录/注册
      </van-button>
    </div>

    <!-- 菜单列表 -->
    <van-cell-group inset>
      <van-cell title="我的收藏" is-link icon="star-o" @click="showToast('功能开发中')" />
      <van-cell title="浏览历史" is-link icon="clock-o" @click="showToast('功能开发中')" />
      <van-cell title="我的评论" is-link icon="chat-o" @click="showToast('功能开发中')" />
    </van-cell-group>

    <van-cell-group inset>
      <van-cell title="关于我们" is-link icon="info-o" @click="$router.push('/about')" />
      <van-cell title="留言反馈" is-link icon="comment-o" @click="$router.push('/guestbook')" />
    </van-cell-group>

    <van-cell-group inset v-if="userStore.isLoggedIn">
      <van-cell title="退出登录" is-link icon="close" @click="handleLogout" />
    </van-cell-group>

    <van-tabbar v-model="active" route fixed placeholder>
      <van-tabbar-item to="/" icon="wap-home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/articles" icon="notes-o">文章</van-tabbar-item>
      <van-tabbar-item to="/notes" icon="bookmark-o">笔记</van-tabbar-item>
      <van-tabbar-item to="/profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog, showToast } from 'vant'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const active = ref(3)

const handleLogout = () => {
  showConfirmDialog({
    title: '提示',
    message: '确定要退出登录吗？'
  }).then(() => {
    userStore.logout()
    showToast('已退出登录')
    router.push('/')
  }).catch(() => {})
}
</script>

<style scoped>
.profile {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 60px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 16px;
  background:
    linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url('/img/wukong.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
}

.info {
  flex: 1;
}

.username {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.bio {
  font-size: 13px;
  opacity: 0.9;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.van-cell-group {
  margin-top: 12px;
}
</style>
