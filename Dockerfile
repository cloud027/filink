FROM nginx
COPY ./dist /usr/share/nginx/
COPY nginx_patch1.conf /etc/nginx/nginx.conf
COPY privacy.html /etc/privacy.html
COPY 3259028_test.fi-link.net.pem /ssl/3259028_test.fi-link.net.pem
COPY 3259028_test.fi-link.net.key /ssl/3259028_test.fi-link.net.key


###47.92.110.221 生产环境专用 env
#COPY nginx-sd.conf /etc/nginx/nginx.conf
#COPY 3173868_sd.fi-link.net.pem /ssl/3173868_sd.fi-link.net.pem
#COPY 3173868_sd.fi-link.net.key /ssl/3173868_sd.fi-link.net.key

# 内网环境专用
#COPY nginx-gd.conf /etc/nginx/nginx.conf
#COPY 2155996_fiberhome.fi-link.net.key /ssl/2155996_fiberhome.fi-link.net.key
#COPY 2155996_fiberhome.fi-link.net.pem /ssl/2155996_fiberhome.fi-link.net.pem
EXPOSE 443
#CMD ["nginx","-g","daemon off"]
