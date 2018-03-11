'use strict';

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const yas = require('youtube-audio-stream');
const ytpl = require('ytpl');

const ROOT_PATH = `${__dirname}/layouts/`;

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/', express.static(ROOT_PATH));
app.use('/res', express.static(`${ROOT_PATH}res/`));

app.get('/', (req, res) => {
  res.sendFile(`${ROOT_PATH}/index.html`);
});

app.get('/res', (req, res) => {
  res.send(`${ROOT_PATH}index.html`);
});

app.get('/music', (req, res) => {

  var requestUrl = `https://www.youtube.com/watch?v=${req.query.id}`;

  try {
    yas(requestUrl).pipe(res);
  } catch (exception) {
    res.status(500).send(exception);
  }
});

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});

