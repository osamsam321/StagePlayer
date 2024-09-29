#!/bin/bash
echo "starting build for the stage_player backened";
cd ../../stage_player_back;
# Check if node_modules folder exists
if [ ! -d "node_modules" ]; then
  echo "node_modules not found. Running npm install..."
  npm install
else
  # Check if package-lock.json or package.json is newer than node_modules
  if [ package-lock.json -nt node_modules ] || [ package.json -nt node_modules ]; then
    echo "package-lock.json or package.json has been updated. Running npm install..."
    npm install
  else
    echo "Dependencies are up to date. Skipping npm install."
  fi
fi
npx tsc;
wait;
echo "done";
echo "starting react build";
cd ../stage_player_react;
# Check if node_modules folder exists
if [ ! -d "node_modules" ]; then
  echo "node_modules not found. Running npm install..."
  npm install
else
  # Check if package-lock.json or package.json is newer than node_modules
  if [ package-lock.json -nt node_modules ] || [ package.json -nt node_modules ]; then
    echo "package-lock.json or package.json has been updated. Running npm install..."
    npm install
  else
    echo "Dependencies are up to date. Skipping npm install."
  fi
fi
npm run build --production;
echo "done";
