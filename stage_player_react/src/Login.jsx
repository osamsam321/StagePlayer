      const BASE_URL_BACKEND = window.location.href.includes('localhost') ?
        "http://localhost:3000":
        "https://odisite";
      const BASE_URL_FRONTEND = window.location.href.includes('localhost') ?
        // use for development
        //"http://localhost:2800":
        "http://localhost/stage_player/index.html":
        "https://odisite/stage_player";

    const code = new URLSearchParams(window.location.search).get('code');
    let token = '';

    export default async function handle_login(){
      const token = await get_session_token();
      //console.log("token expires in " + token.expires_in);
      if(!token){
        if(!code){
          console.log("Tryna reach Spotify api...");
          window.location.href =`${BASE_URL_BACKEND}/api/auth/login?redirect_uri=${BASE_URL_FRONTEND}`;
        }else{
          const token_response = await get_token(code);
          if(token_response == null){
            console.log("Issue with getting token.Token response was null.");
          }else if(token_response.status == 200){
            const json = await token_response.json();
            console.log("json auth return " + JSON.stringify(json));
            let token = json.access_token;
          }else{
            console.log("Issue with getting token. Response was not 200.");
          }
        }
      }
        return token;
    }

    async function get_session_token(){
      let token;
      try{
        const response = await fetch(`${BASE_URL_BACKEND}/api/auth/session_token`, {
            credentials: 'include',  // Include cookies with the request      credentials: 'include',  // Include cookies with the request
        });
        if(response.status == 200){
          const json = await response.json();
          console.log("json return " + JSON.stringify(json));
          return json.access_token;
        }
        else {
          console.log("could not get token with status: " + response.status);
        }
      }
      catch(e){
        console.log("error with request: " + e);
      }
      return token;
    }

    async function get_token(code){
      let response = null;
      try{
        //please remove
        response = await fetch(`${BASE_URL_BACKEND}/api/auth/token?redirect_uri=${BASE_URL_FRONTEND}`, {
            credentials: 'include',  // Include cookies with the request      credentials: 'include',  // Include cookies with the request
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: code }),
        });
      } catch(e){
        console.log(e);
      }
      return response;
    }


