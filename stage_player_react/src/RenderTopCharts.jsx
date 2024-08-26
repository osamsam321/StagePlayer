import {useState, useEffect } from "react";
import "./App.css"

const RenderTopCharts = ({json_data, onClick, track_id}) => {
  // Log the entire json_data to understand its structure
  //console.log("json_data:", json_data);

  // Check if json_data.tracks.data exists and is an array
 if (!json_data || !json_data.tracks.items || !Array.isArray(json_data.tracks.items)) {
    console.error("Invalid json_data structure:", json_data);
    return null;
 }

  const trackdata_list = json_data.tracks.items;

  // Log the first item in trackdata_list to check its structure
  //console.log("First item in trackdata_list:", trackdata_list[0]);
  const track_contents = json_data.tracks.items.map((data) => ({
    id: data.track.id,
    artist_name: data.track.artists[0].name,
    // images [2] is the biggest available image
    album_cover_small: data.track.album.images[2].url,
    // images [0] is the smallest available image
    album_cover_big: data.track.album.images[0].url,
    track_title:data.track.name,
    link: data.track.href,
  }));

   return (
    <>
      <div className='title_cont flex-top-center text-align-center '  >
          <h1>Top Tracks</h1>
      </div>
      <div id='top_charts_main_container' className='flex-for-top-charts_container search_result_and_hits_width' >
        {track_contents.map((track_content) => (
          <div id='top_charts_child_container' className='flex-center text_center hover_effect pointer_cursor'
                onClick={ e => onClick(`${track_content.id}`)}>
            <div>
              <img src={track_content.album_cover_big}  />
              <h5 id='song_title'>{track_content.track_title}</h5>
              <h6 id='artist_title'>{track_content.artist_name}</h6>
            </div>
          </div>
        ))}
      </div>
    </>
  );

}


export default RenderTopCharts
