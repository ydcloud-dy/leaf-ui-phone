<template>
  <div class="article-detail">
    <van-nav-bar
      title="文章详情"
      fixed
      placeholder
      left-arrow
      @click-left="$router.back()"
    />
    <div class="read-progress">
      <span :style="{ width: readingProgress + '%' }"></span>
    </div>

    <van-skeleton :loading="loading" :row="10" avatar>
      <div v-if="article" class="content-wrapper">
        <!-- 文章卡片 -->
        <div class="article-card">
          <div v-if="article.cover" class="article-cover">
            <img :src="article.cover" :alt="article.title" />
          </div>

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
import { ref, onMounted, onUnmounted, computed } from 'vue'
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
const readingProgress = ref(0)

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
    setTimeout(updateReadingProgress, 0)
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
    const nextCount = (Number(article.value.like_count) || 0) + (isLiked.value ? 1 : -1)
    article.value.like_count = Math.max(0, nextCount)
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

const updateReadingProgress = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
  readingProgress.value = scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)) : 0
}

onMounted(() => {
  window.addEventListener('scroll', updateReadingProgress, { passive: true })
  fetchArticle()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateReadingProgress)
})
</script>

<style scoped>
.article-detail {
  min-height: 100vh;
  background: var(--phone-bg);
  padding: 12px;
  padding-bottom: 80px;
}

.read-progress {
  position: fixed;
  top: 46px;
  left: 0;
  right: 0;
  z-index: 12;
  height: 3px;
  background: rgba(219, 228, 238, 0.78);
}

.read-progress span {
  display: block;
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, var(--phone-primary), var(--phone-accent));
  transition: width 0.12s ease;
}

.content-wrapper {
  max-width: 760px;
  margin: 0 auto;
}

.article-card {
  border: 1px solid var(--phone-border);
  border-radius: var(--phone-radius);
  background: var(--phone-surface);
  box-shadow: var(--phone-shadow);
  overflow: hidden;
}

.article-cover {
  width: 100%;
  max-height: 230px;
  overflow: hidden;
  background: var(--phone-surface-soft);
}

.article-cover img {
  display: block;
  width: 100%;
  height: 100%;
  max-height: 230px;
  object-fit: cover;
}

.article-header {
  padding: 22px 16px 18px;
  border-bottom: 1px solid var(--phone-border);
}

.title {
  margin: 0 0 18px;
  color: var(--phone-heading);
  font-size: 25px;
  font-weight: 850;
  line-height: 1.28;
  letter-spacing: 0;
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
  color: var(--phone-heading);
  font-weight: 800;
}

.publish-time {
  font-size: 13px;
  color: var(--phone-subtle);
  margin-top: 4px;
  font-weight: 650;
}

.article-stats {
  display: flex;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: var(--phone-subtle);
  font-weight: 650;
  white-space: nowrap;
}

.article-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.article-content {
  padding: 22px 16px;
  font-size: 16px;
  line-height: 1.85;
  color: var(--phone-text);
  word-break: break-word;
}

.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  margin: 16px 0;
  box-shadow: var(--phone-shadow-sm);
}

.article-content :deep(pre) {
  position: relative;
  margin: 18px 0;
  padding: 16px;
  border: 1px solid rgba(125, 211, 252, 0.18);
  border-radius: 12px;
  background: #011627;
  overflow-x: auto;
  box-shadow: 0 14px 30px rgba(2, 6, 23, 0.16);
}

.article-content :deep(code) {
  font-family:
    "JetBrains Mono",
    "SFMono-Regular",
    Consolas,
    "Liberation Mono",
    Menlo,
    monospace;
  font-size: 14px;
}

.article-content :deep(pre code) {
  color: #d6deeb;
  background: transparent;
  white-space: pre;
}

.article-content :deep(:not(pre) > code) {
  padding: 2px 6px;
  border-radius: 6px;
  background: var(--phone-primary-soft);
  color: var(--phone-primary);
  font-size: 0.92em;
}

.article-content :deep(p) {
  margin: 12px 0;
}

.article-content :deep(strong) {
  color: var(--phone-heading);
  font-weight: 850;
}

.article-content :deep(hr) {
  height: 1px;
  margin: 24px 0;
  border: 0;
  background: var(--phone-border);
}

.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3),
.article-content :deep(h4),
.article-content :deep(h5),
.article-content :deep(h6) {
  margin: 24px 0 16px;
  font-weight: 850;
  color: var(--phone-heading);
  line-height: 1.35;
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
  margin: 16px 0;
  padding: 12px 14px;
  border-left: 4px solid var(--phone-primary);
  border-radius: 8px;
  background: var(--phone-primary-soft);
  color: var(--phone-muted);
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
  color: var(--phone-primary);
  text-decoration: none;
}

.article-content :deep(a:hover) {
  text-decoration: underline;
}

.article-content :deep(table) {
  display: block;
  width: 100%;
  overflow-x: auto;
  border-collapse: collapse;
  margin: 16px 0;
}

.article-content :deep(th),
.article-content :deep(td) {
  min-width: 92px;
  padding: 8px 10px;
  border: 1px solid var(--phone-border);
}

.article-content :deep(th) {
  background: var(--phone-surface-soft);
  color: var(--phone-heading);
  font-weight: 800;
}

.article-actions {
  padding: 20px 16px;
  display: flex;
  gap: 12px;
  border-top: 1px solid var(--phone-border);
  background: var(--phone-surface-soft);
}

.article-actions .van-button {
  flex: 1;
}
</style>
