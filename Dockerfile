# 使用官方 Nginx 镜像作为基础镜像
FROM nginx:alpine

# 复制构建的前端静态文件到 Nginx 的默认目录
COPY dist/ /usr/share/nginx/html/

# 替换默认的 nginx 配置文件，如果你有自定义配置
# COPY nginx.conf /etc/nginx/nginx.conf

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
