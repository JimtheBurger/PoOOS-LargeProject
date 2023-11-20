//Requires
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
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

//Set Headers (allow CORS)
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "https://mysteamlist.com"],
    exposedHeaders: ["set-cookie"],
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use((req, res, next) => {
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
const e = require("express");
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

/*
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
*/

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

app.post("/api/getLists", jwtAuth, async (req, res) => {
  // incoming jwt
  // outgoing ListInfo ({Name, ListId}), Error

  var username = req.Username;
  var error = "";
  var listInfo = "";

  try {
    const db = client.db("COP4331Cards");
    user = await db.collection("Users").findOne({ Username: username });
    if (user.Lists) {
      listInfo = await db
        .collection("Lists")
        .find({ ListId: { $in: user.Lists } })
        .project({ Name: 1, ListId: 1, _id: 0 })
        .toArray();
    } else {
      error = "Token Username Invalid";
    }
  } catch (e) {
    error = e.toString();
  }
  res.status(200).json({ listInfo: listInfo, Error: error });
});

app.post("/api/login", async (req, res, next) => {
  // incoming: username, password
  // outgoing: User(obj), Error
  // Also sets cookie named token <- jwt (http only cookie),

  var error = "";
  var user = "";

  const { username, password } = req.body;

  try {
    const db = client.db("COP4331Cards");
    user = await db.collection("Users").findOne({ Username: username });

    if (user) {
      const validPassword = await bcrypt.compare(password, user.Password);
      if (validPassword) {
        const token = jwt.sign(
          { Username: user.Username },
          process.env.JSON_SECRET,
          { expiresIn: "1h" }
        );
        res.cookie("token", token, { httpOnly: true });
      } else {
        error = "Username/Password Combination incorrect";
      }
    } else {
      error = "Username/Password Combination incorrect";
    }
  } catch (e) {
    error = e.toString();
  }

  var ret = { User: user, Error: error };
  res.status(200).json(ret);
});

app.post("/api/logout", async (req, res) => {
  //Takes incoming jwt and clears it
  var error = "";
  const token = req.cookies.token;

  try {
    const val = jwt.verify(token, process.env.JSON_SECRET);
    req.Username = val.Username;
    res.clearCookie("token");
  } catch (err) {
    res.clearCookie("token");
    error = "invalid token / cleared";
  }
  return res.status(200).json({ Error: error });
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
        hostURL = "http://localhost:3000";
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
  var hash = await bcrypt.hash(password, 8);

  try {
    const db = client.db("COP4331Cards");
    const user = await db.collection("Users").findOne({ PasswordToken: token });

    if (!user) {
      error = "Invalid token";
    } else {
      const filter = { _id: user._id };
      const newVals = { $set: { PasswordToken: null, Password: hash } };
      const options = { upsert: false };
      db.collection("Users").updateOne(filter, newVals, options);
    }
  } catch (e) {
    error = e.toString();
  }

  var ret = { error: error };
  res.status(200).json(ret);
});

app.post("/api/gameInList", jwtAuth, async (req, res) => {
  //takes in AppID, jwt
  //returns a multi-select formatted array which are list ID/Name pairs where the game is and isn't
  //array valid with react-select

  var username = req.Username;
  var { AppID } = req.body;

  var error = "";
  var options = [];

  if (!username) {
    error = "Invalid token";
  } else if (!AppID) {
    error = "No appid specified...";
  } else {
    try {
      const db = client.db("COP4331Cards");
      user = await db
        .collection("Users")
        .findOne({ Username: username }, { Username: 1, Lists: 1, _id: 0 });

      if (user.Lists) {
        lists = await db
          .collection("Lists")
          .find({ ListId: { $in: user.Lists } })
          .project({ Name: 1, ListId: 1, Games: 1, _id: 0 })
          .toArray();

        lists.forEach((list) => {
          if (list.Games.includes(AppID)) {
            options.push({
              label: list.Name,
              value: list.ListId,
              disabled: true,
            });
          } else {
            options.push({ label: list.Name, value: list.ListId });
          }
        });
      }
    } catch (e) {
      error = e.toString();
    }
  }
  var ret = { Options: options, Error: error };
  res.status(200).json(ret);
});

app.post("/api/register", async (req, res, next) => {
  //  incoming: username, password, email, dob
  //  outgoing: Error

  var error = "";
  var token = crypto.randomBytes(64).toString("hex");
  const { username, password, email } = req.body;

  var hash = await bcrypt.hash(password, 8);

  const newUser = {
    Username: username,
    Password: hash,
    Email: email,
    Lists: [],
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

//Remakes new email token and sends new auth email
app.post("/api/resend-verify", jwtAuth, async (req, res, next) => {
  //incoming: jwt
  //outgoing: error

  var error = "";

  try {
    //get user from token header
    let username = req.Username;
    const db = client.db("COP4331Cards");
    const user = await db.collection("Users").findOne({ Username: username });

    //If user doesn't exist, token header false
    if (!user) {
      error = "Token has no match";

      //If user exists but is verified, return error
    } else if (user.Verified) {
      error = "User already verified";
    } else {
      //If user exists and isn't verified, set new token and resend email
      var token = crypto.randomBytes(64).toString("hex");
      const filter = { _id: user._id };
      const newVals = { $set: { EmailToken: token } };
      const options = { upsert: false };
      db.collection("Users").updateOne(filter, newVals, options);

      //resending email
      let hostURL = "";
      if (process.env.NODE_ENV === "production") {
        hostURL = "https://mysteamlist.com";
      } else {
        hostURL = "http://localhost:3000";
      }
      let url = hostURL + "/verify-email?token=" + token;
      sendMessage(user.Email, username, url, "verify");
    }
  } catch (e) {
    error = e.toString();
    res.status(500).json({ Error: error });
  }
});

app.post("/api/verify-email", async (req, res, next) => {
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

app.post("/api/getGamesFromList", jwtAuth, async (req, res) => {
  // incoming : listID, jwtToken
  // outgoing : Games[game{obj}], Title, Owner, Error

  var error = "";
  var user = req.Username;
  var { listId } = req.body;
  var listInfo = "";

  const db = client.db("COP4331Cards");
  const list = await db
    .collection("Lists")
    .findOne({ ListId: parseInt(listId) });

  if (list) {
    if (list.Private && !list.ViewableBy.includes(user)) {
      error = "You do not have access to this list.";
    } else {
      listInfo = list;
      games = await db
        .collection("Games")
        .find({ AppID: { $in: list.Games } })
        .toArray();
    }
  } else {
    error = "No list found.";
  }
  res.status(200).json({ Games: games, ListInfo: listInfo, Error: error });
});

/*
app.post("/api/addGameToList", async (req, res, next) => {
  // incoming: listID, appID
  // outgoing: error

  var error = "";
  var { listID, appID } = req.body;
  var check = false;

  const db = client.db("COP4331Cards");
  const list = await db
    .collection("Lists")
    .findOne({ ListId: parseInt(listID) });

  const game = await db.collection("Games").findOne({ AppID: parseInt(appID) });

  if (list && game) {
    for (let i = 0; i < list.Games.length; ++i) {
      if (JSON.stringify(list.Games[i]) == JSON.stringify(game)) {
        check = true;
      }
    }

    if (list.Private && !list.ViewableBy.includes(user)) {
      error = "You do not have access to this list.";
    } else if (check) {
      error = "Game is already in this list.";
    } else {
      db.collection("Lists").updateOne(
        { ListId: listID },
        { $push: { Games: game } }
      );
    }
  } else {
    error = "No list/game found,";
  }
  res.status(200).json({ Error: error });
});
*/

app.post("/api/editList", jwtAuth, async (req, res) => {
  //incoming: listID, invisible
  //outgoing: error

  var error = "";
  var username = req.Username;
  var { listId, listName, isPrivate, allowedUsers } = req.body;

  try {
    const db = client.db("COP4331Cards");
    const list = await db
      .collection("Lists")
      .findOne({ ListId: parseInt(listId) });

    if (list) {
      var filter = { ListId: listId };
      var newVals = {
        $set: {
          Name: listName,
          Private: isPrivate,
          AllowedUsers: allowedUsers,
        },
      };
      var options = { upsert: false };
      db.collection("Lists").updateOne(filter, newVals, options);
    } else {
      error = "No list found.";
    }
  } catch (e) {
    error = e.toString();
  }

  res.status(200).json({ Error: error });
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

app.post("/api/removeGameFromList", jwtAuth, async (req, res) => {
  // incoming : AppID and ListId to delete, jwt for authentication
  // outgoing : Error

  var error = "";
  var username = req.Username;
  var { ListId, AppID } = req.body;

  if (!ListId) {
    error = "No List Specified";
  } else if (!AppID) {
    error = "No AppID specified";
  }

  try {
    const db = client.db("COP4331Cards");
    const user = await db.collection("Users").findOne({ Username: username });
    if (!user) {
      error = "Username associated with token invalid";
    } else {
      list = await db.collection("Lists").findOne({ ListId: ListId });
      if (list.Owner === username) {
        var filter = { ListId: ListId };
        var newVals = { $pull: { Games: AppID } };
        var options = { upsert: false };
        db.collection("Lists").updateOne(filter, newVals, options);
      } else {
        error += "You do not own list number " + list.ListId + "\n";
      }
    }
  } catch (e) {
    error = e.toString();
  }
  res.status(200).json({ Error: error });
});

app.post("/api/addGameToLists", jwtAuth, async (req, res) => {
  // incoming : Selected array of objects {label : ListName, value : ListId}, AppID, JWT
  // outgoing : Error

  var error = "";
  var username = req.Username;
  var { Selected, AppID } = req.body;

  if (!Selected) {
    error = "No Selected array found";
  } else if (!AppID) {
    error = "No AppID specified";
  }

  try {
    const db = client.db("COP4331Cards");
    const user = await db.collection("Users").findOne({ Username: username });
    if (!user) {
      error = "Username associated with token invalid";
    } else {
      const gameObj = await db.collection("Games").findOne({ AppID: AppID });
      if (!gameObj) {
        error = "Invalid AppID specified";
      } else {
        Selected.forEach(async (item) => {
          list = await db.collection("Lists").findOne({ ListId: item.value });
          if (list.Owner === username) {
            var filter = { ListId: item.value };
            var newVals = { $push: { Games: AppID } };
            var options = { upsert: false };
            db.collection("Lists").updateOne(filter, newVals, options);
          } else {
            error += "You do not own list number " + list.ListId + "\n";
          }
        });
      }
    }
  } catch (e) {
    error = e.toString();
  }
  res.status(200).json({ Error: error });
});

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

app.post("/api/addList", jwtAuth, async (req, res) => {
  // incoming : listName, private, allowedUsers, jwtToken
  // outgoing : Error

  var error = "";
  var username = req.Username;
  var { listName, isPrivate, allowedUsers } = req.body;

  const usersArr = allowedUsers.split(/\s*(?:,|$)\s*/);
  usersArr.push(username);

  const newList = {
    Name: listName,
    Private: isPrivate,
    Owner: username,
    ViewableBy: usersArr,
    Games: [],
    Added: false,
  };

  const db = client.db("COP4331Cards");
  const user = await db.collection("Users").findOne({ Username: username });
  if (!user) {
    error = "Username associated with token invalid";
  } else {
    if (!user.Verified) {
      error = "User unverified";
    } else {
      try {
        objID = (await db.collection("Lists").insertOne(newList)).insertedId;
        console.log(objID);
        list = await db.collection("Lists").findOne({ _id: objID });
        var attempt = 1;
        while (!list.ListId && attempt < 10) {
          attempt += attempt + 1;
          await delay(500);
          list = await db.collection("Lists").findOne({ _id: objID });
        }
        if (!list.ListId) {
          error =
            "An error occurred trying to create the list, please try again";
          db.collection("Lists").deleteMany({
            Owner: username,
            Name: listName,
            Added: false,
          });
        } else {
          console.log("Created List with ID of", list.ListId);
          var filter = { Username: username };
          var newVals = { $push: { Lists: list.ListId } };
          var options = { upsert: false };
          db.collection("Users").updateOne(filter, newVals, options);
          filter = { ListId: list.ListId };
          newVals = { $set: { Added: true } };
          options = { upsert: false };
          db.collection("Lists").updateOne(filter, newVals, options);
        }
      } catch (e) {
        error = e.toString();
      }
    }
  }
  res.status(200).json({ Error: error });
});

app.post("/api/deleteList", jwtAuth, async (req, res) => {
  //incoming jwt, ListID
  //outgoing Error

  var listId = req.body.ListId;
  var username = req.Username;
  var error = "";

  try {
    const db = client.db("COP4331Cards");
    const user = await db.collection("Users").findOne({ Username: username });
    if (!user) {
      error = "Username associated with token invalid";
    } else {
      if (!user.Verified) {
        error = "You are unverified, how did you manage to do this?";
      } else {
        const list = await db.collection("Lists").findOne({ ListId: listId });
        if (!list) {
          error = "Invalid ListId associated with request.";
        } else {
          if (list.Owner !== username) {
            error = "You do not own this list";
          } else {
            await db.collection("Lists").deleteOne({ ListId: listId });
            var filter = { Username: username };
            var newVals = { $pull: { Lists: listId } };
            var options = { upsert: false };
            await db.collection("Users").updateOne(filter, newVals, options);
          }
        }
      }
    }
  } catch (e) {
    error = e.toString();
  }
  res.status(200).json({ Error: error });
});

app.post("/api/checkLogin", async (req, res) => {
  //incoming QRToken
  //outgoing User({obj}) Error
  // Also sets cookie named token <- jwt (http only cookie),

  const { QRToken } = req.body;
  var error = "";
  var user = "";

  if (!QRToken) {
    error = "No QRToken specified";
  } else {
    try {
      const db = client.db("COP4331Cards");
      const token = await db
        .collection("QRTokens")
        .findOne({ QRToken: QRToken });
      if (token) {
        console.log(token);
        if (token.UserId !== "") {
          user = await db
            .collection("Users")
            .findOne({ UserId: parseInt(token.UserId) });
          if (user !== "") {
            const token = jwt.sign(
              { Username: user.Username },
              process.env.JSON_SECRET,
              { expiresIn: "1h" }
            );
            res.cookie("token", token, { httpOnly: true });
          } else {
            error = "UserId invalid";
          }
        } else {
          error = "Token not associated with a user";
        }
      } else {
        error = "Token not found or expired";
      }
    } catch (e) {
      error = e.toString();
    }
  }
  var ret = { User: user, Error: error };
  res.status(200).json(ret);
});

app.post("/api/mobileQRLogin", async (req, res) => {
  //incoming UserId, QRToken
  //outgoing Error

  var error = "";
  const { UserId, QRToken } = req.body;

  try {
    const db = client.db("COP4331Cards");

    const token = await db.collection("QRTokens").findOne({ QRToken: QRToken });

    if (!token) {
      error = "QR Token (" + QRToken + ") Expired or Not Found";
    } else {
      const filter = { QRToken: QRToken };
      const newVals = { $set: { UserId: UserId } };
      const options = { upsert: false };
      await db.collection("QRTokens").updateOne(filter, newVals, options);
    }
  } catch (e) {
    error = e.toString();
  }
  res.status(200).json({ Error: error });
});

app.post("/api/newQRToken", async (req, res) => {
  //incoming : nothing
  //outgoing : QRToken, Error

  var token = crypto.randomBytes(64).toString("hex");
  error = "";

  try {
    const db = client.db("COP4331Cards");
    await db.collection("QRTokens").insertOne({ QRToken: token, UserId: "" });
  } catch (e) {
    error = e.toString();
  }
  res.status(200).json({ QRToken: token, Error: error });
});

//search ALL games based on name AND genre
app.post("/api/searchGames", async (req, res) => {
  //incoming: Name and Genre
  //outgoing: Games[{game}], Error

  var error = "";
  var games = "";
  var { Name, Genre } = req.body;
  var params = {};

  if (Name !== "") {
    params.Name = { $regex: Name, $options: "i" };
  }
  if (Genre !== "") {
    params.Genres = Genre;
  }

  try {
    const db = client.db("COP4331Cards");
    games = await db.collection("Games").find(params).toArray();
  } catch (e) {
    error = e.toString();
  }
  res.status(200).json({ Games: games, Error: error });
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

//Quick clear command for testing
//const db = client.db("COP4331Cards");
//db.collection("Users").deleteMany({});
