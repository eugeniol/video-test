
const express = require('express')
const app = express()
const http = require("http").Server(app)
const port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

require('./lib/routes.js')(app);

http.listen(port)
