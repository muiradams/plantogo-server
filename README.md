# PlanToGo - Server
An ExpressJS server using NodeJS as a RESTful API for creating and
authenticating users, and maintaining a database of travel itineraries.  It
relies on MongoDB for the database.

The server was created to work hand-in-hand with the PlanToGo React Web App,
which can be found here: https://github.com/muiradams/plantogo.

The server is currently deployed on Heroku running the backend of PlanToGo,
which you can view live here: https://www.plantogo.co

Install dependencies: npm install
Start the server in development mode: npm run dev

There are two files that contain SETUP that is required for production:
/controllers/authentication.js
/services/passport.js

Each file is setup to point to a config.js file for development, which needs to
contain three things:
secret: a key for hashing the users password on creation
mailgunLogin: login for using mailgun.com to send password recovery emails
mailgunPassword: password for mailgun
