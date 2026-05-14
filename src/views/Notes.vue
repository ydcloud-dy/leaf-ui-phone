<template>
  <div class="notes">
    <van-nav-bar
      title="笔记"
      fixed
      placeholder
      left-arrow
      @click-left="$router.back()"
    />

    <div class="notes-container">
      <!-- 标签选择 -->
      <van-sidebar v-model="activeTag" class="sidebar">
        <van-sidebar-item
          v-for="(tag, index) in tags"
          :key="tag.id"
          :title="tag.name"
          @click="selectTag(tag.name, index)"
        />
      </van-sidebar>

      <!-- 章节和笔记列表 -->
      <div class="notes-content">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <div v-if="loading" class="loading-wrapper">
            <van-loading>加载中...</van-loading>
          </div>

          <div v-else-if="chapters.length > 0" class="chapters-list">
            <!-- 一级章节 -->
            <div v-for="chapter in chapters" :key="chapter.id" class="chapter-item">
              <!-- 一级章节标题 -->
              <div class="chapter-header" @click="toggleChapter(chapter.id)">
                <van-icon :name="expandedChapters.includes(chapter.id) ? 'arrow-down' : 'arrow'" />
                <span class="chapter-name">{{ chapter.name }}</span>
                <span class="article-count">({{ getChapterArticleCount(chapter) }})</span>
              </div>

              <!-- 一级章节内容 -->
              <div v-show="expandedChapters.includes(chapter.id)" class="chapter-content">
                <!-- 一级章节下的文章 -->
                <div v-if="chapter.articles && chapter.articles.length > 0" class="articles-group">
                  <van-cell
                    v-for="article in chapter.articles"
                    :key="article.id"
                    :title="article.title"
                    is-link
                    @click="viewArticle(article.id)"
                    class="article-cell"
                  >
                    <template #right-icon>
                      <span class="view-count">
                        <van-icon name="eye-o" />
                        {{ article.view_count || 0 }}
                      </span>
                    </template>
                  </van-cell>
                </div>

                <!-- 二级章节 -->
                <div v-if="chapter.sub_chapters && chapter.sub_chapters.length > 0" class="sub-chapters">
                  <div v-for="subChapter in chapter.sub_chapters" :key="subChapter.id" class="sub-chapter-item">
                    <!-- 二级章节标题 -->
                    <div class="sub-chapter-header" @click="toggleChapter(subChapter.id)">
                      <van-icon :name="expandedChapters.includes(subChapter.id) ? 'arrow-down' : 'arrow'" />
                      <span class="sub-chapter-name">{{ subChapter.name }}</span>
                      <span class="article-count">({{ subChapter.articles?.length || 0 }})</span>
                    </div>

                    <!-- 二级章节下的文章 -->
                    <div v-show="expandedChapters.includes(subChapter.id)" class="articles-group sub-articles">
                      <van-cell
                        v-for="article in subChapter.articles"
                        :key="article.id"
                        :title="article.title"
                        is-link
                        @click="viewArticle(article.id)"
                        class="article-cell"
                      >
                        <template #right-icon>
                          <span class="view-count">
                            <van-icon name="eye-o" />
                            {{ article.view_count || 0 }}
                          </span>
                        </template>
                      </van-cell>
                      <van-empty
                        v-if="!subChapter.articles || subChapter.articles.length === 0"
                        description="暂无文章"
                        :image-size="60"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <van-empty v-else description="暂无笔记" />
        </van-pull-refresh>
      </div>
    </div>

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
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getTags } from '@/api/tag'
import { getChaptersByTag } from '@/api/note'

const route = useRoute()
const router = useRouter()
const active = ref(2)
const activeTag = ref(0)
const tags = ref([])
const chapters = ref([])
const loading = ref(false)
const refreshing = ref(false)
const currentTag = ref('')
const expandedChapters = ref([])

const fetchTags = async () => {
  try {
    const { data } = await getTags()
    tags.value = Array.isArray(data) ? data : (data.list || [])

    if (tags.value.length > 0) {
      const tagName = route.params.tag || tags.value[0].name
      currentTag.value = tagName
      activeTag.value = tags.value.findIndex(t => t.name === tagName)
      loadChapters()
    }
  } catch (error) {
    showToast('加载标签失败')
    console.error('Failed to fetch tags:', error)
  }
}

