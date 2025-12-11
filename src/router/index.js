import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/articles',
    name: 'Articles',
    component: () => import('@/views/Articles.vue')
  },
  {
    path: '/articles/:id',
    name: 'ArticleDetail',
    component: () => import('@/views/ArticleDetail.vue')
  },
  {
    path: '/notes',
    name: 'Notes',
    component: () => import('@/views/Notes.vue')
  },
  {
    path: '/notes/:tag',
    name: 'NotesByTag',
    component: () => import('@/views/Notes.vue')
  },
  {
    path: '/guestbook',
    name: 'Guestbook',
    component: () => import('@/views/Guestbook.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
