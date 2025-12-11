import request from './request'

// 获取文章列表
export const getArticles = (params) => {
  return request.get('/blog/articles', { params })
}

// 搜索文章
export const searchArticles = (params) => {
  return request.get('/blog/articles/search', { params })
}

// 获取文章详情
export const getArticleDetail = (id) => {
  return request.get(`/blog/articles/${id}`)
}

// 点赞文章
export const likeArticle = (id) => {
  return request.post(`/blog/articles/${id}/like`)
}

// 收藏文章
export const favoriteArticle = (id) => {
  return request.post(`/blog/articles/${id}/favorite`)
}

// 获取上一篇/下一篇文章
export const getAdjacentArticles = (id, params) => {
  return request.get(`/blog/articles/${id}/adjacent`, { params })
}
