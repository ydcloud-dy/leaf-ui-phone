import request from './request'

// 获取标签列表
export const getTags = () => {
  return request.get('/blog/tags')
}

// 获取分类列表
export const getCategories = () => {
  return request.get('/blog/categories')
}
