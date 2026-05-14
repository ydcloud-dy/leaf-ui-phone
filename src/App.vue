<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onMounted(() => {
  // 尝试从本地存储恢复用户信息
  userStore.initUser()
})
</script>

<style>
:root {
  --phone-bg: #eef3f8;
  --phone-surface: #ffffff;
  --phone-surface-soft: #f7fafc;
  --phone-heading: #172033;
  --phone-text: #334155;
  --phone-muted: #64748b;
  --phone-subtle: #94a3b8;
  --phone-border: #dbe4ee;
  --phone-primary: #2563eb;
  --phone-primary-soft: #eaf2ff;
  --phone-accent: #0f766e;
  --phone-accent-soft: #e8f7f4;
  --phone-success: #16a34a;
  --phone-warning: #f59e0b;
  --phone-radius: 14px;
  --phone-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
  --phone-shadow-sm: 0 6px 18px rgba(15, 23, 42, 0.06);
  --van-primary-color: var(--phone-primary);
  --van-background: var(--phone-bg);
  --van-background-2: var(--phone-surface);
  --van-text-color: var(--phone-text);
  --van-text-color-2: var(--phone-muted);
  --van-border-color: var(--phone-border);
  --van-radius-md: 10px;
  --van-cell-background: var(--phone-surface);
  --van-cell-text-color: var(--phone-heading);
  --van-field-input-text-color: var(--phone-heading);
  --van-button-primary-background: var(--phone-primary);
  --van-button-primary-border-color: var(--phone-primary);
  --van-tabbar-background: rgba(255, 255, 255, 0.94);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  min-height: 100%;
  background: var(--phone-bg);
}

body {
  min-height: 100%;
  font-family:
    "Inter",
    "PingFang SC",
    "Hiragino Sans GB",
    "Microsoft YaHei",
    Arial,
    sans-serif;
  background:
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.12), transparent 34%),
    var(--phone-bg);
  color: var(--phone-text);
  font-size: 14px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

#app {
  min-height: 100vh;
}

button,
input,
textarea {
  font: inherit;
}

.van-tabbar {
  border-top: 1px solid rgba(219, 228, 238, 0.9);
  backdrop-filter: blur(14px);
}

.van-tabbar-item--active {
  font-weight: 750;
}

.van-nav-bar {
  background: rgba(255, 255, 255, 0.94);
  border-bottom: 1px solid var(--phone-border);
  backdrop-filter: blur(14px);
}

.van-nav-bar__title {
  color: var(--phone-heading);
  font-weight: 800;
}

.van-nav-bar .van-icon {
  color: var(--phone-heading);
}

.van-search {
  padding: 0;
  background: transparent;
}

.van-search__content {
  border-radius: 12px;
  background: var(--phone-surface-soft);
}

.van-cell-group--inset {
  margin-right: 14px;
  margin-left: 14px;
  border: 1px solid var(--phone-border);
  border-radius: var(--phone-radius);
  box-shadow: var(--phone-shadow-sm);
  overflow: hidden;
}

.van-cell::after {
  border-color: var(--phone-border);
}

.van-button--round {
  font-weight: 750;
}
</style>
