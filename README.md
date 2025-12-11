# 移动端博客项目

基于 Vue 3 + Vite + Vant 构建的移动端个人博客系统。

## 技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **UI 组件库**: Vant 4
- **状态管理**: Pinia
- **路由**: Vue Router
- **HTTP 客户端**: Axios
- **Markdown 渲染**: Markdown-it
- **代码高亮**: Highlight.js

## 功能特性

- ✅ 首页展示
- ✅ 文章列表和详情
- ✅ 笔记分类浏览
- ✅ 文章搜索
- ✅ 用户登录/注册
- ✅ 留言板
- ✅ 个人中心
- ✅ 文章点赞/收藏
- ✅ 评论功能
- ✅ 响应式设计

## 项目结构

```
leaf-ui-phone/
├── public/              # 静态资源
├── src/
│   ├── api/            # API 接口
│   ├── assets/         # 资源文件
│   ├── components/     # 公共组件
│   ├── router/         # 路由配置
│   ├── stores/         # 状态管理
│   ├── views/          # 页面组件
│   ├── App.vue         # 根组件
│   └── main.js         # 入口文件
├── index.html          # HTML 模板
├── package.json        # 依赖配置
└── vite.config.js      # Vite 配置
```

## 开始使用

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3001

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## API 接口

所有 API 接口与 PC 端保持一致，通过 `/api` 前缀代理到后端服务器。

## 环境要求

- Node.js >= 16
- npm >= 8

## 浏览器支持

- iOS Safari >= 10
- Android >= 5.0
- Chrome (mobile) >= 60

## 许可

MIT
