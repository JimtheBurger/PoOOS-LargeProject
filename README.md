# PoOOS-LargeProject
Large Project for Processes of Object Oriented Software (Group 4)

The default branch is "master" as that is what Heroku uses. Feel free to edit.

To have this working on your computer you will need

- Files: node_modules directory and .env to be able to run this locally. For node_modules refer to MERN A, for .env refer to MERN B (sudo npm install dotenv) then add the MONGODB link. (The one I use is: MONGODB_URI=[look in Database section in Discord])

- Terminal Commands: Refer to MERN B. You may directly push to this branch which should automatically update Heroku (recommended). You may also install/login to Heroku and install git so you are able to directly update Heroku yourself. There are some Heroku commands that may be relevant for determining errors. (You will need to be added to the Heroku app if you wish to use these commands)

# Testing
To test the express server, run the following command:
`npx jest testing/server.test.js --forceExit`

Make sure you've already run `npm install` and have your .env set up
