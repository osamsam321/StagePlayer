import Nav from './nav';
import HitsBox from './hits_box';
import './App.css'
import React, { useState, useEffect } from 'react';
import { Vortex, Audio, Bars, LineWave, ColorRing} from 'react-loader-spinner';
import { render } from '@testing-library/react';
import TrackSearchQuery from './search_track'
import assert from 'assert'
import SpotifyEmbededPlayback from './SpotifyEmbededPlayback';
import RenderTopCharts from './RenderTopCharts';
import SpotifyPlayer from 'react-spotify-web-playback';
//import { Helmet } from "react-helmet"
const base_url = process.env.REACT_APP_SP_API_BASE_URL;
let track_uri_on_playback="";

const search_top_charts_api = async (token) => {

    //let hits_api = base_url + "/api/info/top_charts/21";
    let json_response= await spotify_top_chart('v1', token)
      .then(data => {
        //console.log("data json val: " + data);
        return data;
      })
      .catch(err => {
        console.log("there was an error with the fetch + " + err);
      })
    return json_response;
}

function renderLoad()
{
  return (<h1> loading </h1>);
}


export default function StagePlayerHomepage(props){
const [loading, setLoading] = useState(true);
const [hits_data, setHitsData] = useState(null);
const [track_search_query, setTrackSearchQuery] = useState(null);
const [init, setInit] = useState(true);
const [no_search_results, setNoSearchResults] = useState(true);
const [track_id, setTrackId] = useState(null);

const update_track_id = (track_id) => {
  //console.log("switching track id to " + track_id);
  setTrackId(`spotify:track:${track_id}`);
}

//console.log("value of token " + props.token);
let json_response = "";
  const search_bar_input=(query_val) =>{
    if(query_val.trim().length > 0){
      setNoSearchResults(false);
      setTrackSearchQuery(query_val);
    }
    else{
      setNoSearchResults(true)
    }
    setInit(false);
  }

    useEffect(() => {
      if(init && props.token){
        search_top_charts_api(props.token)
          .then(result => {
           // console.log("json response is ", result);
            setHitsData(result);
            setLoading(false);
          })
          .catch(error => {
            console.log(error);
          });
      }

    },[]);


  return(
    <>
      <Nav/>
      <section id="search">
          <div className="search-container">
           <a className='cont_size_smallest' href='http://localhost:2800'> <img  height="35" className='pointer_cursor'  src="https://img.icons8.com/ios/50/home--v1.png" alt="home--v1"/> </a>
            <input className="search-bk-color" type="text" placeholder="Search..." onChange={e=> search_bar_input(e.target.value)} />
            <button type="submit">Search Track</button>
          </div>

    {/*TODO ADD FEATURE TO SEARCH BY ARTIST OR WHATEVER
          <div className='search_option_toggle_container flex-center'>
             <input type="radio" className='search_option_toggle pointer_cursor' value="all"   name="search_select_option" id='all_search_option' />
                <label for="all_search_option"> All </label>
             <input type="radio" className='search_option_toggle pointer_cursor' value="artist"name="search_select_option" id='artist_search_option' />
                <label for="artist_search_option">Artist</label>
             <input type="radio" className='search_option_toggle pointer_cursor' value="track" name="search_select_option" id='track_search_option' />
                <label for="track_search_option">Track</label>
             <input type="radio" className='search_option_toggle pointer_cursor' value="album" name="search_select_option" id='album_search_option' />
                <label for="album_search_option">Album</label>
             <input type="radio" className='search_option_toggle pointer_cursor' value="other" name="search_select_option" id='other_search_option' />
                <label for="other_search_option">Other</label>
           </div>
    */}


      </section>

      <section id="search_result_and_hits">
         <div id='search_and_result_main_container' className='flex-top-center-column-orientation'>
            {!loading && no_search_results && init && <RenderTopCharts json_data={hits_data} onClick={update_track_id} track_id={track_id} />}

             {no_search_results && !init && <div className='cont-basic flex-center'> <h1 className='text-align-center'> There are no Results </h1> </div>}
            {track_search_query && !no_search_results && <TrackSearchQuery track_search_query={track_search_query} token={props.token}  limit="8" onClick={update_track_id} track_id={track_id}  />}

             {loading &&
                 <div className='cont-basic flex-center'>
                 <ColorRing
  visible={true}
  height="300"
  width="300"
  ariaLabel="color-ring-loading"
  wrapperStyle={{}}
  wrapperClass="color-ring-wrapper"
  colors={['#22aacc','#22aacc','#22aacc','#22aacc','#22aacc','#22aacc']}
  />

                 </div>
             }


        </div>

       </section>

      <section id="audio_playback_ui">

    <div id='spotify_playback_ui'>
    {!loading && <SpotifyPlayer
                            token={props.token}
                            uris={[track_id]}
                            play={true}
                            autoPlay={true}
                            magnifySliderOnHover={true}
initialVolume={true}
                            styles={{
                              activeColor: '#fff',
                              sliderHeight:6,
                              bgColor: '#333',
                              color: '#fff',
                              loaderColor: '#fff',
                              sliderColor: '#1cb954',
                              trackArtistColor: '#ccc',
                              trackNameColor: '#fff',
                              width: '100%',

                          }} /> }
    </div>
      </section>

    </>
  );
}

function delay_milli(delay ) {
    return new Promise( res => setTimeout(res, delay) );
}

async function start_search_delay(){
   let result= await delay_milli(2000)
  return result;
}

async function spotify_top_chart(version, token){
    //console.log("token before sending " + token);
    const spotify_base_url='https://api.spotify.com';
    const url = `${spotify_base_url}/${version}/playlists/37i9dQZEVXbMDoHDwVN2tF`;
    const options = {
      method: "GET",
      headers: {
        //"User-Agent": "stage-player-audio/0.02",
        "Accept": "application/json",
        "Authorization":`Bearer ${token}`,
      }
    };

    try{
      const req = await fetch(url, options);
      if(req.status == 200){
        const json_response = await req.json();
        return json_response;
      }else if(req.status == 401){
       // console.log("going to refresh token");
        window.location.href = 'http://localhost:3000/api/auth/login';
      }else{
        console.log(`given the error ${req.status}`);
        console.log("req response " +  req.statusText);
      }
    }catch(error){
      throw new Error(error);
    }
}
