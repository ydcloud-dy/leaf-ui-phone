<template>
  <div class="login">
    <van-nav-bar
      title="登录"
      left-arrow
      @click-left="$router.back()"
    />

    <div class="login-content">
      <div class="brand-panel">
        <van-image
          round
          width="80"
          height="80"
          src="/img/touxiang.png"
        />
        <p class="brand-kicker">Leaf Blog</p>
        <h1>欢迎回来</h1>
        <p class="brand-subtitle">登录后可以收藏文章、参与留言和同步个人阅读内容</p>
      </div>

      <van-form class="login-form" @submit="handleLogin">
        <van-cell-group inset class="form-card">
          <van-field
            v-model="username"
            name="username"
            left-icon="user-o"
            placeholder="请输入用户名"
            clearable
            :rules="[{ required: true, message: '请输入用户名' }]"
          />
          <van-field
            v-model="password"
            type="password"
            name="password"
            left-icon="lock"
            placeholder="请输入密码"
            clearable
            :rules="[{ required: true, message: '请输入密码' }]"
          />
        </van-cell-group>

        <div class="submit-btn">
          <van-button round block type="primary" native-type="submit" :loading="loading">
            登录
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { login } from '@/api/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  try {
    loading.value = true
    const { data } = await login({
      username: username.value,
      password: password.value
    })

    if (data.token && data.user) {
      userStore.setToken(data.token)
      userStore.setUserInfo(data.user)
      showToast('登录成功')
      router.push('/profile')
    } else {
      showToast('登录失败：返回数据格式错误')
    }
  } catch (error) {
    console.error('Login error:', error)
    const errorMessage = error.response?.data?.message || error.message || '登录失败，请检查用户名和密码'
    showToast({
      message: errorMessage,
      duration: 3000
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  background: var(--phone-bg);
  overflow: hidden;
}

.login::before {
  content: "";
  position: fixed;
  inset: 0 0 auto;
  height: 280px;
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.18), rgba(15, 23, 42, 0.82)),
    url('/img/wukong.png');
  background-size: cover;
  background-position: center;
  pointer-events: none;
}

.login::after {
  content: "";
  position: fixed;
  top: 210px;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(180deg, transparent, var(--phone-bg));
  pointer-events: none;
}

.login-content {
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 46px);
  padding: 34px 18px 24px;
}

.brand-panel {
  text-align: center;
  color: #fff;
  padding: 26px 14px 24px;
}

.brand-panel :deep(.van-image) {
  border: 3px solid rgba(255, 255, 255, 0.86);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.22);
}

.brand-kicker {
  margin: 16px 0 8px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
  font-weight: 850;
  letter-spacing: 0;
}

.brand-panel h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 850;
  line-height: 1.2;
  text-shadow: 0 4px 18px rgba(0, 0, 0, 0.28);
}

.brand-subtitle {
  max-width: 286px;
  margin: 12px auto 0;
  color: rgba(255, 255, 255, 0.82);
  font-size: 14px;
  line-height: 1.7;
}

.login-form {
  margin-top: 8px;
}

.form-card {
  background: rgba(255, 255, 255, 0.96);
}

.form-card :deep(.van-cell) {
  padding: 15px 16px;
}

.form-card :deep(.van-field__left-icon) {
  color: var(--phone-primary);
}

.form-card :deep(.van-field__control) {
  font-weight: 700;
}

.submit-btn {
  margin: 18px 14px 0;
}

.submit-btn :deep(.van-button) {
  height: 46px;
  border-radius: 13px;
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.22);
}

.submit-btn :deep(.van-button__text) {
  font-size: 16px;
  font-weight: 850;
}

@media (min-width: 480px) {
  .login-content {
    max-width: 430px;
    margin: 0 auto;
  }
}
</style>
