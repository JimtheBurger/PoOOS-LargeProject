import React from 'react';

function LoginNavbar()
{
   return(
      <div className='navbar'>
         <div className="logo">
            <h2>MySteamList</h2>
         </div>
         <ul className="nav-menu">
            <li>Home</li>
            <li>About</li>
            <li>GitHub</li>
            <li>Login</li>
            <li>Sign-Up</li>
         </ul>
      </div>
   );
};

export default LoginNavbar;
