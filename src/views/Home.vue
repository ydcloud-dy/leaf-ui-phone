<template>
  <div class="home">
    <div class="banner">
      <p class="banner-kicker">Leaf Blog</p>
      <h1 class="banner-title">沉淀技术实践，记录系统成长</h1>
      <p class="banner-subtitle">聚焦 Go、云原生、工程效率和线上问题复盘</p>
      <div class="banner-actions">
        <van-button type="primary" size="small" round @click="$router.push('/articles')">阅读文章</van-button>
        <van-button size="small" round plain @click="$router.push('/notes')">查看笔记</van-button>
      </div>
    </div>

    <div class="container">
      <!-- 热门文章 -->
      <div class="section hot-section">
        <div class="section-header">
          <h2>热门文章</h2>
        </div>
        <div class="hot-articles">
          <div
            v-for="(article, index) in hotArticles"
            :key="article.id"
            class="hot-article-item"
            @click="$router.push(`/articles/${article.id}`)"
          >
            <span class="rank" :class="{ top: index < 3 }">{{ index + 1 }}</span>
            <span class="title">{{ article.title }}</span>
            <span class="views">{{ article.view_count || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- 标签云 -->
      <div class="section tags-section">
        <div class="section-header">
          <h2>标签云</h2>
        </div>
        <div class="tags-cloud">
          <div
            v-for="tag in tags"
            :key="tag"
            class="tag-item"
            @click="handleTagClick(tag)"
          >
            {{ tag }}
          </div>
        </div>
      </div>

      <!-- 文章列表 -->
      <div class="section articles-section">
        <div class="section-header">
          <h2>最新文章</h2>
          <span class="more" @click="$router.push('/articles')">查看全部</span>
        </div>

        <div v-if="loading" class="loading">
          <van-loading size="24px">加载中...</van-loading>
        </div>

        <div v-else class="articles-list">
          <article-card
            v-for="article in articles"
            :key="article.id"
            :article="article"
          />

          <van-empty v-if="!articles.length" description="暂无文章" />
        </div>

        <!-- 分页 -->
        <div v-if="total > pageSize" class="pagination">
          <van-pagination
            v-model="currentPage"
            :total-items="total"
            :items-per-page="pageSize"
            :show-page-size="5"
            @change="handlePageChange"
          />
        </div>
      </div>

      <!-- 站点统计 -->
      <div class="section stats-section">
        <div class="section-header">
          <h2>站点统计</h2>
        </div>
        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">{{ formatNumber(stats.articles || 0) }}</div>
            <div class="stat-label">文章数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ formatNumber(stats.views || 0) }}</div>
            <div class="stat-label">访问量</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ formatNumber(stats.comments || 0) }}</div>
            <div class="stat-label">评论数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ formatNumber(tags.length) }}</div>
            <div class="stat-label">标签数</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <van-tabbar v-model="active" route fixed placeholder>
      <van-tabbar-item to="/" icon="wap-home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/articles" icon="notes-o">文章</van-tabbar-item>
      <van-tabbar-item to="/notes" icon="bookmark-o">笔记</van-tabbar-item>
      <van-tabbar-item to="/profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getArticles } from '@/api/article'
import { getTags } from '@/api/tag'
import ArticleCard from '@/components/ArticleCard.vue'

const router = useRouter()
const active = ref(0)
const articles = ref([])
const hotArticles = ref([])
const tags = ref([])
const stats = ref({ articles: 0, views: 0, comments: 0 })
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)

const fetchArticles = async () => {
  loading.value = true
  try {
    const { data } = await getArticles({
      page: currentPage.value,
      page_size: pageSize.value,
      status: 1,
      sort: 'latest'
    })
    articles.value = data.list || []
    total.value = data.total || 0
    stats.value.articles = data.total || 0
    stats.value.views = articles.value.reduce((sum, item) => sum + (Number(item.view_count) || 0), 0)
    stats.value.comments = articles.value.reduce((sum, item) => sum + (Number(item.comment_count) || 0), 0)
  } catch (error) {
    console.error('Failed to fetch articles:', error)
  } finally {
    loading.value = false
  }
}

const fetchHotArticles = async () => {
  try {
    const { data } = await getArticles({
      page: 1,
      page_size: 5,
      status: 1,
      sort: 'views'
    })
    hotArticles.value = data.list || []
  } catch (error) {
    console.error('Failed to fetch hot articles:', error)
  }
}

