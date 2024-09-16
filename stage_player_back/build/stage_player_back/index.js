import express from "express";
import main_path from './constants/path.js';
//import base_router from '../src/routes/stage_player_routes.ts';
import spotify_auth from './routes/spotify_auth.js';
//import spotify_router from '../src/routes/spotify_api_routes.ts';
//import musicbrainz_router from '../src/routes/music_brainz_routes.ts';
import dotenv from "dotenv";
import cors from 'cors';
import session from 'express-session';
dotenv.config({ path: '.env' });
const app = express();
app.use(session({
    secret: 'hello',
    resave: false,
    saveUninitialized: true,
}));
const allowedOrigins = ['http://localhost', 'http://localhost:80', 'http://localhost:2800'];
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, origin);
        }
        else {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
    },
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));
// Middleware to parse JSON data in the request body
app.use(express.json());
// Middleware to parse URL-encoded data in the request body
app.use(express.urlencoded({ extended: true }));
//app.use(cors({
//origin: '*', // Replace with your client app URL
//credentials: true // Enable credentials to allow cookies, authorization headers, etc.
//}));
//app.use(function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "*");
//  res.header("Access-Control-Allow-Headers", "X-Requested-With");
//  next();
//});
//const options: cors.CorsOptions = {
//  origin: allowedOrigins
//};
//app.use(cors(options));
//app.use(cors());
app.use(cors());
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);
const staticDir = process.env.PUBLIC_WEB_FOLDER;
//app.use(express.static(path.join(__dirname, '..', 'public')));
const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
    if (staticDir)
        res.sendFile(staticDir);
});
app.listen(port, () => {
    console.log('[server]: Server is running at http://localhost:${port}');
});
app.use(main_path.base, spotify_auth);
//app.use(main_path.base, base_router);
//app.use(main_path.base, spotify_router);
//app.use(main_path.base, musicbrainz_router);
//app.use(express.static(staticDir));
