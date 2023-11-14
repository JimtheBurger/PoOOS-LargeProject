//Requires
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

//Environment Variables
require("dotenv").config();

//MongoDB Connection -> client
const url = process.env.MONGODB_URI;
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(url);
client.connect();

//Set PORT and create the backend express app with it
const PORT = process.env.PORT || 5000;
const app = express();
app.set("port", process.env.PORT || 5000);

var origin = "";
if (process.env.NODE_ENV == "production") {
  origin = "https://mysteamlist.com";
} else {
  origin = "http://localhost:3000";
}

console.log(origin);

//Set Headers (allow CORS)
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

//Sendgrid Setup / Use
const sgMail = require("@sendgrid/mail");
const { jwtAuth } = require("./frontend/src/middleware/jwtAuth");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//msg layout & container function (basic)
//Takes four strings:
// 1. recipient email address (email)
// 2. recipient username (username)
// 3. verify email url (url)
// 4. template ("verify" or "reset")
function sendMessage(email, username, url, template) {
  let temp = "";
  if (template === "verify") {
    // Verify Email template
    temp = "d-f04e66086dad40118c9ba32069e11955";
  } else {
    // Reset Password template
    temp = "d-aee9e3ad26f14b748e2d916e011de573";
  }
  const msg = {
    to: email,
    from: "MySteamList.Verify@gmail.com",
    templateId: temp,
    dynamicTemplateData: {
      Username: username,
      Url: url,
    },
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email Sent!");
    })
    .catch((error) => {
      console.log(error);
    });
}

app.post("/api/addGame", async (req, res, next) => {
  //  incoming: title, year, developer, publisher
  //  outgoing: error

  let error = "";

  const { title, year, developer, publisher } = req.body;
  const newGame = {
    Title: title,
    Year: year,
    Developer: developer,
    Publisher: publisher,
  };

  try {
    const db = client.db("COP4331Cards");
    const doesGameAlreadyExist = await db
      .collection("Games")
      .find({ Title: title })
      .toArray();
    if (doesGameAlreadyExist.length > 0) {
      error = `There already exists a game with the title '${title}'`;
    } else {
      const result = db.collection("Games").insertOne(newGame);
    }
  } catch (e) {
    error = e.toString();
  }

  var ret = { error: error };
  res.status(200).json(ret);
});

//Test authorization midpoint
app.post("/api/testJWT", jwtAuth, (req, res) => {
  var error = "";
  try {
    error = req.Username;
  } catch (e) {
    error = "Could not fetch username from req";
  }
  var ret = { Error: error };
  res.status(200).json(ret);
});

app.post("/api/login", async (req, res, next) => {
  // incoming: Username, Password
  // outgoing: User(obj), token <- jwt (http only cookie), Error : error

  var error = "";
  var user = "";

  const { username, password } = req.body;

  try {
    const db = client.db("COP4331Cards");
    user = await db
      .collection("Users")
      .findOne({ Username: username, Password: password });

    if (user) {
      const token = jwt.sign(
        { Username: user.Username },
        process.env.JSON_SECRET,
        { expiresIn: "1h" }
      );
      console.log(token);
      res.cookie("token", token, { httpOnly: true });
    } else {
      error = "Username/Password Combination incorrect";
    }
  } catch (e) {
    error = e.toString();
  }

  var ret = { User: user, Error: error };
  res.status(200).json(ret);
});

app.post("/api/forgotPassword", async (req, res, next) => {
  // Takes username and sends associated email a reset token (stores reset token on mongodb)
  // incoming: username
  // outgoing: error
  var error = "";
  var token = crypto.randomBytes(64).toString("hex");
  const { username } = req.body;

  try {
    const db = client.db("COP4331Cards");
    const user = await db.collection("Users").findOne({ Username: username });

    if (!user) {
      error = "No User Found";
    } else {
      const filter = { _id: user._id };
      const newVals = { $set: { PasswordToken: token } };
      const options = { upsert: false };
      db.collection("Users").updateOne(filter, newVals, options);

      let hostURL = "";
      if (process.env.NODE_ENV === "production") {
        hostURL = "https://mysteamlist.com";
      } else {
        hostURL = "https://localhost:3000";
      }
      let url = hostURL + "/resetPassword?token=" + token;
      sendMessage(user.Email, user.Username, url, "reset");
    }
  } catch (e) {
    error = e.toString();
  }
  var ret = { error: error };
  res.status(200).json(ret);
});

