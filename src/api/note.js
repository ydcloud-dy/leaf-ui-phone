import request from './request'

// 获取笔记列表
export const getNotes = (params) => {
  return request.get('/blog/chapters', { params })
}

// 根据标签获取笔记
export const getChaptersByTag = (tag) => {
  return request.get(`/blog/chapters/${tag}`)
}

// 获取笔记详情
export const getNoteDetail = (id) => {
  return request.get(`/blog/chapters/${id}/detail`)
}
