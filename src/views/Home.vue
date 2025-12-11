<template>
  <div class="home">
    <!-- Banner区域 - 与PC端一致 -->
    <div class="banner">
      <h1 class="banner-title">欢迎来到我的博客</h1>
      <p class="banner-subtitle">分享技术，记录生活</p>
    </div>

    <div class="container">
      <!-- 热门文章 -->
      <div class="section hot-section">
        <div class="section-header">
          <h2>🔥 热门文章</h2>
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
          <h2>🏷️ 标签云</h2>
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
          <h2>📝 最新文章</h2>
          <span class="more" @click="$router.push('/articles')">查看更多 →</span>
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
          <h2>📊 站点统计</h2>
        </div>
        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">{{ stats.articles || 0 }}</div>
            <div class="stat-label">文章数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.views || 0 }}</div>
            <div class="stat-label">访问量</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.comments || 0 }}</div>
            <div class="stat-label">评论数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ tags.length }}</div>
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

onMounted(() => {
  fetchArticles()
  fetchHotArticles()
  fetchTags()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 60px;
}

/* Banner - 与PC端一致 */
.banner {
  background:
    linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url('/img/wukong.png');
  background-size: cover;
  background-position: center;
  background-attachment: scroll;
  color: #fff;
  padding: 60px 20px;
  text-align: center;
}

.banner-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.banner-subtitle {
  font-size: 16px;
  opacity: 0.95;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.container {
  padding: 16px;
}

.section {
  margin-bottom: 20px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.section-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.more {
  font-size: 14px;
  color: #409eff;
  cursor: pointer;
}

/* 热门文章 */
.hot-articles {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hot-article-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.hot-article-item:active {
  background: #e4e7ed;
  transform: scale(0.98);
}

.rank {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e4e7ed;
  color: #606266;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.rank.top {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.hot-article-item .title {
  flex: 1;
  font-size: 14px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.views {
  font-size: 12px;
  color: #909399;
  flex-shrink: 0;
}

/* 标签云 */
.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  padding: 6px 12px;
  background: #f0f9ff;
  color: #409eff;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #d9ecff;
}

.tag-item:active {
  background: #409eff;
  color: white;
  transform: scale(0.95);
}

/* 文章列表 */
.articles-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.loading {
  padding: 40px;
  text-align: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* 站点统计 */
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stat-item {
  text-align: center;
  padding: 12px 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
}
</style>
