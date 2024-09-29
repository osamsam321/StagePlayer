
echo "starting build for the stage_player backened";
cd ../../stage_player_back;
npx tsc;
wait;
echo "done";
echo "starting react build";
cd ../stage_player_react;
npm run build --production;
echo "done";

