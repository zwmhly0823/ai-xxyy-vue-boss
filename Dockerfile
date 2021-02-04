FROM nginx:1.19.6-alpine

RUN \
  echo '{"status":"UP"}' > /usr/share/nginx/html/liveness.txt && \
  echo '{"status":"UP"}' > /usr/share/nginx/html/readiness.txt

ENV TZ "Asia/Shanghai"


COPY ./dist/music_app/index.html /usr/share/nginx/html/music_app/index.html
COPY ./dist/1v1Login/index.html /usr/share/nginx/html/1v1Login/index.html
COPY ./dist/dashboard/index.html /usr/share/nginx/html/dashboard/index.html
COPY ./dist/login/index.html /usr/share/nginx/html/login/index.html
COPY ./dist/setting/index.html /usr/share/nginx/html/setting/index.html
COPY ./dist/users/index.html /usr/share/nginx/html/users/index.html
COPY ./dist/noticeCenter/index.html /usr/share/nginx/html/noticeCenter/index.html

COPY ./src/main/nginx/default.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]

 
