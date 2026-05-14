<template>
  <div class="profile">
    <van-nav-bar title="我的" fixed placeholder />

    <div class="profile-content">
      <!-- 用户信息 -->
      <section class="user-card" v-if="userStore.isLoggedIn">
        <van-image
          round
          width="64"
          height="64"
          :src="userStore.avatar || '/img/touxiang.png'"
        />
        <div class="info">
          <div class="username">{{ userStore.username || '已登录用户' }}</div>
          <div class="bio">欢迎回来，继续整理你的阅读和互动记录</div>
        </div>
      </section>

      <section class="user-card guest-card" v-else>
        <div class="guest-avatar">
          <van-icon name="user-o" />
        </div>
        <div class="info">
          <div class="username">未登录</div>
          <div class="bio">登录后可以收藏文章、管理评论和参与留言</div>
        </div>
        <van-button type="primary" round size="small" @click="$router.push('/login')">
          登录
        </van-button>
      </section>

      <div class="quick-grid">
        <div class="quick-item" @click="showToast('功能开发中')">
          <van-icon name="star-o" />
          <span>收藏</span>
        </div>
        <div class="quick-item" @click="showToast('功能开发中')">
          <van-icon name="clock-o" />
          <span>历史</span>
        </div>
        <div class="quick-item" @click="showToast('功能开发中')">
          <van-icon name="chat-o" />
          <span>评论</span>
        </div>
      </div>

      <!-- 菜单列表 -->
      <van-cell-group inset class="menu-card">
        <van-cell title="关于博客" label="项目说明与技术栈" is-link icon="info-o" @click="$router.push('/about')" />
        <van-cell title="留言反馈" label="写下建议或问题" is-link icon="comment-o" @click="$router.push('/guestbook')" />
      </van-cell-group>

      <van-cell-group inset class="menu-card" v-if="userStore.isLoggedIn">
        <van-cell title="退出登录" is-link icon="close" @click="handleLogout" />
      </van-cell-group>
    </div>

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
  background: var(--phone-bg);
  padding-bottom: 68px;
}

.profile-content {
  padding: 14px 0 20px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 0 14px 14px;
  padding: 18px;
  border: 1px solid rgba(37, 99, 235, 0.16);
  border-radius: 18px;
  background:
    linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(15, 118, 110, 0.08)),
    var(--phone-surface);
  box-shadow: var(--phone-shadow);
}

.user-card :deep(.van-image) {
  flex-shrink: 0;
  border: 3px solid rgba(255, 255, 255, 0.9);
  box-shadow: var(--phone-shadow-sm);
}

.guest-card {
  align-items: center;
}

.guest-avatar {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--phone-primary-soft);
  color: var(--phone-primary);
  font-size: 28px;
  flex-shrink: 0;
}

.info {
  flex: 1;
  min-width: 0;
}

.username {
  color: var(--phone-heading);
  font-size: 19px;
  font-weight: 850;
  line-height: 1.25;
}

.bio {
  color: var(--phone-muted);
  font-size: 13px;
  line-height: 1.55;
  margin-top: 6px;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 0 14px 14px;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 76px;
  gap: 8px;
  border: 1px solid var(--phone-border);
  border-radius: 14px;
  background: var(--phone-surface);
  color: var(--phone-heading);
  box-shadow: var(--phone-shadow-sm);
  font-weight: 750;
}

.quick-item:active {
  transform: scale(0.98);
  background: var(--phone-primary-soft);
}

.quick-item .van-icon {
  color: var(--phone-primary);
  font-size: 22px;
}

.menu-card :deep(.van-cell) {
  padding: 14px 16px;
}

.menu-card :deep(.van-cell__title) {
  font-weight: 750;
}

.menu-card :deep(.van-cell__label) {
  margin-top: 4px;
}

.van-cell-group {
  margin-bottom: 12px;
}
</style>
