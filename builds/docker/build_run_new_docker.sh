#!/bin/sh
if [ $# -eq 0 ]; then
    echo "no argument were provided. Please provide the .env.list file to pass in. It should be list as .env.list.prod or .env.list.dev"
    exit 1;
fi
echo "Your file is $1"
echo "Your tag is $2"
if [ "$1" = ".env.file.prod" ] || [ "$1" = ".env.file.dev" ]; then
    env_file=`realpath $1`
    echo "Going to stop old docker. This make take some time..."
    docker_tag='stage_player_docker_v1'
    username='bigdady1235'
    docker_remote='bigdady1235/stage_player'
    docker stop `docker ps -q`
    #place your own app build here ...
    ../app/build_stage_player.sh
    echo "running your app builds"
    echo "Going to build and run the new docker container..."
    echo "changing working directory to execute dockerfile"
    cd ../../
    docker build  -t "$docker_tag" .
    docker tag "$docker_tag"  "$docker_remote:"$docker_tag
    docker run --env-file "$env_file" -p 3000:3000 -p 80:80 -d "$docker_tag"
    echo "now pushing to docker hub with your criteria"
    docker push "$docker_remote:$docker_tag"
    #docker exec -it `docker ps -q` /bin/sh
    echo "done"
    else
        echo "Incorrect parameter. Please provide the .env.list file to pass in. It should be .env.file.prod or .env.file.dev"
        exit 1;
fi


