FROM alpine:latest
WORKDIR /app
RUN mkdir -p /var/www/stage_player
RUN addgroup -S node && adduser -S webapp -G node
RUN adduser -S www-data
RUN apk --no-cache add nginx
RUN apk --no-cache add nodejs npm
#expost nodejs 3000 and nginx 80
EXPOSE 3000
EXPOSE 80
#COPY nginx/alphine/nginx.conf /etc/nginx/nginx.conf
#COPY nginx/alphine/default /etc/nginx/http.d/default
COPY --chown=node:node /stage_player_back/package-lock.json package.json ./
COPY --chown=node:node /stage_player_react/build/ /var/www/stage_player
RUN echo "<h1> Welcome Page </h1>">> /var/www/index.html
CMD ["nginx", "-g", "daemon off;"]


