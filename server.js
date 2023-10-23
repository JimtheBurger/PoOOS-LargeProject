const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

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

app.post('/api/addGame', async(req, res, next) =>
{
  //  incoming: title, year, developer, publisher
  //  outgoing: error

  let error = '';

  const { title, year, developer, publisher } = req.body;
  const newGame = {Title:title, Year:year, Developer:developer, Publisher:publisher};

  try
  {
    const db = client.db('COP4331Cards');
    const doesGameAlreadyExist = await db.collection('Games').find({ Title: title }).toArray();
    if (doesGameAlreadyExist.length > 0)
    {
      error = `There already exists a game with the title '${title}'`;
    }
    else
    {
      const result = db.collection('Games').insertOne(newGame);
    }
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = { error: error };
  res.status(200).json(ret);
});

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