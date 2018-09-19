'use strict'
require('dotenv').config();
const express = require('express');
var cors = require('cors');
const {CLIENT_ORIGIN} = require('./config');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
      origin: CLIENT_ORIGIN
  })
);

app.get('/api/*', (req, res) => {
  res.json({ok: true});
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = {app};