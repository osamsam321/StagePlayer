export default {
 base: "/api",
 playback: {
   base: "/api",
   pause: "/pause",
   start: "/start",
   stop: "/stop",
   skip_forward: "/skip_forward",
   skip_back: "/skip_back"
 },
 metadata_deezer:{
   info: "/info",
   artist: "/artist",
   fts: "/fts",
   top_charts: "/top_charts",
 },
  metadata_spotify:{
   info: "/info",
   artist: "/artist",
   search_track: "/search_track",
   top_charts_global_50: "/top_charts_global_50",
 },

 spotify_auth:{
   base: "/api",
   auth: "/auth",
   login: "/login",
   callback: "/callback",
   refresh_token:"/refresh_token",
   token: "/token",
 },
 home: "/home",
}
