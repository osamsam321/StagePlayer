FROM alpine:latest

ADD builds/docker/docker_start_commands.sh /
RUN chmod +x /docker_start_commands.sh
RUN apk add bash
RUN apk add nodejs npm
#INIT docker container env
WORKDIR /app
RUN mkdir -p /var/www/stage_player
RUN mkdir -p stage_player_back
RUN addgroup -S node && adduser -S webadmin -G node
RUN adduser -S www-data
RUN apk add nginx
EXPOSE 3000
EXPOSE 80

##RUN apk --no-cache add nodejs npm

#NGINX stuff
COPY nginx/alphine/nginx.conf /etc/nginx/nginx.conf
COPY nginx/alphine/default /etc/nginx/http.d/default
COPY nginx-selfsigned.crt /etc/ssl/certs
COPY nginx-selfsigned.key /etc/ssl/private/
#COPY --chown=node:node /stage_player_back/build/ /app/
#API portion sir
WORKDIR /app/stage_player_back
COPY stage_player_back/package.json .
COPY stage_player_back/package-lock.json .
#prod is a little confusing, but essentially skip the dev dependencies and install all other dependencies
RUN npm install --only=prod
#add your app stuff to this docker file
COPY --chown=node:node stage_player_back/build/stage_player_back .
WORKDIR /app
COPY --chown=node:node stage_player_react/build/ /var/www/
#FINAL scripts
RUN echo "<h1> Welcome </h1>">> /var/www/index.html
CMD ["/bin/bash", "/docker_start_commands.sh"]


