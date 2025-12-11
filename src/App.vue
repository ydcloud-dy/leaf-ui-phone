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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "STHeiti", "Heiti SC", "Microsoft YaHei", "SimHei", sans-serif;
  background-color: #f5f7fa;
  font-size: 14px;
}

#app {
  min-height: 100vh;
}
</style>