app.post("/api/resetPassword", async (req, res, next) => {
  // Takes password and token and resets password accordingly
  // incoming: token, password
  // outgoing: error
  var error = "";
  const { password, token } = req.body;

  try {
    const db = client.db("COP4331Cards");
    const user = await db.collection("Users").findOne({ PasswordToken: token });

    if (!user) {
      error = "Invalid token";
    } else {
      const filter = { _id: user._id };
      const newVals = { $set: { PasswordToken: null, Password: password } };
      const options = { upsert: false };
      db.collection("Users").updateOne(filter, newVals, options);
    }
  } catch (e) {
    error = e.toString();
  }

  var ret = { error: error };
  res.status(200).json(ret);
});

app.post("/api/register", async (req, res, next) => {
  //  incoming: username, password, email, dob
  //  outgoing: Error

  var error = "";
  var dob = "01/12/2345";
  var token = crypto.randomBytes(64).toString("hex");
  const { username, password, email } = req.body;
  const newUser = {
    Username: username,
    Password: password,
    Email: email,
    DateOfBirth: dob,
    Verified: false,
    EmailToken: token,
  };

  try {
    const db = client.db("COP4331Cards");
    const users = await db
      .collection("Users")
      .find({ Username: username })
      .toArray();

    if (users.length == 0) {
      const result = db.collection("Users").insertOne(newUser);
    } else {
      error = "Username Already Taken";
    }
  } catch (e) {
    error = e.toString();
  }

  var ret = { Error: error };
  if (error == "") {
    let hostURL = "";
    if (process.env.NODE_ENV === "production") {
      hostURL = "https://mysteamlist.com";
    } else {
      hostURL = "http://localhost:3000";
    }
    let url = hostURL + "/verify-email?token=" + token;
    sendMessage(email, username, url, "verify");
  }
  res.status(200).json(ret);
});

app.post("/api/verify-email", async (req, res, next) => {
  console.log("API verify was hit!");
  //incoming: token
  //outgoing: error

  var error = "";

  const { token } = req.body;
  if (!token) {
    error = "No Token Found";
  }

  try {
    const db = client.db("COP4331Cards");
    const user = await db.collection("Users").findOne({ EmailToken: token });

    console.log(user);

    if (!user) {
      error = "Token Invalid";
    } else {
      const filter = { _id: user._id };
      const newVals = { $set: { EmailToken: null, Verified: true } };
      const options = { upsert: false };
      db.collection("Users").updateOne(filter, newVals, options);
    }
  } catch (e) {
    error = e.toString();
  }

  var ret = { error: error };
  res.status(200).json(ret);
});

//adds game details into the db based on appID
app.post("/api/gamedetails", async (req, res, next) => {
  // here are some sample appid's for testing:
  // terraria:  105600
  // celeste:   504230
  // cyberpunk: 1091500

  //incoming: appid
  //outgoing: name, appid, description, image, genres, developers, publishers, platforms, release

  const { appid } = req.body;
  var ret;
  const steam_api_url = `https://store.steampowered.com/api/appdetails?appids=${appid}&l=english`;

  axios
    .get(steam_api_url, {
      "Accept-Language": "en-US",
    })
    .then(async (appinfo) => {
      let i = appinfo.data[appid];
      let genres = [];

      i.data.genres.forEach((element) => genres.push(element.description));

      ret = {
        Name: i.data.name,
        AppID: i.data.steam_appid,
        Description: i.data.short_description,
        Image: i.data.header_image,
        Genres: genres,
        Price: i.data.price_overview,
        Developers: i.data.developers,
        Publishers: i.data.publishers,
        Platforms: i.data.platforms,
        Release: i.data.release_date,
      };

      try {
        const db = client.db("COP4331Cards");
        const game = await db.collection("Games").findOne({ AppID: ret.AppID });

        if (!game) {
          db.collection("Games").insertOne(ret);
        }
      } catch (e) {
        console.log(e.toString());
      }

      res.status(200).json(ret);
    })
    .catch((err) => {
      console.log("Error: ", err.message);
    });
});

