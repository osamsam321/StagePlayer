import {useState, useEffect } from "react";
import "./App.css"

const TrackSearchQuery = ({ track_search_query, token, limit, onClick, track_id }) => {
  let render_values;
  const [track_content, setTrackContent] = useState(null);

    // Use json_result directly
  useEffect(() => {
    //console.log("user query >  " + track_search_query);
    //console.log("token first " + token);

    getTrackSearchResults(track_search_query, token, limit, "v1")
      .then(result => {
        //let deezer_content = getDeezerTracks(result);
        //console.log("deezer content", JSON.stringify(result));
        let spotify_content = getSpotifyTracks(result);
        setTrackContent(spotify_content);
      })
      .catch(error => {
        console.log("error getting spotify tracks" + error);
      });

  }, [ track_search_query ]);


  return (
    <>
      {track_content && <DisplayTracks track_content={track_content} onClick={onClick}/>}
    </>
  );
}

function DisplayTracks({track_content, onClick}){
  //console.log("track content: " + JSON.stringify(track_content));
    return (
      <>
        <div className='title_cont flex-top-center text-align-center'>
          <h1>Relevant Tracks</h1>
        </div>
        <div id='top_charts_main_container' className='flex-for-top-charts_container search_result_and_hits_width'>
          {track_content.map((track) => (
            <div id='top_charts_child_container' className='flex-center text_center hover_effect pointer_cursor'
                  onClick={e => onClick(`${track.id}`)}>
              <a href={track.href} className="track_link" target="_blank" rel="noopener noreferrer">
                <img src={track.album_cover_big} alt={track.track_title} />
                <h5 id='song_title'>{track.track_title}</h5>
                <h6 id='artist_title'>{track.artist_name}</h6>
              </a>
            </div>
          ))}
        </div>
      </>
    );
  }

async function getTrackSearchResults(track_search_query, token, limit, version){

  const base_url = process.env.REACT_APP_SPOTIFY_BASE_URL;
  let json_result=[];
  //console.log("token boy " + token);
  //console.log("limit boy " + limit);

  try {
    // example https://api.spotify.com/v1/search?q=bark+at+the+moon&type=track&limit=15
    const url =`${base_url}/${version}/search?q=${track_search_query}&type=track&limit=${limit}`;
    const options = {
      method: "GET",
      headers: {
        //"User-Agent": "stage-player-audio/0.02",
        "Accept": "application/json",
        "Authorization":`Bearer ${token}`,
      }
    };

    let response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    json_result = await response.json();
  } catch (error){
      console.log(error);
  }

  return json_result;
}
async function spotify_top_chart(version, token){
  //https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF"
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

    //console.log("token is " + token);

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

//spotify configuration
function getDeezerTracks(json_data){

  const track_content = json_data.tracks.items.map((item) => ({
    id: item.id,
    artist_name: item.artist[0].name,
    album_cover_small: item.album.images[2],
    album_cover_big: item.album.images[0],
    track_title:item.name,
    link: item.artist.href,
  }));

  return track_content;
}
function getSpotifyTracks(json_data){

  //console.log("check yes: " + json_data.tracks.items[0].id);
  //console.log("first image is " + json_data.tracks.items[0].album.images[0]);

  const track_content = json_data.tracks.items.map((track) => ({
    id: track.id,
    artist_name: track.artists[0].name,
    album_cover_small: track.album.images[2].url,
    album_cover_big: track.album.images[0].url,
    track_title: track.name,
    link: track.href,
  }));
  return track_content;
}

export default TrackSearchQuery;
