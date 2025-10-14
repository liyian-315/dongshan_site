# Dongshan Site

Dongshan Site 是一个基于 Vue 3 和 Vite 构建的现代化前端项目模板，适用于快速搭建镜像站点或内容聚合平台。该项目结构清晰，易于扩展和维护。

## 特性

- ⚡️ 基于 [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/) 构建
- 💡 支持热更新与高效开发
- 🎨 易于自定义和扩展
- 📦 生产环境自动优化打包

## 安装

请确保已安装 [Node.js](https://nodejs.org/) (建议版本 >= 16)。

```sh
git clone <your-repo-url>
cd dongshan_site
npm install
```

## 本地开发

启动本地开发服务器，支持热重载：

```sh
npm run dev
```

## 构建生产版本

生成用于生产环境的静态文件：

```sh
npm run build
```

## 预览生产版本

本地预览生产构建结果：

```sh
npm run preview
```

## 技术栈

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [npm](https://www.npmjs.com/)

## 推荐开发工具

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## 目录结构

```
dongshan_site/
├── public/         # 静态资源
├── src/            # 源码目录
│   ├── assets/     # 静态资源
│   ├── components/ # 组件
│   └── ...         # 其他
├── package.json
└── vite.config.js
```

## 许可证

MIT
