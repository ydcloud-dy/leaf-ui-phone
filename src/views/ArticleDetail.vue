<template>
  <div class="article-detail">
    <van-skeleton :loading="loading" :row="10" avatar>
      <div v-if="article" class="content-wrapper">
        <!-- 文章卡片 -->
        <div class="article-card">
          <!-- 文章头部 -->
          <div class="article-header">
            <h1 class="title">{{ article.title }}</h1>

            <div class="article-meta">
              <div class="author-info">
                <van-image
                  round
                  width="40"
                  height="40"
                  :src="article.author?.avatar"
                >
                  <template v-slot:error>
                    <div class="avatar-placeholder">
                      {{ (article.author?.nickname || article.author?.username)?.charAt(0).toUpperCase() }}
                    </div>
                  </template>
                </van-image>
                <div class="author-details">
                  <div class="author-name">{{ article.author?.nickname || article.author?.username || '匿名' }}</div>
                  <div class="publish-time">{{ formatDate(article.created_at) }}</div>
                </div>
              </div>

              <div class="article-stats">
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

            <!-- 标签 -->
            <div v-if="article.tags?.length || article.category" class="article-tags">
              <van-tag type="primary" plain v-if="article.category">
                {{ typeof article.category === 'object' ? article.category.name : article.category }}
              </van-tag>
              <van-tag
                plain
                v-for="tag in article.tags"
                :key="tag.id || tag"
              >
                {{ typeof tag === 'object' ? tag.name : tag }}
              </van-tag>
            </div>
          </div>

          <!-- 文章内容 -->
          <div class="article-content" v-html="renderedContent"></div>

          <!-- 文章操作 -->
          <div class="article-actions">
            <van-button
              :icon="isLiked ? 'good-job' : 'good-job-o'"
              :type="isLiked ? 'primary' : 'default'"
              @click="handleLike"
              block
            >
              {{ isLiked ? '已点赞' : '点赞' }} ({{ article.like_count || 0 }})
            </van-button>
            <van-button
              :icon="isFavorited ? 'star' : 'star-o'"
              :type="isFavorited ? 'warning' : 'default'"
              @click="handleFavorite"
              block
            >
              {{ isFavorited ? '已收藏' : '收藏' }}
            </van-button>
          </div>
        </div>
      </div>
    </van-skeleton>

    <!-- 返回顶部按钮 -->
    <van-back-top />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'
import dayjs from 'dayjs'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import { getArticleDetail, likeArticle, favoriteArticle } from '@/api/article'

const route = useRoute()
const article = ref(null)
const loading = ref(false)
const isLiked = ref(false)
const isFavorited = ref(false)

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre><code class="hljs">${hljs.highlight(str, { language: lang }).value}</code></pre>`
      } catch (__) {}
    }
    return `<pre><code class="hljs">${md.utils.escapeHtml(str)}</code></pre>`
  }
})

const renderedContent = computed(() => {
  if (!article.value) return ''
  return md.render(article.value.content_markdown || article.value.content || '')
})

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

const fetchArticle = async () => {
  try {
    loading.value = true
    const { data } = await getArticleDetail(route.params.id)
    article.value = data
  } catch (error) {
    showToast('加载文章失败')
    console.error('Failed to fetch article:', error)
  } finally {
    loading.value = false
  }
}

const handleLike = async () => {
  try {
    await likeArticle(article.value.id)
    isLiked.value = !isLiked.value
    article.value.like_count += isLiked.value ? 1 : -1
    showToast(isLiked.value ? '点赞成功' : '取消点赞')
  } catch (error) {
    showToast('操作失败')
  }
}

const handleFavorite = async () => {
  try {
    await favoriteArticle(article.value.id)
    isFavorited.value = !isFavorited.value
    showToast(isFavorited.value ? '收藏成功' : '取消收藏')
  } catch (error) {
    showToast('操作失败')
  }
}

onMounted(() => {
  fetchArticle()
})
</script>

<style scoped>
.article-detail {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 16px;
  padding-bottom: 80px;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.article-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.article-header {
  padding: 24px 16px;
  border-bottom: 1px solid #ebeef5;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  line-height: 1.4;
  margin-bottom: 20px;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-placeholder {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  border-radius: 50%;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: 15px;
  color: #303133;
  font-weight: 600;
}

.publish-time {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

.article-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #909399;
  white-space: nowrap;
}

.article-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.article-content {
  padding: 24px 16px;
  font-size: 16px;
  line-height: 1.8;
  color: #303133;
  word-break: break-word;
}

.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 16px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.article-content :deep(pre) {
  background: #282c34;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 16px 0;
}

.article-content :deep(code) {
  font-family: "STHeiti", "Heiti SC", "Microsoft YaHei", "SimHei", monospace;
  font-size: 14px;
}

.article-content :deep(p) {
  margin: 12px 0;
}

.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3),
.article-content :deep(h4),
.article-content :deep(h5),
.article-content :deep(h6) {
  margin: 24px 0 16px;
  font-weight: 600;
  color: #303133;
}

.article-content :deep(h1) {
  font-size: 24px;
}

.article-content :deep(h2) {
  font-size: 22px;
}

.article-content :deep(h3) {
  font-size: 20px;
}

.article-content :deep(blockquote) {
  border-left: 4px solid #409eff;
  padding-left: 16px;
  margin: 16px 0;
  color: #606266;
  background: #f0f9ff;
  padding: 12px 16px;
  border-radius: 4px;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  padding-left: 24px;
  margin: 12px 0;
}

.article-content :deep(li) {
  margin: 8px 0;
}

.article-content :deep(a) {
  color: #409eff;
  text-decoration: none;
}

.article-content :deep(a:hover) {
  text-decoration: underline;
}

.article-actions {
  padding: 20px 16px;
  display: flex;
  gap: 12px;
  border-top: 1px solid #ebeef5;
  background: #fafafa;
}

.article-actions .van-button {
  flex: 1;
}
</style>
