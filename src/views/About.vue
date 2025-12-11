<template>
  <div class="about">
    <van-nav-bar
      title="关于"
      fixed
      placeholder
      left-arrow
      @click-left="$router.back()"
    />

    <div class="content">
      <div class="avatar-section">
        <van-image
          round
          width="100"
          height="100"
          src="/img/touxiang.png"
        />
        <h1>个人博客</h1>
        <p>记录学习 · 分享知识 · 探索技术</p>
      </div>

      <van-cell-group inset title="关于博主">
        <van-cell>
          <template #title>
            <div class="about-text">
              <p>👨‍💻 运维工程师</p>
              <p>📚 热爱学习，喜欢分享</p>
              <p>💡 专注于 Go、Kubernetes</p>
              <p>🎯 持续学习，不断进步</p>
            </div>
          </template>
        </van-cell>
      </van-cell-group>

      <van-cell-group inset title="联系方式">
        <van-cell title="GitHub" is-link icon="github-o" @click="openGitHub" />
        <van-cell title="Email" is-link icon="envelop-o" @click="openEmail" />
      </van-cell-group>

      <van-cell-group inset title="技术栈">
        <van-cell>
          <template #title>
            <div class="tags">
              <van-tag type="primary">Go</van-tag>
              <van-tag type="success">Kubernetes</van-tag>
              <van-tag type="warning">Vue.js</van-tag>
              <van-tag>Docker</van-tag>
              <van-tag>MySQL</van-tag>
              <van-tag>Redis</van-tag>
              <van-tag>Nginx</van-tag>
            </div>
          </template>
        </van-cell>
      </van-cell-group>

      <div class="footer">
        <p>© 2024 个人博客. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const openGitHub = () => {
  window.open('https://github.com/ydcloud-dy', '_blank')
}

const openEmail = () => {
  window.location.href = 'mailto:dycloudlove@163.com'
}
</script>

<style scoped>
.about {
  min-height: 100vh;
  background: #f7f8fa;
}

.content {
  padding: 16px;
}

.avatar-section {
  text-align: center;
  padding: 40px 20px;
  background:
    linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url('/img/wukong.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
  border-radius: 12px;
  margin-bottom: 16px;
}

.avatar-section h1 {
  font-size: 24px;
  margin: 16px 0 8px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.avatar-section p {
  font-size: 14px;
  opacity: 0.9;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.about-text p {
  margin: 8px 0;
  font-size: 14px;
  color: #646566;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.footer {
  text-align: center;
  padding: 40px 20px;
  color: #969799;
  font-size: 12px;
}

.van-cell-group {
  margin-bottom: 12px;
}
</style>
