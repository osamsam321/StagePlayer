import './hits_box.css'
export default function HitsBox({artist_img_url, song_name, artist_name}){
  return (
    <>
     <div class="artist-box">
          <img src={artist_img_url} alt="Artist Picture" class="artist-image"/>
          <div class="info">
              <p class="song-name">{song_name}</p>
              <p class="artist-name">{artist_name}</p>
          </div>
      </div>
    </>
  );
}
