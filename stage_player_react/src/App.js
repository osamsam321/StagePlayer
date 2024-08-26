import React, {useState, useEffect} from 'react';
import './App.css';
import StagePlayerHomepage from './stage_homepage';

function App() {

  const [token, setToken] = useState('');

  useEffect(() => {

    async function getToken() {
      try{
        const response = await fetch('http://localhost:3000/api/auth/token', {
            credentials: 'include',  // Include cookies with the request      credentials: 'include',  // Include cookies with the request
        });
        if(response.status == 200){
          const json = await response.json();
          setToken(json.access_token);
         // console.log("json auth return " + json.access_token);
        }
        else {
          setToken('');
          window.location.href = 'http://localhost:3000/api/auth/login';
        }
      }
      catch(e){
        setToken('');
        console.log(e);
        window.location.href = 'http://localhost:3000/api/auth/login';
      }
    }

    getToken();

  }, []);

  return (
    <>
      {(token === '' || token == undefined)? console.log("no token yet"): <StagePlayerHomepage token={token}/> }
    </>
  )

}

export default App;
