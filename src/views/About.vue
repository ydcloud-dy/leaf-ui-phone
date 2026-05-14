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
        <p class="profile-kicker">Leaf Blog</p>
        <h1>个人博客</h1>
        <p>记录学习、分享实践、沉淀工程经验</p>
      </div>

      <section class="section-card">
        <h2>关于博主</h2>
        <div class="about-list">
          <div class="about-item">
            <van-icon name="cluster-o" />
            <span>关注运维、云原生和后端工程实践</span>
          </div>
          <div class="about-item">
            <van-icon name="records-o" />
            <span>持续整理线上问题复盘与技术笔记</span>
          </div>
          <div class="about-item">
            <van-icon name="fire-o" />
            <span>主要方向：Go、Kubernetes、Docker、工程效率</span>
          </div>
        </div>
      </section>

      <van-cell-group inset title="联系方式" class="section-group">
        <van-cell title="GitHub" label="查看开源项目" is-link icon="link-o" @click="openGitHub" />
        <van-cell title="Email" label="发送邮件交流" is-link icon="envelop-o" @click="openEmail" />
      </van-cell-group>

      <section class="section-card">
        <h2>技术栈</h2>
        <div class="tags">
          <van-tag type="primary">Go</van-tag>
          <van-tag type="success">Kubernetes</van-tag>
          <van-tag type="warning">Vue.js</van-tag>
          <van-tag>Docker</van-tag>
          <van-tag>MySQL</van-tag>
          <van-tag>Redis</van-tag>
          <van-tag>Nginx</van-tag>
        </div>
      </section>

      <div class="footer">
        <p>© 2026 个人博客. All rights reserved.</p>
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
  background: var(--phone-bg);
}

.content {
  padding: 14px 0 24px;
}

.avatar-section {
  text-align: center;
  padding: 34px 20px 30px;
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.18), rgba(15, 23, 42, 0.82)),
    url('/img/wukong.png');
  background-size: cover;
  background-position: center;
  color: white;
  border-radius: 18px;
  margin: 0 14px 14px;
  overflow: hidden;
  box-shadow: var(--phone-shadow);
}

.avatar-section :deep(.van-image) {
  border: 3px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.25);
}

.profile-kicker {
  margin: 16px 0 8px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
  font-weight: 850;
}

.avatar-section h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 850;
  line-height: 1.2;
  text-shadow: 0 4px 18px rgba(0, 0, 0, 0.28);
}

.avatar-section p:last-child {
  margin: 10px 0 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.7;
}

.section-card {
  margin: 0 14px 14px;
  padding: 16px;
  border: 1px solid var(--phone-border);
  border-radius: var(--phone-radius);
  background: var(--phone-surface);
  box-shadow: var(--phone-shadow-sm);
}

.section-card h2 {
  margin: 0 0 14px;
  color: var(--phone-heading);
  font-size: 17px;
  font-weight: 850;
}

.about-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.about-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: var(--phone-text);
  font-size: 14px;
  line-height: 1.6;
  font-weight: 650;
}

.about-item .van-icon {
  margin-top: 3px;
  color: var(--phone-primary);
  font-size: 18px;
  flex-shrink: 0;
}

.section-group {
  margin-bottom: 14px;
}

.section-group :deep(.van-cell-group__title) {
  padding-left: 0;
  color: var(--phone-heading);
  font-weight: 850;
}

.section-group :deep(.van-cell__title) {
  font-weight: 750;
}

.section-group :deep(.van-cell__label) {
  margin-top: 4px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tags :deep(.van-tag) {
  padding: 5px 9px;
  border-radius: 999px;
  font-weight: 750;
}

.footer {
  text-align: center;
  padding: 24px 20px 10px;
  color: var(--phone-subtle);
  font-size: 12px;
  font-weight: 650;
}

.van-cell-group {
  margin-bottom: 12px;
}
</style>
