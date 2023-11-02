import React, { useState } from 'react';
import "./register.css";

function Register()
{
    var username;
    var password;
    var email;
    var dob;

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

    const [message, setMessage] = useState('');

    const doRegister = async event => 
    {
        event.preventDefault();

        var obj = {username:username.value, password:password.value, email:email.value, dob:dob.value};
        var js = JSON.stringify(obj);

        try
        {    
            const response = await fetch(buildPath('api/register'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());

            if( res.error.length > 0 )
            {
                setMessage("API Error:" + res.error);
            }
            else
            {
                setMessage('User has been added');
            }
        }
        catch(e)
        {
            setMessage(e.toString());
            return;
        }    
    };



    return(
        <div className="Register">
            <div className="content">
                <h1>Sign Up</h1>
                <form className="form">
                    <label>Username</label><br/>
                    <div className="registerInput">
                        <input type="text" id="registerName" placeholder="Username" ref={(c) => username = c} />
                    </div>
                    <label>Password</label><br/>
                    <div className="registerInput">
                        <input type="password" id="registerPassword" placeholder="Password" ref={(c) => password = c} />
                    </div>
                    <label>Email</label><br/>
                    <div className="registerInput">
                        <input type="text" id="registerEmail" placeholder="Email" ref={(c) => email = c} />
                    </div>
                    <label>Date of Birth</label><br/>
                    <div className="registerInput">
                        <input type="text" id="registerDOB" placeholder="Date of Birth (xx/xx/xxxx)" ref={(c) => dob = c} />
                    </div>
                    <button type="button" className="registerButton" onClick={doRegister}>Sign Up</button>
                    <p>{message}</p>
                </form>
            </div>
        </div>
    );
};

export default Register;