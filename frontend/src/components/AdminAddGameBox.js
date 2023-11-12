import React from 'react';

function AdminAddGameBox()
{
  var steamAppID;

  return(
    <div className='adminAddGame'>
      <h1>Add Game</h1>
      <form className='form'>
        <label>AppID</label>
        <div className="appIdInput">
            <input type="text" id="appID" placeholder="AppID" ref={(c) => steamAppID = c} />
        </div>
      </form>
    </div>
  );
};

export default AdminAddGameBox;
