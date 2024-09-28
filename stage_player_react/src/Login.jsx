
    const BASE_URL_BACKEND=process.env.REACT_APP_SP_API_BASE_URL;
    const BASE_URL_FRONTEND=process.env.REACT_APP_SP_FRONT_BASE_URL;
    const code = new URLSearchParams(window.location.search).get('code');

    export default async function handle_login(){
      let token = await get_session_token();
      if(!token){
        if(!code){
          console.log("Tryna reach Spotify api...");
          window.location.href =`${BASE_URL_BACKEND}/api/auth/login?redirect_uri=${BASE_URL_FRONTEND}`;
        }else{ //got auth code now get token
          const token_response = await get_token(code);
          if(token_response == null){
            console.log("Issue with getting token.Token response was null.");
          }else if(token_response.status == 200){
            const json = await token_response.json();
            console.log("json auth return " + JSON.stringify(json));
            token = json.access_token;
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


