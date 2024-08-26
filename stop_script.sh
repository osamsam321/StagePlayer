path=$(pwd)
run_path="run"
echo "path of pids: $path/$run_path"
if [ -e $path/$run_path/stage_player_back.pid ] && ps -p $(cat $path/$run_path/stage_player_back.pid) > /dev/null; then
    echo "going to kill stage player back pid"
    kill $(cat $path/$run_path/stage_player_back.pid);
    rm -f $path/$run_path/stage_player_back.pid;
fi

if [ -e $path/$run_path/stage_player_react.pid ] && ps -p $(cat $path/$run_path/stage_player_react.pid) > /dev/null; then
    echo "going to kill stage player react pid"
    kill $(cat $path/$run_path/stage_player_react.pid);
    rm -f $path/$run_path/stage_player_react.pid;
fi
