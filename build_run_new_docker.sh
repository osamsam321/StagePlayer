#!/bin/sh
if [ $# -eq 0 ]; then
    echo "no argument were provided. Please provide the .env.list file to pass in. It should be list as .env.list.prod or .env.list.dev"
    exit 1;
fi
echo "Your file is $1"
if [ "$1" = ".env.file.prod" ] || [ "$1" = ".env.file.dev" ]; then
    echo "Going to stop old docker. This make take some time..."
    docker stop `docker ps -q`
    echo "Going to build and run the new docker container..."
    docker build  -t 'stage_player_docker_v1:dev' .
    docker run --env-file "$1" -p 3000:3000 -p 80:80 -d stage_player_docker_v1:dev
    docker exec -it `docker ps -q` /bin/sh
    echo "done"
    else
        echo "Incorrect parameter. Please provide the .env.list file to pass in. It should be .env.file.prod or .env.file.dev"
        exit 1;
fi


