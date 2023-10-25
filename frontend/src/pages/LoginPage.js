import React from 'react';

import LoginNavbar from '../components/LoginNavbar/loginNavbar';
import Login from '../components/Login';
import Register from '../components/Register';

const LoginPage = () =>
{

    return(
      <div>
        <LoginNavbar />
        <Login />
        <Register />
      </div>
    );
};

export default LoginPage;