const fetchTags = async () => {
  try {
    const { data } = await getTags()
    const tagList = Array.isArray(data) ? data : (data.list || [])
    tags.value = tagList.map(tag => tag.name).slice(0, 20)
  } catch (error) {
    console.error('Failed to fetch tags:', error)
  }
}

const handleTagClick = (tag) => {
  router.push({
    path: '/articles',
    query: { tag }
  })
}

const handlePageChange = () => {
  fetchArticles()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const formatNumber = (num) => {
  const value = Number(num) || 0
  if (value >= 10000) return `${(value / 10000).toFixed(1)}w`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
  return value.toString()
}

onMounted(() => {
  fetchArticles()
  fetchHotArticles()
  fetchTags()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: var(--phone-bg);
  padding-bottom: 68px;
}

.banner {
  position: relative;
  overflow: hidden;
  min-height: 310px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%),
    url('/img/wukong.png');
  background-size: cover;
  background-position: center;
  color: #fff;
  padding: 28px 18px 24px;
}

.banner::after {
  content: "";
  position: absolute;
  inset: auto 0 0;
  height: 90px;
  background: linear-gradient(180deg, transparent, var(--phone-bg));
  pointer-events: none;
}

.banner-kicker {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  margin: 0 0 10px;
  padding: 4px 10px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.13);
  color: rgba(255, 255, 255, 0.88);
  font-size: 12px;
  font-weight: 800;
}

.banner-title {
  position: relative;
  z-index: 1;
  max-width: 320px;
  margin: 0;
  font-size: 30px;
  font-weight: 850;
  line-height: 1.18;
  text-shadow: 0 4px 18px rgba(0, 0, 0, 0.28);
}

.banner-subtitle {
  position: relative;
  z-index: 1;
  max-width: 310px;
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.82);
  font-size: 15px;
  line-height: 1.7;
}

.banner-actions {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 10px;
  margin-top: 18px;
}

.banner-actions :deep(.van-button--plain) {
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.3);
}

.container {
  padding: 0 14px 16px;
  margin-top: -12px;
  position: relative;
  z-index: 2;
}

.section {
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid var(--phone-border);
  border-radius: var(--phone-radius);
  background: rgba(255, 255, 255, 0.94);
  box-shadow: var(--phone-shadow-sm);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.section-header h2 {
  margin: 0;
  color: var(--phone-heading);
  font-size: 18px;
  font-weight: 850;
}

.more {
  color: var(--phone-primary);
  font-size: 13px;
  font-weight: 750;
  cursor: pointer;
}

.hot-articles {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hot-article-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 11px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: var(--phone-surface-soft);
  cursor: pointer;
  transition: transform 0.18s ease, background-color 0.18s ease;
}

.hot-article-item:active {
  background: var(--phone-primary-soft);
  transform: scale(0.985);
}

.rank {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e2e8f0;
  color: var(--phone-muted);
  border-radius: 50%;
  font-size: 12px;
  font-weight: 850;
  flex-shrink: 0;
}

.rank.top {
  background: linear-gradient(135deg, #facc15, #f97316);
  color: white;
}

.hot-article-item .title {
  flex: 1;
  font-size: 14px;
  color: var(--phone-heading);
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.views {
  font-size: 12px;
  color: var(--phone-subtle);
  flex-shrink: 0;
  font-weight: 650;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  padding: 6px 12px;
  border: 1px solid rgba(37, 99, 235, 0.16);
  border-radius: 16px;
  background: var(--phone-primary-soft);
  color: var(--phone-primary);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.18s ease, background-color 0.18s ease;
}

.tag-item:active {
  background: var(--phone-primary);
  color: white;
  transform: scale(0.95);
}

.articles-list {
  display: flex;
  flex-direction: column;
}

.loading {
  padding: 40px;
  text-align: center;
}

.pagination {
  margin-top: 18px;
  display: flex;
  justify-content: center;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.stat-item {
  text-align: center;
  padding: 12px 6px;
  border: 1px solid rgba(37, 99, 235, 0.12);
  border-radius: 10px;
  background: linear-gradient(180deg, var(--phone-primary-soft), #fff);
  color: var(--phone-primary);
}

.stat-value {
  color: var(--phone-heading);
  font-size: 18px;
  font-weight: 850;
  margin-bottom: 4px;
}

.stat-label {
  color: var(--phone-muted);
  font-size: 12px;
  font-weight: 700;
}
</style>