//search games based on game's name
app.post("/api/searchGameName", async (req, res, next) => {
  //incoming: name
  //outgoing: appid

  var error = "";
  var games = [];
  const { name } = req.body;

  try {
    const db = client.db("COP4331Cards");
    const gamesCursor = await db
      .collection("Games")
      .find({ Name: name })
      .toArray();

    res.status(200).json(gamesCursor);
  } catch (e) {
    console.log(e.toString());
  }
});

//search games based on game's name
app.post("/api/searchAppID", async (req, res, next) => {
  //incoming: AppID
  //outgoing: Game(obj) of (Name, Description, Image, Genres[], Price(obj), Developers[], Publishers[], Platforms(obj), Release(obj)), Error

  var error = "";
  var ret = "";
  const { AppID } = req.body;

  console.log(AppID);

  try {
    const db = client.db("COP4331Cards");
    const gameObj = await db.collection("Games").findOne({ AppID: AppID });

    if (gameObj) {
      ret = { Game: gameObj, Error: error };
    } else {
      ret = { Game: null, Error: "No Game Found" };
    }

    res.status(200).json(ret);
  } catch (e) {
    console.log(e.toString());
  }
});

app.get("/api/games", async (req, res, next) => {
  try {
    const db = client.db("COP4331Cards");
    const games = await db.collection("Games").find().toArray();
    res.json(games);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// app.post("/api/searchGamesIGDB", async (req, res, next) => {
//   //incoming: name, CLIENT_ID, ACCESS_TOKEN
//   //outgoing: id, name

//   const { GAME_NAME, CLIENT_ID, ACCESS_TOKEN } = req.body;se
//   // const api_url = `https://api.igdb.com/v4/games`;

//   // fetch(
//   //   api_url,
//   //   { method: 'POST',
//   //     headers: {
//   //       'Accept': 'application/json'
//   //     },
//   //     body: `fields name; search "${GAME_NAME}"; limit 10;`
//   // })
//   //   .then(response => {
//   //     res.status(200).json(response);
//   //   })
//   //   .catch(err => {
//   //       console.error(err);
//   //   });

//   wrapper = igdb(
//     "nolwnm8zi98nzj7l2mf2pnskfxptys",
//     "92bvh6gsx4ifkjutp0npr6rtm4sug5"
//   );

//   const response = await wrapper
//     .fields("name")
//     .search("mario")
//     .request("/games");

//   res.status(200).json(response);
// });

// app.post("/api/getSteamGames", async (req, res, next) => {
//   const api_url =
//     "https://api.steampowered.com/ISteamApps/GetAppList/v2/?format=json&jsonp";
//   axios
//     .get(api_url)
//     .then((response) => {
//       res.status(200);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// app.post("/api/searchSteamID", async (req, res, next) => {
//   //incoming: IGDB_ID, CLIENT_ID, ACCESS_TOKEN
//   //outgoing: STEAM_ID

//   const { IGDB_ID, CLIENT_ID, ACCESS_TOKEN } = req.body;
//   const api_url = `https://api.igdb.com/v4/websites`;

//   fetch(api_url, {
//     method: "POST",
//   })
//     .then((response) => {
//       res.status(200).json(response.json());
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// });
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

///////////////////////////////////////////////////
// For Heroku deployment

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("frontend/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

const server = app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});

module.exports = server; // allow testing script to access the server
