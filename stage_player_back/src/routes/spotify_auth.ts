import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Router } from "express";
import path from "../constants/path.js";
import axios from "axios";
import request from 'request';
import cookieParser from 'cookie-parser';

global.access_token = ''

dotenv.config()
let app = Router();
app.use(cors({
  origin: ['http://localhost:80', 'http://localhost:2800',], // Replace with your client app URL
  credentials: true, // Enable credentials to allow cookies, authorization headers, etc.
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Specify allowed headers
}));
app.use(cookieParser());  // <-- Ensure this line is included

let auth_router = Router();
app.use(path.spotify_auth.base, auth_router);
let spotify_client_id = process.env.SPOTIFY_CLIENT_ID
let spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET
let spotify_redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

let generateRandomString = function (length:any) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app.get(path.spotify_auth.auth + path.spotify_auth.refresh_token, function(req:any, res:any):void {

  var refresh_token = req.query.refresh_token;
  console.log("this is the refresh_token " + refresh_token);
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64'))
    },
    data: new URLSearchParams ( {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    }),

    json: true
  }

  axios(authOptions)
  .then(response => {
    if (response.status === 200) {
      const access_token = response.data.access_token;
      const refresh_token = response.data.refresh_token;
      console.log("new access token is " + access_token);
      res.send({
        'access_token': access_token,
        'refresh_token': refresh_token
      });
    }
  })
  .catch(error => {
    console.error('Error during the request:', error);
  });
});

//app.get(path.spotify_auth.auth + path.spotify_auth.login, (req, res) => {
//
//  console.log("reached login path");
//  let scope = "streaming user-read-email user-read-private"
//  let state = generateRandomString(16);
//
//  let auth_query_parameters = new URLSearchParams({
//    response_type: "code",
//    client_id: spotify_client_id,
//    scope: scope,
//    redirect_uri: spotify_redirect_uri,
//    state: state
//  })
//  res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
//})
app.get(path.spotify_auth.auth + path.spotify_auth.login, (req, res) => {

  console.log("reached login path");
  let scope = "streaming user-read-email user-read-private"
  let state = generateRandomString(16);
  let user_redirect_uri:string=req.query.redirect_uri + "";

  let auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: user_redirect_uri,
    state: state
  })
  res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
})

app.post(path.spotify_auth.auth + path.spotify_auth.token, async (req, res) => {
  const code:string=req.body.code? req.body.code: "";
  let redirect_uri:string =req.query.redirect_uri + "";
  console.log("redirect uri from callback " + redirect_uri);

  var authOptions:any = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: new URLSearchParams ( {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    }),

    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    json: true
  };

  console.log("calling api token");
  try {
    const response = await axios(authOptions);
    if (response.status === 200) {
      const token_created_in_seconds = Math.floor(Date.now() / 1000);
      console.log("got response");
      console.log("got response");
      const access_token = response.data.access_token;
      //const refresh_token= response.data.refresh_token;
      const expires_in = response.data.expires_in;
      console.log("token is " + access_token);
      // change for prod
       const cookieOptions: express.CookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'lax'
      };
      // ** get timestamp and set as cookie to check expiration


      // Explicitly specify the type of the parameters to avoid any confusion
      res.cookie('access_token', access_token, cookieOptions);
      res.cookie('expires_in', expires_in, cookieOptions);
      res.cookie('token_created_timestamp_seconds',token_created_in_seconds, cookieOptions);
      //console.log("Cookies after setting access token:", req.cookies.access_token);  // Debugging: Check the cookies
      return res.json({
            success: true,
            access_token: access_token,
            expires_in: expires_in,
            token_created_timestamp: token_created_in_seconds,
        });
    }
  } catch (error) {
    console.error('Error while getting token from Spotify:', error);
    res.send(error);
  }

});

//app.get(path.spotify_auth.auth + path.spotify_auth.callback, async (req, res) => {
//
//  let code:any = req.query.code;
//
//  var authOptions:any = {
//    method: 'post',
//    url: 'https://accounts.spotify.com/api/token',
//    data: new URLSearchParams ( {
//      code: code,
//      redirect_uri: spotify_redirect_uri,
//      grant_type: 'authorization_code'
//    }),
//
//    headers: {
//      'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
//      'Content-Type' : 'application/x-www-form-urlencoded'
//    },
//    json: true
//  };
//
//  console.log("calling api token");
//  try {
//    const response = await axios(authOptions);
//    if (response.status === 200) {
//      console.log("got response");
//      const access_token = response.data.access_token;
//      const refresh_token= response.data.refresh_token;
//      console.log("token is " + access_token);
//      // change for prod
//       const cookieOptions: express.CookieOptions = {
//        httpOnly: true,
//        secure: false,
//        sameSite: 'lax'
//      };
//
//      // Explicitly specify the type of the parameters to avoid any confusion
//      res.cookie('access_token', access_token, cookieOptions);
//      //console.log("Cookies after setting access token:", req.cookies.access_token);  // Debugging: Check the cookies
//      return res.json({
//            success: true,
//            access_token: access_token,
//            refresh_token: refresh_token
//        });
//    }
//  } catch (error) {
//    console.error('Error while getting token from Spotify:', error);
//    res.send(error);
//  }
//
//});

app.get(path.spotify_auth.auth + path.spotify_auth.session_token, (req, res) => {
  const current_time_in_seconds = Math.floor(Date.now() / 1000);
  const access_token = req.cookies.access_token;
  const expires_in = req.cookies.expires_in;
  const token_created_in_seconds = req.cookies.token_created_in_seconds;

  console.log("your access token:", access_token);

  if (access_token) {
    if(current_time_in_seconds - token_created_in_seconds >= expires_in){
      req.cookies.access_token = "";
      res.status(401).json({ error: 'No access token found' });
    } else{
      //Everything is good. Go ahead and send the cookie info
      res.json({ access_token: access_token, expires_in: expires_in });
    }
  } else {
    res.status(401).json({ error: 'No access token found' });
  }
});

export default app;
