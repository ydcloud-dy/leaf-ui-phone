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
      <!-- 留言表单 -->
      <van-form @submit="handleSubmit" v-if="userStore.isLoggedIn">
        <van-cell-group inset>
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
          <van-button round block type="primary" native-type="submit" :loading="submitting">
            发表留言
          </van-button>
        </div>
      </van-form>

      <van-empty v-else description="请先登录" />

      <!-- 留言列表 -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="loadComments"
        >
          <van-cell v-for="comment in comments" :key="comment.id">
            <template #title>
              <div class="comment-header">
                <van-image
                  round
                  width="32"
                  height="32"
                  :src="comment.user?.avatar"
                />
                <div class="user-info">
                  <div class="username">{{ comment.user?.nickname || comment.user?.username }}</div>
                  <div class="time">{{ formatDate(comment.created_at) }}</div>
                </div>
              </div>
            </template>
            <template #label>
              <div class="comment-content">{{ comment.content }}</div>
            </template>
          </van-cell>
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
  background: #f7f8fa;
}

.content {
  padding: 16px;
}

.submit-btn {
  margin: 16px 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.user-info {
  flex: 1;
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: #323233;
}

.time {
  font-size: 12px;
  color: #969799;
  margin-top: 2px;
}

.comment-content {
  font-size: 14px;
  color: #646566;
  line-height: 1.6;
  margin-top: 8px;
}
</style>
