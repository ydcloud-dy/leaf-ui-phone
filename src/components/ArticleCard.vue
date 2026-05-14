<template>
  <div class="article-card" @click="handleClick">
    <div v-if="article.cover" class="cover">
      <img :src="article.cover" :alt="article.title" />
    </div>
    <div v-else class="cover cover-placeholder">
      <van-icon name="description-o" />
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
  margin-bottom: 14px;
  background: var(--phone-surface);
  border: 1px solid var(--phone-border);
  border-radius: var(--phone-radius);
  overflow: hidden;
  box-shadow: var(--phone-shadow-sm);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.article-card:active {
  transform: scale(0.985);
  border-color: rgba(37, 99, 235, 0.24);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.1);
}

.cover {
  width: 100%;
  height: 172px;
  overflow: hidden;
  background:
    linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(22, 163, 74, 0.06)),
    var(--phone-surface-soft);
}

.cover-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--phone-primary);
  font-size: 42px;
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
  padding: 16px 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.title {
  color: var(--phone-heading);
  font-size: 18px;
  font-weight: 800;
  line-height: 1.38;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin: 0;
}

.summary {
  font-size: 14px;
  color: var(--phone-muted);
  line-height: 1.68;
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
  gap: 12px;
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
  gap: 10px;
  flex-shrink: 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--phone-subtle);
  font-size: 12px;
  font-weight: 650;
  white-space: nowrap;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 4px;
}

.author {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  font-size: 13px;
  color: var(--phone-muted);
  font-weight: 650;
}

.author span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.avatar-placeholder {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, var(--phone-primary), #60a5fa);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.date {
  font-size: 13px;
  color: var(--phone-subtle);
  font-weight: 650;
  flex-shrink: 0;
}
</style>
