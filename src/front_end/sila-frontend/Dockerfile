# FROM nginx:alpine

# RUN rm -rf /usr/share/nginx/html/*

# COPY build /usr/share/nginx/html



# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]


FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

RUN echo $'server {\n\
    listen 80;\n\
    listen [::]:80;\n\
    server_name localhost;\n\
    root /usr/share/nginx/html;\n\
    index index.html index.htm;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    error_page 500 502 503 504 /50x.html;\n\
    location = /50x.html {\n\
        root /usr/share/nginx/html;\n\
    }\n\
    location ~* \.(?:manifest|appcache|html?|xml|json)$ {\n\
        expires -1;\n\
        add_header Cache-Control \'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0\';\n\
    }\n\
    location ~* \.(?:css|js|woff2?|ico|gif|jpe?g|png|svg|map)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, immutable";\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

COPY build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
