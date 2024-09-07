FROM alpine:latest

ADD docker_start_commands.sh /
RUN chmod +x /docker_start_commands.sh
RUN apk add --no-cache bash
RUN apk add --no-cache nodejs npm
#INIT docker container env
WORKDIR /app
RUN mkdir -p /var/www/stage_player
RUN mkdir -p stage_player_back
RUN addgroup -S node && adduser -S webadmin -G node
RUN adduser -S www-data
RUN apk --no-cache add nginx
EXPOSE 3000
EXPOSE 80

##RUN apk --no-cache add nodejs npm

#NGINX stuff
COPY nginx/alphine/nginx.conf /etc/nginx/nginx.conf
COPY nginx/alphine/default /etc/nginx/http.d/default

#COPY --chown=node:node /stage_player_back/build/ /app/
#API portion sir
WORKDIR /app/stage_player_back
COPY stage_player_back/package.json ../
COPY stage_player_back/package.json .
COPY stage_player_back/package-lock.json .
RUN npm install --only=prod
COPY --chown=node:node /stage_player_back/build/stage_player_back .
WORKDIR /app
COPY --chown=node:node /stage_player_react/build/ /var/www/stage_player
#FINAL scripts
RUN echo "<h1> Welcome </h1>">> /var/www/index.html
CMD ["/docker_start_commands.sh"]


