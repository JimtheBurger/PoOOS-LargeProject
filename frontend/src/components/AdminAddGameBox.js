import React from 'react';

function AdminAddGameBox()
{
  var steamAppID;

  const app_name = 'cop4331-g4-ed21fec8c26b'
  function buildPath(route)
  {
      if (process.env.NODE_ENV === 'production') 
      {
          return 'https://' + app_name +  '.herokuapp.com/api/' + route;
      }
      else
      {        
          return 'http://localhost:5000/api/' + route;
      }
  }    

  const addGame = async event =>
  {
    event.preventDefault();

    var obj = {appid: steamAppID.value};
    var js = JSON.stringify(obj);

    try
    {
      const response = await fetch(buildPath('gamedetails'),
        {method:'POST', body:js, headers:{'Content-Type': 'application/json'}});

      var res = JSON.parse(await response.text());
      console.log(res);
    }
    catch (e)
    {
      console.log(e.toString())
    }
  }

  return(
    <div className='adminAddGame'>
      <form className='form'>
        <label>Add Game</label>
        <div className="appIdInput">
            <input type="text" id="appID" placeholder="AppID" ref={(c) => steamAppID = c} />
        </div>
        <button type="button" className="addGameButton" onClick={addGame}>Add Game</button>
      </form>
    </div>
  );
};

export default AdminAddGameBox;
