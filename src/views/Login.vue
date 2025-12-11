<template>
  <div class="login">
    <van-nav-bar
      title="登录"
      left-arrow
      @click-left="$router.back()"
    />

    <div class="login-content">
      <div class="logo">
        <van-image
          round
          width="80"
          height="80"
          src="/img/touxiang.png"
        />
        <h1>个人博客</h1>
      </div>

      <van-form @submit="handleLogin">
        <van-cell-group inset>
          <van-field
            v-model="username"
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请输入用户名' }]"
          />
          <van-field
            v-model="password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
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
  background:
    linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url('/img/wukong.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: scroll;
}

.login-content {
  padding: 40px 20px;
}

.logo {
  text-align: center;
  margin-bottom: 40px;
}

.logo h1 {
  margin-top: 16px;
  font-size: 24px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.submit-btn {
  margin: 20px 16px;
}
</style>
