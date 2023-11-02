import React, { useState } from 'react';

function Login()
{
    var loginName;
    var loginPassword;

    const [message,setMessage] = useState('');

    const app_name = 'cop4331-g4-ed21fec8c26b'
    function buildPath(route)
    {
        if (process.env.NODE_ENV === 'production') 
        {
            return 'https://' + app_name +  '.herokuapp.com/' + route;
        }
        else
        {        
            return 'http://localhost:5000/' + route;
        }
    }    

    const doLogin = async event => 
    {
        event.preventDefault();

        var obj = {username:loginName.value, password:loginPassword.value};
        var js = JSON.stringify(obj);

        try
        {    
            const response = await fetch(buildPath('api/login'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());

            if( res.id <= 0 )
            {
                setMessage('User/Password combination incorrect');
            }
            else
            {
                var user = {firstName:res.firstName,lastName:res.lastName,id:res.id}
                localStorage.setItem('user_data', JSON.stringify(user));

                setMessage('');
                window.location.href = '/cards';
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }    
    };

    return(
      <div className="Login">
        <div className="content">
            <h1>Login in</h1>
            <form className="form">
                <div className="loginInput">
                    <input type="text" id="loginName" placeholder="Username" ref={(c) => loginName = c} />
                </div>
                <div className="loginInput">
                    <input type="password" id="loginPassword" placeholder="Password" ref={(c) => loginPassword = c} />
                </div>
                <button type="button" className="loginButton" onClick={doLogin}>Login in</button>
                <p id="loginResult"></p>
            </form>
        </div>
        <span id="loginResult">{message}</span>
     </div>
    );
};

export default Login;