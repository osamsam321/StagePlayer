import { Router } from "express";
import path from "../constants/path.ts"
import * as crypto from "crypto"
//import fetch from "node-fetch"
import { constants } from "buffer";
import {Issuer} from 'openid-client'
let api_router = Router();
let pb_router = Router();
let mrouter = Router();
let client_id ="8bbc0a07679543e68305a13dda74ba1d";
let client_secret="b923ae89b05a421ab8b5fa2ea885e070";
//const params = new URLSearchParams(window.location.search);
//const param
let google_clientid = '553052473389-emtf105p4cg34gcpokq8bcjomhb2jbjt.apps.googleusercontent.com';
let google_client_secret='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';
let test_bearer = ""

// auth section
async function auth(){
//  const google_issuer = await Issuer.discover('https://accounts.google.com');
 // console.log("Discovered issuer %s %0", google_issuer.issuer, google_issuer.metadata);
//  const google_client = google_issuer.Client({
//    client_id: google_clientid,
//    client_secret: google_client_secret,
//    redirect_uris: ['http//localhost:3000/'],
//    response_types: ['code'],

 // });
}

 // mrouter.get("/test", function(req,res){
 //     res.send("hello");
 //     console.log('test');
 // })

let pb_path:string = path.playback.base;

api_router.get(path.playback.stop + path.playback.stop, function(req, res){
  res.send("get");
});

api_router.get("/home", function(req, res){
    res.send("home cuz");
});

api_router.get("/test_spotify_auth", function(req,res){
  //res.send("test");
  const code:any =  req.headers['code'];
  console.log("is their code " + code);
  test_spotify(code);
  const params = new URLSearchParams();
   // params.append("code_challenge_method", "S256");
  //  params.append("code_challenge", challenge);
    params.append("client_id", client_id);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:3000/api/home");
    params.append("scope", "user-read-private user-read-email");
    let url = `https://accounts.spotify.com/authorize?${params.toString()}`;
      console.log("redirecting to the url: " + url);
      res.redirect(url);
})


api_router.use(path.playback.base, pb_router);


// spotify code

async function test_spotify(code: any){
  //set code to true for test
  if (!code) {

      spotify_auth_redirect();
  } else {
      //const accessToken = await get_access_token(code);
      //const profile:UserProfile = await fetchProfile(accessToken);
      //console.log("profile content " + profile);
  }
}

async function spotify_auth_redirect(){
  //TODO! Set the code challange
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

    //document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length: number) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
async function generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await crypto.webcrypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}
async function get_access_token(code: string){
  //const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
    params.append("client_id", client_id);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:3000/api/home");
    //params.append("code_verifier", verifier!);
    const result  = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });
    console.log("token info " + result);

    const access_token = await result.json();
    return access_token;

}
//async function fetchProfile(code: string): Promise<UserProfile> {
//    const result: UserProfile = await fetch("https://api.spotify.com/v1/me", {
//        method: "GET", headers: { Authorization: `Bearer ${code}` }
//    });
//
//    return await result.json();
//}
interface UserProfile {
    country: string;
    display_name: string;
    email: string;
    explicit_content: {
        filter_enabled: boolean,
        filter_locked: boolean
    },
    external_urls: { spotify: string; };
    followers: { href: string; total: number; };
    href: string;
    id: string;
    product: string;
    type: string;
    uri: string;
}
export default api_router;
