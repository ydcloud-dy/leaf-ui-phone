<template>
  <div class="article-card" @click="handleClick">
    <div v-if="article.cover" class="cover">
      <img :src="article.cover" :alt="article.title" />
    </div>

    <div class="content">
      <h3 class="title">{{ article.title }}</h3>

      <p class="summary">{{ getSummary() }}</p>

      <div class="meta">
        <div class="tags">
          <van-tag
            v-if="article.category"
            type="primary"
            size="small"
            plain
          >
            {{ typeof article.category === 'object' ? article.category.name : article.category }}
          </van-tag>
          <van-tag
            v-for="tag in article.tags?.slice(0, 3)"
            :key="tag.id || tag"
            size="small"
            plain
          >
            {{ typeof tag === 'object' ? tag.name : tag }}
          </van-tag>
        </div>

        <div class="stats">
          <span class="stat-item">
            <van-icon name="eye-o" />
            {{ article.view_count || 0 }}
          </span>
          <span class="stat-item">
            <van-icon name="chat-o" />
            {{ article.comment_count || 0 }}
          </span>
          <span class="stat-item">
            <van-icon name="good-job-o" />
            {{ article.like_count || 0 }}
          </span>
        </div>
      </div>

      <div class="footer">
        <div class="author">
          <van-image
            round
            width="24"
            height="24"
            :src="article.author?.avatar"
          >
            <template v-slot:error>
              <div class="avatar-placeholder">
                {{ (article.author?.nickname || article.author?.username)?.charAt(0).toUpperCase() }}
              </div>
            </template>
          </van-image>
          <span>{{ article.author?.nickname || article.author?.username || '匿名' }}</span>
        </div>
        <div class="date">
          {{ formatDate(article.created_at) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'

const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const handleClick = () => {
  router.push(`/articles/${props.article.id}`)
}

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD')
}

const getSummary = () => {
  if (props.article.summary && props.article.summary.trim()) {
    return props.article.summary
  }

  const content = props.article.content_markdown || props.article.content || ''

  if (content.trim()) {
    let plainText = content.replace(/<[^>]+>/g, '')

    plainText = plainText
      .replace(/[#*`>\[\]()]/g, '')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    if (plainText.length > 150) {
      return plainText.substring(0, 150) + '...'
    }
    return plainText
  }

  return '暂无简介'
}
</script>

<style scoped>
.article-card {
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 12px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.article-card:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.cover {
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.article-card:active .cover img {
  transform: scale(1.05);
}

.content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin: 0;
}

.summary {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  margin: 0;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
}

.stats {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #909399;
  white-space: nowrap;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.author {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #606266;
}

.avatar-placeholder {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.date {
  font-size: 13px;
  color: #909399;
}
</style>
