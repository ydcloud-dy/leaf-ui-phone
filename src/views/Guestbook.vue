<template>
  <div class="guestbook">
    <van-nav-bar
      title="留言板"
      fixed
      placeholder
      left-arrow
      @click-left="$router.back()"
    />

    <div class="content">
      <div class="page-hero">
        <p class="hero-kicker">Guestbook</p>
        <h1>留言板</h1>
        <p>留下建议、问题或想交流的话题</p>
      </div>

      <!-- 留言表单 -->
      <van-form class="message-card" @submit="handleSubmit" v-if="userStore.isLoggedIn">
        <div class="composer-title">写留言</div>
        <van-cell-group inset class="message-field">
          <van-field
            v-model="message"
            rows="3"
            autosize
            type="textarea"
            maxlength="500"
            placeholder="写下你的留言..."
            show-word-limit
          />
        </van-cell-group>
        <div class="submit-btn">
          <van-button block type="primary" native-type="submit" :loading="submitting">
            发表留言
          </van-button>
        </div>
      </van-form>

      <div class="login-card" v-else>
        <div class="login-icon">
          <van-icon name="comment-o" />
        </div>
        <div>
          <h2>登录后留言</h2>
          <p>登录后可以提交留言并参与交流</p>
        </div>
        <van-button type="primary" round size="small" @click="$router.push('/login')">登录</van-button>
      </div>

      <!-- 留言列表 -->
      <van-pull-refresh class="comments-panel" v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="loadComments"
        >
          <div class="comment-card" v-for="comment in comments" :key="comment.id">
            <div class="comment-header">
              <van-image
                round
                width="36"
                height="36"
                :src="comment.user?.avatar"
              >
                <template v-slot:error>
                  <div class="avatar-placeholder">
                    {{ (comment.user?.nickname || comment.user?.username || '匿').charAt(0).toUpperCase() }}
                  </div>
                </template>
              </van-image>
              <div class="user-info">
                <div class="username">{{ comment.user?.nickname || comment.user?.username || '匿名用户' }}</div>
                <div class="time">{{ formatDate(comment.created_at) }}</div>
              </div>
            </div>
            <div class="comment-content">{{ comment.content }}</div>
          </div>

          <van-empty
            v-if="!loading && !comments.length"
            description="暂无留言"
            :image-size="80"
          />
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { showToast } from 'vant'
import dayjs from 'dayjs'
import { useUserStore } from '@/stores/user'
import { getComments, createComment } from '@/api/comment'

const userStore = useUserStore()
const message = ref('')
const comments = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const submitting = ref(false)

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

const loadComments = async () => {
  try {
    loading.value = true
    const { data } = await getComments({
      type: 'guestbook',
      page: 1,
      page_size: 50
    })

    comments.value = data.list || []
    finished.value = true
  } catch (error) {
    showToast('加载留言失败')
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

const handleSubmit = async () => {
  if (!message.value.trim()) {
    showToast('请输入留言内容')
    return
  }

  try {
    submitting.value = true
    await createComment({
      content: message.value,
      type: 'guestbook'
    })

    showToast('留言成功')
    message.value = ''
    onRefresh()
  } catch (error) {
    showToast(error.message || '留言失败')
  } finally {
    submitting.value = false
  }
}

const onRefresh = () => {
  comments.value = []
  finished.value = false
  loadComments()
}

onMounted(() => {
  loadComments()
})
</script>

<style scoped>
.guestbook {
  min-height: 100vh;
  background: var(--phone-bg);
}

.content {
  padding: 14px 14px 24px;
}

.page-hero {
  position: relative;
  overflow: hidden;
  margin-bottom: 14px;
  padding: 24px 18px;
  border: 1px solid rgba(37, 99, 235, 0.16);
  border-radius: 18px;
  background:
    linear-gradient(135deg, rgba(37, 99, 235, 0.14), rgba(15, 118, 110, 0.1)),
    var(--phone-surface);
  box-shadow: var(--phone-shadow);
}

.hero-kicker {
  margin: 0 0 8px;
  color: var(--phone-primary);
  font-size: 12px;
  font-weight: 850;
}

.page-hero h1 {
  margin: 0;
  color: var(--phone-heading);
  font-size: 24px;
  font-weight: 850;
  line-height: 1.22;
}

.page-hero p:last-child {
  margin: 10px 0 0;
  color: var(--phone-muted);
  font-size: 14px;
}

.message-card,
.login-card {
  margin-bottom: 14px;
  padding: 16px;
  border: 1px solid var(--phone-border);
  border-radius: var(--phone-radius);
  background: var(--phone-surface);
  box-shadow: var(--phone-shadow-sm);
}

.composer-title {
  margin-bottom: 10px;
  color: var(--phone-heading);
  font-size: 16px;
  font-weight: 850;
}

.message-field {
  margin: 0;
  border-radius: 12px;
  box-shadow: none;
}

.message-field :deep(.van-field__control) {
  color: var(--phone-heading);
  line-height: 1.7;
}

.login-card {
  display: flex;
  align-items: center;
  gap: 12px;
}

.login-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  background: var(--phone-primary-soft);
  color: var(--phone-primary);
  font-size: 22px;
  flex-shrink: 0;
}

.login-card h2 {
  margin: 0;
  color: var(--phone-heading);
  font-size: 16px;
  font-weight: 850;
}

.login-card p {
  margin: 4px 0 0;
  color: var(--phone-muted);
  font-size: 13px;
  line-height: 1.45;
}

.submit-btn {
  margin-top: 14px;
}

.submit-btn :deep(.van-button) {
  height: 42px;
  border-radius: 12px;
  font-weight: 850;
}

.comments-panel {
  min-height: 220px;
}

.comment-card {
  margin-bottom: 12px;
  padding: 15px;
  border: 1px solid var(--phone-border);
  border-radius: 14px;
  background: var(--phone-surface);
  box-shadow: var(--phone-shadow-sm);
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.avatar-placeholder {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--phone-primary), #60a5fa);
  color: white;
  font-weight: 850;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.username {
  color: var(--phone-heading);
  font-size: 14px;
  font-weight: 800;
}

.time {
  color: var(--phone-subtle);
  font-size: 12px;
  margin-top: 2px;
  font-weight: 650;
}

.comment-content {
  color: var(--phone-text);
  font-size: 14px;
  line-height: 1.75;
  white-space: pre-wrap;
}
</style>
