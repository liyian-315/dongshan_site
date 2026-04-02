# 构建阶段
FROM node:20-alpine AS build
# 工作目录设为 /app
WORKDIR /app
# 从项目根目录复制前端项目文件（因为 context 是 .）
COPY frontend/dongshan_site/ ./
RUN npm install
#COPY frontend/dongshan_site/ ./
# 执行构建
RUN npm run build
# 运行阶段
FROM nginx:alpine
# 复制构建产物
COPY --from=build /app/dist /usr/share/nginx/html
# 复制 Nginx 配置（从项目根目录的 nginx 文件夹）
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
# 暴露端口
EXPOSE 80 443
# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
