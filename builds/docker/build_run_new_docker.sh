#!/bin/sh

if [ $# -eq 0 ]; then
    echo "no argument were provided. Please provide the .env.list file to pass in. It should be list as .env.list.prod or .env.list.dev"
    exit 1;
fi

echo "Your file is $1"

if [ "$1" = ".env.file.prod" ] || [ "$1" = ".env.file.dev" ]; then


    #INIT

    docker_build_dir=`pwd`
    env_file=`realpath $1`
        docker_tag='stage_player_docker_v1'

    #STOP

    echo "Going to stop old docker. This make take some time..."
    container_id=$(docker ps -aqf "name=$docker_tag")
    if [ -n "$container_id" ]; then
        docker stop "$container_id"
        docker rm "$container_id"
    else
        echo "Container not found."
    fi

    #BUILD

    echo "running your app builds"
    echo "Going to build and run the new docker container..."
    echo "changing working directory to execute dockerfile"
    ../app/build_stage_player.sh
    cd ../../
    docker build  -t "$docker_tag" .

    #RUN

    docker_container_id=$(docker run --name $docker_tag --env-file "$env_file" -p 3000:3000 -p 80:80 -d "$docker_tag")
    echo "your container id: $docker_container_id"
    echo "done"


else
    echo "Incorrect parameter. Please provide the .env.list file to pass in. It should be .env.file.prod or .env.file.dev"
    exit 1;
fi


