import React, {useState, useEffect} from 'react';
import './App.css';
import StagePlayerHomepage from './stage_homepage';
import handle_login from './Login';

function App() {

  const [token, setToken] = useState('');
  const [token_expires_in, setTokenExpiresIn] = useState('');

  useEffect(() => {

    async function login(){
      const token_received = await handle_login();
      //do not reset the token to empty or null if it is already set from another request
      if (token_received) {
        setToken(token_received);
      }
    }

    login();

  }, []);

  return (
    <>
      {(token === '' || token == undefined)? console.log("no access token yet"): <StagePlayerHomepage token={token}/> }
    </>
  )

}

export default App;
