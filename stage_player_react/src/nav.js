import { Outlet, Link } from "react-router-dom";
import './App.css';

export default function nav(){
  return (
    <>
      <nav className="flex-center">
        <div className="flex-right cont-basic ">
          <div className="nav_right_group flex-center" >
            <img width="25" height="25" src="https://img.icons8.com/material-outlined/24/FEBF00/settings--v1.png" alt="settings--v1"/>
          </div>
        </div>
      </nav>
    </>
  );

}

 const loginWithSpotify = () => {
    window.location.href = 'http://localhost:3000/api/auth/login';
  };
