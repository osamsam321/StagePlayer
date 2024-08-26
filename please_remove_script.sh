path=$(pwd)
run_path="run"
cd stage_player_back
nohup npx tsx --watch src/index.tsx > /dev/null 2>&1 & echo $! > $path/$run_path/stage_player_back.pid
cd ../stage_player_react/
nohup npm start > /dev/null 2>&1 & echo $! > $path/$run_path/stage_player_react.pid
