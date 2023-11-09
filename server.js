const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const path = require("path");

require('dotenv').config();
const url = process.env.MONGODB_URI;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
client.connect();
         
const PORT = process.env.PORT || 5000;

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => 
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

///////////////////////////////////////////////////
// For Heroku deployment

// Server static assets if in production
if (process.env.NODE_ENV === 'production') 
{
  // Set static folder
  app.use(express.static('frontend/build'));

  app.get('*', (req, res) => 
 {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

app.post('/api/login', async (req, res, next) => 
{
  // incoming: login, password
  // outgoing: id, firstName, lastName, error
	
 var error = '';

  const { username, password } = req.body;

  const db = client.db('COP4331Cards');
  const results = await db.collection('Users').find({Username:username,Password:password}).toArray();

  var id = -1;
  var fn = '';
  var ln = '';

  if( results.length > 0 )
  {
    id = results[0].UserId;
    fn = results[0].FirstName;
    ln = results[0].LastName;
  }

  var ret = { id:id, firstName:fn, lastName:ln, error:''};
  res.status(200).json(ret);
});

app.post('/api/register', async(req, res, next) =>
{
  //  incoming: username, password, email, dob
  //  outgoing: error

  var error = '';

  const { username, password, email, dob } = req.body;
  const newUser = {Username:username, Password:password, Email:email, DateOfBirth:dob};

  try
  {
    const db = client.db('COP4331Cards');
    const result = db.collection('Users').insertOne(newUser);
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = { error: error };
  res.status(200).json(ret);
});

// hijack steam's api to get information for a game based on its appid
// (this is just a wrapper for steam's api for now)
app.post("/api/gameDetails", async (req, res, next) => {
    // TODO: figure out a way to find an appid based on game title
    // here are some sample appid's for testing:
    // terraria:  105600
    // celeste:   504230
    // cyberpunk: 1091500

    const { appid } = req.body;
    const steam_api_url = `https://store.steampowered.com/api/appdetails?appids=${appid}`;
    axios
        .get(steam_api_url, {
            "Accept-Language": "en-US",
        })
        .then((appinfo) => {
            res.status(200).json(appinfo.data[appid]);
        })
        .catch((err) => {
            console.log("Error: ", err.message);
        });
});


//gets the json from the steam web api and adds the games into the 'Games' collection
app.post("/api/getSteamGames", async (req, res, next) =>
{
  // outgoing: games

  let error = '';
  let result;

  try
  {
    const db = client.db('COP4331Cards');
    const api_url = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/';

    axios.get(api_url)
      .then(response => {
        result = response;
      })
      .catch(error =>{
        console.log(error);
      })
  }
  catch(e)
  {
    error = e.toString()
  }

  const ret = { result: result, error: error };
  res.status(200).json(ret);
});

app.post('/api/addGameToList', async(req, res, next) =>
{
  //  incoming: userId, appId, listId (optional - if listId is omitted, create a new list)
  //  outgoing: error

  const { userId, appId, listId } = req.body;

  let error = '';
  let newList;

  try
  {
    const db = client.db('COP4331Cards');

    if (listId) {
      newList = { UserId: userId, ListId: "" + listId, AppId: appId };
    } else {

      // find the next available listId (this is terrible💀💀💀)
      const cursor = db.collection('Lists').find().sort({ ListId: -1 })
      let maxListId;
      for await (const doc of cursor) {
        maxListId = doc.ListId;
        break;
      }

      newList = { UserId: userId, ListId: "" + (parseInt(maxListId) + 1), AppId: appId };
    }

    const result = db.collection('Lists').insertOne(newList);
  }
  catch(e)
  {
    error = e.toString();
  }

  const ret = { error: error };
  res.status(200).json(ret);
});

app.post('/api/getListById', async(req, res, next) =>
{
  //  incoming: listId
  //  outgoing: error, lists

  const { listId } = req.body;

  let error = '';

  try {
    const db = client.db('COP4331Cards');
    const results = await db.collection('Lists').find({ "ListId": listId }).toArray();
    
    var _ret = [];
    for (var i = 0; i < results.length; i++) {
      _ret.push(results[i]);
    }
  } catch (e) {
    error = e;
  }
  
  var ret = {results:_ret, error:error};
  res.status(200).json(ret);
});

app.post('/api/getListsByUserId', async(req, res, next) =>
{
  //  incoming: userId
  //  outgoing: error, lists

  const { userId } = req.body;

  let error = '';

  try {
    const db = client.db('COP4331Cards');
    const results = await db.collection('Lists').find({ "UserId": userId } ).toArray();
    
    var _ret = [];
    for( var i=0; i<results.length; i++ )
    {
      _ret.push( results[i] );
    }
  } catch (e) {
    error = e;
  }
  var ret = {results:_ret, error:error};
  res.status(200).json(ret);
});

/*
app.post('/api/searchcards', async (req, res, next) => 
{
  // incoming: userId, search
  // outgoing: results[], error

  var error = '';

  const { userId, search } = req.body;

  var _search = search.trim();
  
  const db = client.db('COP4331Cards');
  const results = await db.collection('Cards').find({"Card":{$regex:_search+'.*', $options:'i'}}).toArray();
  
  var _ret = [];
  for( var i=0; i<results.length; i++ )
  {
    _ret.push( results[i].Card );
  }
  
  var ret = {results:_ret, error:error};
  res.status(200).json(ret);
});
*/

const server = app.listen(PORT, () =>
{
  console.log("Server listening on port " + PORT);
});

module.exports = server; // allow testing script to access the server