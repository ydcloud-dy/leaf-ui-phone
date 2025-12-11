import axios from 'axios'
import { showToast } from 'vant'
import { useUserStore } from '@/stores/user'

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const userStore = useUserStore()

    // 添加 token
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }

    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data

    // 成功响应
    if (res.code === 0 || res.code === 200) {
      return res
    }

    // 业务错误
    const errorMsg = res.message || res.msg || '请求失败'

    if (res.code === 401) {
      showToast('未授权，请登录')
      const userStore = useUserStore()
      userStore.logout()
      window.location.href = '/login'
      return Promise.reject(new Error(errorMsg))
    }

    // 其他业务错误不自动弹toast，让调用方处理
    const error = new Error(errorMsg)
    error.code = res.code
    error.response = { data: res }
    return Promise.reject(error)
  },
  error => {
    console.error('Response error:', error)

    if (error.response) {
      const { status, data } = error.response
      const errorMsg = data?.message || data?.msg || '请求失败'

      if (status === 401) {
        showToast('未授权，请登录')
        const userStore = useUserStore()
        userStore.logout()
        window.location.href = '/login'
      } else if (status === 403) {
        error.message = '没有权限访问'
      } else if (status === 404) {
        error.message = '请求的资源不存在'
      } else if (status === 500) {
        error.message = '服务器错误'
      } else {
        error.message = errorMsg
      }
    } else if (error.request) {
      error.message = '网络错误，请检查网络连接'
    } else {
      error.message = '请求配置错误'
    }

    return Promise.reject(error)
  }
)

export default request
