# Stage Player

Stage Player is a web-based music player application built around the Spotify Web API. It allows users to play and manage music directly from their Spotify account through an interactive interface. The app is built using TypeScript, Express, Nginx, React, and Docker to provide a smooth and scalable experience.

## Prerequisites

Before getting started, you’ll need the following:

- A **Spotify Premium** account.
- Registered app in the **Spotify Developer Dashboard**.
- Spotify **Client ID** and **Client Secret**.
- [docker install](https://docs.docker.com/engine/install/).

## Technologies Used

- **TypeScript**: For type-safe JavaScript code.
- **Express**: Node.js framework for building API server.
- **Nginx**: Used as a reverse proxy and static file server.
- **React**: Front-end framework for building the UI.
- **Docker**: Containerization for easy deployment and scaling.

## Getting Started

### Step 1: Register the App in Spotify Developer Dashboard

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications).
2. Create a new application.
3. Obtain the **Client ID** and **Client Secret** from the application details.
4. Set the appropriate **Redirect URIs** for OAuth, such as `http://localhost/callback`.


### Step 2: Clone Project

Create a `.env` file at the root of the project and fill it with the following details:

```bash
git clone https://github.com/osamsam321/StagePlayer.git
cd stage_player
cd build/docker
```
### Step 3: Setup Docker Environment Variables

Edit .env.file.sample

```bash
vi builds/docker/.env.file.sample
cp builds/docker.env.file.sample build/docker.env.file.prod
```

### OPTIONAL! Step 4: Setup React Environment Variables to modify any domain or hosts

Edit .env.sample

```bash
vi builds/docker/.env.sample
cp stage_player_react/.env.sample stage_player_react/.env
```

### Step 4: Setup Environment Variables

Build and Run Docker container
```bash
./build_run_new_docker.sh ".env.file.prod"
```

