'use strict'
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
const passport = require('passport');

const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const { storiesRouter } = require('./stories');
const { PORT, DATABASE_URL } = require('./config');

mongoose.Promise = global.Promise;

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/', (req, res) => res.json({ ok: true }));
app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
app.use('/api/stories/', storiesRouter);
app.use(express.static('public'));

const jwtAuth = passport.authenticate('jwt', { session: false });

// A protected endpoint which needs a valid JWT to access it

app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'secret'
  });
});

app.get('/', function (req, res) {
  res.send('<h1>inspiry-svr</h1><p>/api/*</p><div><a href="https://github.com/gotylergo/inspiry-cl">view on github</a></div>');
})

app.use(function (req, res, next) {
  res.status(404).send("Oops, that route is invalid. Check for typos and try again.");
});

let server;

function runServer(databaseUrl, port) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(port, () => {
          console.info(`Using database: ${databaseUrl}`);
          console.info(`App is listening on port: ${port}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL, PORT).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
