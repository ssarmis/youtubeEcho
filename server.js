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

app.get('/music', (req, res) => {

  var requestUrl = `https://www.youtube.com/watch?v=${req.query.id}`;

  yas(requestUrl).pipe(res);
});

app.get('/upage', (req, res) => {
  res.sendFile(`${ROOT_PATH}/upage.html`);
});

app.get('/reqsgl', (req, res) => {
  let plid = req.query.id;
  
  ytpl(`${plid}`, (err, playlist) => {
    if(err){
      console.log(err);
      return;
    } 

    res.setHeader('Content-Type', 'application/json');
    res.send(playlist);
  });
});

app.get('/reqpl', (req, res) => {

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({
    "items":[
      {
        "id": "PLRBp0Fe2GpglkzuspoGv-mu7B2ce9_0Fn",
        "title": "💥 NCS: Indie Dance",
        "last_updated": "Last updated on Dec 16, 2017",
      },
      {
        "id": "PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj",
        "title": "Pop Music Playlist: Timeless Pop Hits (Updated Weekly 2018)",
        "last_updated": "Last updated on Mar 5, 2018",
      },
    ]
  }));
});

let server = app.listen(3000, () => {
  console.log('Listening on port 3000!');
  
  process.argv.forEach((val, index, array) => {
    if(val === "testing"){
      setInterval(process.exit(0), 3000);
    }
  });
});

// MUST BE CHANGED
// IMPLEMENT CLUSTER AND DOMAIN FOR HANDLING EXCEPTIONS
process.on('uncaughtException', err => console.log(err));
//

