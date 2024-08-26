import { Router } from "express";
import path from "../constants/path.ts"
import fetch from "node-fetch";
import * as crypto from "crypto"
//import fetch from "node-fetch"
import { constants } from "buffer";
import {Issuer} from 'openid-client'
let api_router = Router();
let pb_router = Router();
let mbz_base_url = "https://musicbrainz.org/ws/2";
let deezer_base_url = "https://api.deezer.com";
let pb_path:string = path.playback.base;
//test
api_router.use(path.playback.base, pb_router);


api_router.get(path.metadata_deezer.info + path.metadata_deezer.fts, async (req, res) => {

  let limit = 5;
  let keyword="";

  try{
    keyword = req.query.keyword.toString().trim();
    limit = parseInt(req.query.limit.toString());
  }catch(err){
    console.log("query value is incorrect");
  }

  console.log("keyword is",keyword);
  await search_deezer(keyword, limit )
    .then(result => {
       console.log("result is ", result);
       res.send(result);
    })
    .catch(error => {
       console.log("there was an error ", error);
    });
});

api_router.get(path.metadata_deezer.info + path.metadata_deezer.fts + "/:keyword", async (req, res) => {

  let keyword = req.params.keyword.trim();
  let limit = 5;
  console.log("keyword is",keyword);
  await search_deezer(keyword, limit)
    .then(result => {
       console.log("result is ", result);
       res.send(result);
    })
    .catch(error => {
       console.log("there was an error ", error);
    });
});

api_router.get(path.metadata_deezer.info + path.metadata_deezer.top_charts + "/:limit", async (req, res) => {
   console.log("hit top charts middleware succesfully");
   let limit:number = Number(req.params.limit);
   deezer_top_chart(limit)
    .then(result => {
        console.log("top charts result is ", result);
        res.json(result);
    })
    .catch(error => {
      console.log("there was an error ", error);
      res.send("nothing to see");
    })
})


async function deezer_top_chart(limit: number){
    const url = `${deezer_base_url}/chart&limit=${limit}`;
    const options = {
      method: "GET",
      header: {
        "User-Agent": "stage-player-audio/0.02",
        "Accept": "application/json"
      }
    };

    try{
      const req = await fetch(url, options);
      if(req.status == 200){
        const json_response = await req.json();
        return json_response;
      } else{
        throw new Error("request not 200 status");
      }
    }catch(error){
      throw new Error(error);
    }
}

async function search_deezer(keyword: string, limit: number){
  console.log("the search count value: " + limit);
  const url = `${deezer_base_url}/search/?q=${keyword}&output=json&limit=${limit}`;
  const options = {
    method: "GET",
    headers: {
      "User-Agent": "stage-player-audio/0.02",
      "Accept": "application/json"
    }
  };

  try{
    const req = await fetch(url, options);
      if(req.status == 200){
        const json_response = await req.json();
         return json_response;
      } else{
         throw new Error("request not 200 status");
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
//  //https://api.deezer.com/search?q=megadeath
//  const url = deezer_base_url + `/release?query=release:${keyword}&fmt=json&limit=${limit}`;
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

