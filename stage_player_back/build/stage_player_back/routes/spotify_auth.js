import dotenv from 'dotenv';
import cors from 'cors';
import { Router } from "express";
import path from "../constants/path.js";
import axios from "axios";
import cookieParser from 'cookie-parser';
import winston from "winston";
const logger = winston.createLogger({
    // Log only if level is less than (meaning more severe) or equal to this
    level: "info",
    // Use timestamp and printf to create a standard log format
    format: winston.format.combine(winston.format.timestamp(), winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)),
    // Log to the console and a file
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "logs/app.log" }),
    ],
});
dotenv.config();
let app = Router();
const allowed_origin = process.env.ALLOWED_ORIGIN;
//const allowedOrigins = ['http://localhost', 'http://localhost:80', 'http://localhost:2800'];
app.use(cors({
    //  origin: function (origin, callback) {
    //    // Allow requests with no origin (like mobile apps or curl)
    //    if (!origin) return callback(null, true);
    //
    //    if (allowedOrigins.includes(origin)) {
    //      return callback(null, origin);
    //    } else {
    //      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    //      return callback(new Error(msg), false);
    //    }
    //  },
    origin: allowed_origin,
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));
app.use(cookieParser()); // <-- Ensure this line is included
let auth_router = Router();
app.use(path.spotify_auth.base, auth_router);
let spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
let spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
let spotify_redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
let generateRandomString = function (length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
app.get(path.spotify_auth.auth + path.spotify_auth.refresh_token, function (req, res) {
    var refresh_token = req.query.refresh_token;
    logger.log("info", `new refresh_token ${refresh_token}`);
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64'))
        },
        data: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        }),
        json: true
    };
    axios(authOptions)
        .then(response => {
        if (response.status === 200) {
            const access_token = response.data.access_token;
            const refresh_token = response.data.refresh_token;
            logger.log("info", `new access token ${access_token}`);
            res.send({
                'access_token': access_token,
                'refresh_token': refresh_token
            });
        }
    })
        .catch(error => {
        logger.log("error", `Error during the request ${error}`);
    });
});
app.get(path.spotify_auth.auth + path.spotify_auth.login, (req, res) => {
    logger.log("info", "reached login path");
    let scope = "streaming user-read-email user-read-private";
    let state = generateRandomString(16);
    let user_redirect_uri = req.query.redirect_uri + "";
    let auth_query_parameters = new URLSearchParams({
        response_type: "code",
        client_id: spotify_client_id,
        scope: scope,
        redirect_uri: user_redirect_uri,
        state: state
    });
    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
});
app.post(path.spotify_auth.auth + path.spotify_auth.token, async (req, res) => {
    const code = req.body.code ? req.body.code : "";
    let redirect_uri = req.query.redirect_uri + "";
    logger.log("info", `redirect uri from callback ${redirect_uri}`);
    var authOptions = {
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: new URLSearchParams({
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        }),
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        json: true
    };
    logger.log("info", "Now attempting to invoke spotify's token API uri");
    try {
        const response = await axios(authOptions);
        if (response.status === 200) {
            const token_created_in_seconds = Math.floor(Date.now() / 1000);
            logger.log("info", "Got response from calling spotify token api url");
            logger.log("info", `Created new cookie, token_created_in_seconds: ${token_created_in_seconds}`);
            const access_token = response.data.access_token;
            const expires_in = response.data.expires_in;
            logger.log("info", `token is : ${access_token}`);
            const use_cookie_secure = (process.env.ENV.toLowerCase() == 'prod') ? true : false;
            const cookieOptions = {
                httpOnly: true,
                secure: use_cookie_secure,
                sameSite: 'lax'
            };
            res.cookie('access_token', access_token, cookieOptions);
            res.cookie('expires_in', expires_in, cookieOptions);
            res.cookie('token_created_in_seconds', token_created_in_seconds, cookieOptions);
            return res.json({
                success: true,
                access_token: access_token,
                expires_in: expires_in,
                token_created_timestamp: token_created_in_seconds,
            });
        }
    }
    catch (error) {
        logger.log("error", `Error while getting token from spotify: ${error}`);
        res.send(error);
    }
});
app.get(path.spotify_auth.auth + path.spotify_auth.session_token, (req, res) => {
    const current_time_in_seconds = Math.floor(Date.now() / 1000);
    const access_token = req.cookies.access_token;
    const expires_in = req.cookies.expires_in;
    const token_created_in_seconds = req.cookies.token_created_in_seconds;
    logger.log("info", `Your access token from cookie: ${access_token}`);
    logger.log("info", `Expires in : ${expires_in}`);
    logger.log("info", `Your token created in timestamp seconds: ${token_created_in_seconds}`);
    if (access_token) {
        if (current_time_in_seconds - token_created_in_seconds >= expires_in) {
            logger.log("warn", "Token expired. Remove it");
            req.cookies.access_token = "";
            res.status(401).json({ error: 'No access token found' });
        }
        else {
            //Everything is good. Go ahead and send the cookie info
            res.json({ access_token: access_token, expires_in: expires_in });
        }
    }
    else {
        res.status(401).json({ error: 'No access token found' });
    }
});
export default app;
