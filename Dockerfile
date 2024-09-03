FROM alpine:latest
WORKDIR /app
RUN mkdir -p /var/www/stage_player
RUN addgroup -S node && adduser -S webapp -G node
RUN apk --no-cache add nginx
RUN apk --no-cache add nodejs npm
#expost nodejs 3000 and nginx 80
EXPOSE 3000
EXPOSE 80
COPY nginx/nginx.conf /etc/nging/nginx.conf
COPY --chown=node:node /stage_player_back/package-lock.json package.json ./
COPY --chown=node:node stage_player_react/build/ /var/www/stage_player

CMD ["nginx", "-g", "daemon off;"]


