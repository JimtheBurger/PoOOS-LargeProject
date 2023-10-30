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
      </div>
    </div>
      
   );
};

export default LoginNavbar;
