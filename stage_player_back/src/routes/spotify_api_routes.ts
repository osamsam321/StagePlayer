import { Router, Request, Response} from "express";
import path from "../constants/path.ts"
import fetch from "node-fetch";
import * as crypto from "crypto"
//import fetch from "node-fetch"
import { constants } from "buffer";
import {Issuer} from 'openid-client'
let api_router = Router();
let pb_router = Router();
let mbz_base_url = "https://musicbrainz.org/ws/2";
let spotify_base_url = "https://api.spotify.com";
let pb_path:string = path.playback.base;
import session from "express-session";
api_router.use(path.playback.base, pb_router);



api_router.get(path.metadata_spotify.info + path.metadata_spotify.search_track, async (req:Request, res:Response) => {

  let limit = 5;
  let keyword="";

  try{
    keyword = req.query.keyword.toString().trim();
    limit = parseInt(req.query.limit.toString());
  }catch(err){
    console.log("query value is incorrect");
  }

  console.log("keyword is",keyword);
  await search_spotify_track(keyword, limit, "v1", req.session.spotifyAccessToken)
    .then(result => {
       console.log("result is ", result);
       res.send(result);
    })
    .catch(error => {
       console.log("there was an error ", error);
    });
});

//api_router.get(path.metadata_spotify.info + path.metadata_spotify.fts + "/:keyword", async (req, res) => {
//
//  let keyword = req.params.keyword.trim();
//  let limit = 5;
//  console.log("keyword is",keyword);
//  await search_spotify(keyword, limit)
//    .then(result => {
//       console.log("result is ", result);
//       res.send(result);
//    })
//    .catch(error => {
//       console.log("there was an error ", error);
//    });
//});

api_router.get(path.metadata_spotify.info + path.metadata_spotify.top_charts_global_50, async (req, res) => {
  // https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF"
   let limit:number = Number(req.params.limit);
   let token = req.session.spotifyAccessToken;

   spotify_top_chart(limit, "v1", token)
    .then(result => {
        console.log("top charts result is ", result);
        res.json(result);
    })
    .catch(error => {
      console.log("there was an error");
      res.send("error");
    })
})


async function spotify_top_chart(limit: number, version: string, token:any){
  //https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF"
    const url = `${spotify_base_url}/v1/playlists/37i9dQZEVXbMDoHDwVN2tF`
    const options = {
      method: "GET",
      headers: {
        "User-Agent": "stage-player-audio/0.02",
        "Access-Control-Allow-Origin": "http://localhost:2800",
        "Accept": "application/json",
        "Authorization":`Bearer ${token}`,
      }
    };

    console.log("token is " + token);

    try{
      const req = await fetch(url, options);
      if(req.status == 200){
        const json_response = await req.json();
        return json_response;
      } else{
        console.log(`given the error ${req.status}`);
        console.log("req response " +  req.statusText);
      }
    }catch(error){
      throw new Error(error);
    }
}

async function search_spotify_track(keyword: string, limit: number, version: string, token: any, market='us'){
  console.log("the search count value: " + limit);
  //let accessToken = localStorage.getItem('access_token');
  const url = `${spotify_base_url}/${version}/search?q=${keyword}&type=track&limit=${limit}&market=${market}`;
  console.log("url to execute " + url);
  const options = {
    method: "GET",
    headers: {
        "User-Agent": "stage-player-audio/0.02",
        "Access-Control-Allow-Origin": "http://localhost:2800",
        "Accept": "application/json",
        "Authorization":`Bearer ${token}`,
    }
  };

  try{
    const req = await fetch(url, options);
      if(req.status == 200){
        const json_response = await req.json();
         return json_response;
      } else{
         throw new Error("request not 200 status we got: " + req.statusText);
      }

  }catch (error){
    console.error("issue with the musicbrainz request ", error);
  }
}

//async function search_by_track(keyword: string){
//  const limit = 5;
//  const url = mbz_base_url + `/recording?query=${keyword}&fmt=json&limit=${limit}`;
//  const options = {
//    method: "GET",
//    headers: {
//      "User-Agent": "stage-player-audio/0.02",
//      "Accept": "application/json"
//    }
//  };
//  try{
//    const req = await fetch(url, options);
//    if(req.status == 200){
//      const json_response = await req.json();
//      console.log("json track resonse ", json_response);
//      return json_response;
//    }else{
//      throw new Error("response");
//    }
//  }
//  catch (error){
//    console.error("issue with the musicbrainz request ", error);
//  }
//}
//async function search_by_release(keyword: string){
//  const limit = 5;
//  //https://api.spotify.com/search?q=megadeath
//  const url = spotify_base_url + `/release?query=release:${keyword}&fmt=json&limit=${limit}`;
//  const options = {
//    method: "GET",
//    headers: {
//      "User-Agent": "stage-player-audio/0.02",
//      "Accept": "application/json"
//    }
//  };
//  try{
//    const req = await fetch(url, options);
//    if(req.status == 200){
//      const json_response = await req.json();
//      console.log("url being used ", url);
//      console.log("json track resonse ", json_response);
//      return json_response;
//    }else{
//      throw new Error("response");
//    }
//  }
//  catch (error){
//    console.error("issue with the musicbrainz request ", error);
//  }
//}

async function parse_json_track(){

}




export default api_router;


