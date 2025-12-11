import request from './request'

// 获取评论列表
export const getComments = (params) => {
  return request.get('/blog/comments', { params })
}

// 发表评论
export const createComment = (data) => {
  return request.post('/blog/comments', data)
}

// 删除评论
export const deleteComment = (id) => {
  return request.delete(`/blog/comments/${id}`)
}
