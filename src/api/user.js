import request from './request'

// 用户登录
export const login = (data) => {
  return request.post('/blog/auth/login', data)
}

// 用户注册
export const register = (data) => {
  return request.post('/blog/auth/register', data)
}

// 获取用户信息
export const getUserInfo = () => {
  return request.get('/blog/user/info')
}

// 更新用户信息
export const updateUserInfo = (data) => {
  return request.put('/blog/user/info', data)
}
