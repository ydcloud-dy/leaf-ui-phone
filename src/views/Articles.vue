<template>
  <div class="articles">
    <!-- Banner区域 - 与PC端一致 -->
    <div class="banner">
      <h1 class="banner-title">文章列表</h1>
      <p class="banner-subtitle">探索知识的海洋</p>
    </div>

    <div class="container">
      <!-- 当前选中的标签 -->
      <div v-if="route.query.tag" class="active-tag-filter">
        <span>当前标签：</span>
        <van-tag closable @close="clearTagFilter" type="primary" size="large">
          {{ route.query.tag }}
        </van-tag>
      </div>

      <!-- 筛选和排序 -->
      <div class="filters-section">
        <van-search
          v-model="searchKeyword"
          placeholder="搜索文章..."
          show-action
          @search="handleSearch"
          @cancel="searchKeyword = ''"
        />

        <div class="sort-section">
          <van-dropdown-menu>
            <van-dropdown-item v-model="sortBy" :options="sortOptions" @change="handleSort" />
          </van-dropdown-menu>
        </div>
      </div>

      <!-- 文章列表 -->
      <div class="articles-list">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="loadArticles"
          >
            <article-card
              v-for="article in articles"
              :key="article.id"
              :article="article"
            />
            <van-empty v-if="!loading && !articles.length" description="暂无文章" />
          </van-list>
        </van-pull-refresh>
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
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArticles, searchArticles } from '@/api/article'
import ArticleCard from '@/components/ArticleCard.vue'

const route = useRoute()
const router = useRouter()
const active = ref(1)
const articles = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const searchKeyword = ref('')
const sortBy = ref('latest')
const currentPage = ref(1)
const pageSize = ref(10)

const sortOptions = [
  { text: '最新发布', value: 'latest' },
  { text: '最多浏览', value: 'views' },
  { text: '最多点赞', value: 'likes' }
]

const loadArticles = async () => {
  if (refreshing.value) {
    articles.value = []
    currentPage.value = 1
    finished.value = false
  }

  try {
    loading.value = true
    const params = {
      page: currentPage.value,
      page_size: pageSize.value,
      sort: sortBy.value,
      status: 1
    }

    if (searchKeyword.value && searchKeyword.value.trim()) {
      params.keyword = searchKeyword.value.trim()
    }

    if (route.query.tag) {
      params.tag = route.query.tag
    }

    const apiCall = (searchKeyword.value && searchKeyword.value.trim()) ? searchArticles : getArticles
    const { data } = await apiCall(params)

    if (refreshing.value) {
      articles.value = data.list || []
      refreshing.value = false
    } else {
      articles.value.push(...(data.list || []))
    }

    currentPage.value++

    if (!data.list || data.list.length < pageSize.value) {
      finished.value = true
    }
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    finished.value = true
  } finally {
    loading.value = false
  }
}

const onRefresh = () => {
  finished.value = false
  loadArticles()
}

const handleSearch = () => {
  articles.value = []
  currentPage.value = 1
  finished.value = false
  loadArticles()
}

const handleSort = () => {
  articles.value = []
  currentPage.value = 1
  finished.value = false
  loadArticles()
}

const clearTagFilter = () => {
  router.push({
    path: '/articles',
    query: {}
  })
}

watch(() => route.query, () => {
  searchKeyword.value = route.query.keyword || ''
  articles.value = []
  currentPage.value = 1
  finished.value = false
  loadArticles()
}, { immediate: true })
</script>

<style scoped>
.articles {
  min-height: 100vh;
  background: #f5f7fa;
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

.active-tag-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #f0f9ff;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.active-tag-filter span {
  font-weight: 500;
  color: #606266;
  font-size: 14px;
}

.filters-section {
  margin-bottom: 16px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.sort-section {
  border-top: 1px solid #ebeef5;
}

.articles-list {
  min-height: 400px;
}
</style>
