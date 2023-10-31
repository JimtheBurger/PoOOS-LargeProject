import React from 'react';

import './LoginNavbarStyles.css'
import {useNavigate} from 'react-router-dom';

function LoginNavbar()
{
   const navigate = useNavigate();

   const navigateLogin = () => {
       navigate('/');
   }
   const navigateRegister = () => {
       navigate('/register');
   }
   return(
    <div className="nav">
      <div className="nav-text">
        <div className="my-steam-list">Mysteamlist</div>
        <div className="text-wrapper">about</div>
        <div className="div">browse</div>
        <div className="text-wrapper-2" onClick={navigateRegister}>sign up</div>
        <div className="text-wrapper-3" onClick={navigateLogin}>login</div>
        <div className="nav-icons">
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z"></path></svg>
        </div>
      </div>
    </div>
      
   );
};

export default LoginNavbar;
