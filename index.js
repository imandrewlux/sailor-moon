const express = require('express');
const request = require('request');
const app     = express();
const PORT    = 3000;
const server  = require('http').createServer(app);
var pokermon;
app.use(express.urlencoded())
//const io      = require('socket.io')(server);


// tell our app where to serve our static files
app.use(express.static('public'));

// define a route - what happens when people visit /
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, function() {
  console.log('listening on PORT: ' + PORT);
});
