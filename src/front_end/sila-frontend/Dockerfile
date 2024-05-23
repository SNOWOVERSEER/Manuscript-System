# 使用官方的Nginx镜像作为基础镜像
FROM nginx:alpine

# 删除默认的Nginx配置文件
RUN rm -rf /usr/share/nginx/html/*

# 将本地的build目录复制到容器中的Nginx目录
COPY build /usr/share/nginx/html

EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]
