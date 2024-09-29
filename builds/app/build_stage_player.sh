echo "starting build for the stage_player backened";
cd ../../stage_player_back;
npm install
npx tsc;
wait;
echo "done";
echo "starting react build";
cd ../stage_player_react;
npm install
npm run build --production;
echo "done";
