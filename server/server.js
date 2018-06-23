const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const cors = require('cors');

const authors = ['Krzysztof Balwierczak', 'Tomasz Bugajski'];
const PORT = 8000;
const accessToken = '0df5dc9a451071f06dfa5207725021ba56c75e85';
const id = "20905149";

const server = createServer();

//Server
function createServer(){
  const server = express();
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(cors());
  server.listen(PORT);

  server.get('/authors', (req, res) => {
    //res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(authors);
  });

  server.get('/athlete', (req, res) => {
    //res.setHeader('Access-Control-Allow-Origin', '*');
    let url = `https://www.strava.com/api/v3/athlete?access_token=${accessToken}`;
    request(url, function (err, response, body) {
      if (err){
        res.status(500).send('Problem occurred when fetching athletes info');
      } else {
        const athlete = JSON.parse(body);
        res.status(201).send(athlete);
      }
    });
  });

  server.get('/stats', (req, res) => {
    //res.setHeader('Access-Control-Allow-Origin', '*');
    let url = `https://www.strava.com/api/v3/athletes/${id}/stats?access_token=${accessToken}`;
    request(url, function (err, response, body) {
      if (err){
        res.status(500).send('Problem occurred when fetching athletes stats');
      } else {
        const stats = JSON.parse(body);
        if (stats === undefined){
          res.status(500).send('Problem occurred when fetching athletes stats');
        }
        res.status(201).send(stats);
      }
    });
  });

    server.get('/activities', function (req, res) {
     // res.setHeader('Access-Control-Allow-Origin', '*');
      let url = `https://www.strava.com/api/v3/athlete/activities?per_page=20&access_token=${accessToken}`;
      request(url, function (err, response, body) {
        if (err){
          res.status(500).send('Problem occurred when fetching athletes stats');
        } else {
          let activities = JSON.parse(body);
          if (activities === undefined) {
            res.status(500).send('Problem occurred when fetching athletes activities');
          }
          res.status(201).send(activities);
        }
      });
    });

  return server;
}
