import React, { useState } from 'react';

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
                alert( "API Error:" + res.error );
            }
            else
            {
                alert('User has been added');
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }    
    };

    return(
      <div id="registerDiv">
        <form onSubmit={doRegister}>
        <span id="inner-title">REGISTER HERE</span><br />
        <input type="text" id="registerName" placeholder="Username" 
            ref={(c) => username = c} />
        <input type="password" id="registerPassword" placeholder="Password" 
            ref={(c) => password = c} />
        <input type="text" id="registerEmail" placeholder="Email" 
            ref={(c) => email = c} />
        <input type="text" id="registerDOB" placeholder="Date of Birth (xx/xx/xxxx)" 
            ref={(c) => dob = c} />
        <input type="submit" id="registerButton" class="buttons" value = "Do It"
          onClick={doRegister} />
        </form>
     </div>
    );
};

export default Register;