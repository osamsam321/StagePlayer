
import {useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import "./App.css";
import SpotifyPlayer from 'react-spotify-web-playback';

//<iframe src="https://open.spotify.com/embed/track/57fqmDaokbxZ3TaB0jp39q?utm_source=generator"

//const playback = (props) => {
//
//    return (
//        <>
//            <div id="spotify_playback_ui">
//                <iframe src={props.track_uri}
//                    width={props.width}
//                    height={props.height}
//                    allowfullscreen=""
//                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
//                    frameBorder='0'
//                    theme="0"
//                    loading="lazy">
//                </iframe>
//            </div>
//        </>
//    )
//
//}


//const SpotifyEmbededPlayback = ({ track_id, embeded_height, embeded_width }) => {
//  //const [spotify_track_id] = useState(track_id);
//
//  useEffect(() => {
//    console.log("Initializing Spotify Embed with track id: " + track_id);
//    console.log("Spotify playback height: " + embeded_height);
//    console.log("Spotify playback width: " + embeded_width);
//
//    const handleSpotifyAPIReady = (IFrameAPI) => {
//      console.log(`Spotify API is ready`);
//      const element = document.getElementById('spotify_playback_ui');
//        let tmp_uri = null;
//      if(track_id){
//        tmp_uri=`spotify:track:${track_id}`;
//      }
//
//      const options = {
//        width: embeded_width,
//        height: embeded_height,
//        uri: tmp_uri
//      };
//      const callback = (EmbedController) => {
//        if (tmp_uri) {
//          EmbedController.loadUri(`spotify:track:${track_id}`);
//          console.log(`Loaded Spotify track: spotify:track:${track_id}`);
//        } else {
//          EmbedController.loadUri(`spotify:track:1QEEqeFIZktqIpPI4jSVSF`);
//        }
//      };
//
//      try {
//        IFrameAPI.createController(element, options, callback);
//      } catch (e) {
//        console.error("Could not load controller for Spotify embed", e);
//      }
//    };
//
//    window.onSpotifyIframeApiReady = handleSpotifyAPIReady;
//
//    return () => {
//      window.onSpotifyIframeApiReady = null;
//    };
//  }, [track_id, embeded_height, embeded_width ]);
//
//  return (
//    <>
//      <Helmet>
//        <script src="https://open.spotify.com/embed/iframe-api/v1" async></script>
//      </Helmet>
//      <div id="spotify_playback_ui"></div>
//    </>
//  );
//};



//export default SpotifyEmbededPlayback;



