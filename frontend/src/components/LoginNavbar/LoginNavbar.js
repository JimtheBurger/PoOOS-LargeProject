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
      <div className='navbar'>
         <div className="logo">
            <h2>MySteamList</h2>
         </div>
         <ul className="nav-menu">
            <li>Home</li>
            <li>About</li>
            <li>GitHub</li>
            <li onClick={navigateLogin}>Login </li>
            <li onClick={navigateRegister}>Sign-Up </li>
         </ul>
      </div>
   );
};

export default LoginNavbar;
