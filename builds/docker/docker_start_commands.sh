#!/bin/bash

# Start Node app in the background
node /app/stage_player/index.js &

# Start Nginx in the background
nginx -g 'daemon off;' &

# Navigate to the backend folder
cd /app/stage_player_back

# Run the server using npm
npm run start_on_server

# Keep the script running to ensure the container doesn't exit
wait