const loadChapters = async () => {
  if (!currentTag.value) return

  try {
    loading.value = true
    const { data } = await getChaptersByTag(currentTag.value)
    chapters.value = data || []

    // 默认展开第一个章节
    if (chapters.value.length > 0) {
      expandedChapters.value = [chapters.value[0].id]
    }
  } catch (error) {
    showToast('加载笔记失败')
    console.error('Failed to fetch chapters:', error)
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

const selectTag = (tagName, index) => {
  activeTag.value = index
  currentTag.value = tagName
  chapters.value = []
  expandedChapters.value = []
  loadChapters()
}

const onRefresh = () => {
  loadChapters()
}

const toggleChapter = (chapterId) => {
  const index = expandedChapters.value.indexOf(chapterId)
  if (index > -1) {
    expandedChapters.value.splice(index, 1)
  } else {
    expandedChapters.value.push(chapterId)
  }
}

const getChapterArticleCount = (chapter) => {
  let count = chapter.articles?.length || 0
  if (chapter.sub_chapters) {
    chapter.sub_chapters.forEach(sub => {
      count += sub.articles?.length || 0
    })
  }
  return count
}

const viewArticle = (articleId) => {
  router.push(`/articles/${articleId}`)
}

onMounted(() => {
  fetchTags()
})
</script>

<style scoped>
.notes {
  min-height: 100vh;
  background: var(--phone-bg);
  padding-bottom: 68px;
}

.notes-container {
  display: flex;
  height: calc(100vh - 46px - 60px);
  background: var(--phone-bg);
}

.sidebar {
  width: 104px;
  flex-shrink: 0;
  border-right: 1px solid var(--phone-border);
  background: rgba(255, 255, 255, 0.82);
}

.sidebar :deep(.van-sidebar-item) {
  background: transparent;
  color: var(--phone-muted);
  font-weight: 700;
}

.sidebar :deep(.van-sidebar-item--select) {
  color: var(--phone-primary);
  background: var(--phone-primary-soft);
}

.sidebar :deep(.van-sidebar-item--select::before) {
  background: var(--phone-primary);
  border-radius: 999px;
}

.notes-content {
  flex: 1;
  overflow-y: auto;
  background: var(--phone-bg);
  padding: 12px;
}

.loading-wrapper {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.chapters-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chapter-item {
  border: 1px solid var(--phone-border);
  border-radius: 12px;
  background: var(--phone-surface);
  overflow: hidden;
  box-shadow: var(--phone-shadow-sm);
}

.chapter-header {
  display: flex;
  align-items: center;
  padding: 14px;
  background:
    linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(14, 165, 233, 0.04)),
    var(--phone-surface);
  color: var(--phone-heading);
  cursor: pointer;
  user-select: none;
  gap: 8px;
}

.chapter-header:active {
  background: var(--phone-primary-soft);
}

.chapter-name {
  flex: 1;
  font-size: 15px;
  font-weight: 850;
  line-height: 1.35;
}

.article-count {
  font-size: 13px;
  color: var(--phone-subtle);
  font-weight: 700;
}

.chapter-content {
  background: var(--phone-surface);
}

.sub-chapters {
  padding: 0;
}

.sub-chapter-item {
  border-top: 1px solid var(--phone-border);
}

.sub-chapter-header {
  display: flex;
  align-items: center;
  padding: 12px 14px 12px 28px;
  background: var(--phone-surface-soft);
  color: var(--phone-primary);
  cursor: pointer;
  user-select: none;
  gap: 8px;
}

.sub-chapter-header:active {
  background: var(--phone-primary-soft);
}

.sub-chapter-name {
  flex: 1;
  font-size: 14px;
  font-weight: 750;
  line-height: 1.35;
}

.articles-group {
  background: var(--phone-surface);
}

.sub-articles {
  background: var(--phone-surface-soft);
}

.article-cell {
  background: transparent;
  border-bottom: 1px solid var(--phone-border);
}

.article-cell :deep(.van-cell__title) {
  color: var(--phone-text);
  font-weight: 700;
  line-height: 1.45;
}

.article-cell:last-child {
  border-bottom: none;
}

.sub-articles .article-cell {
  padding-left: 48px !important;
}

.view-count {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--phone-subtle);
  font-weight: 650;
}
</style>
