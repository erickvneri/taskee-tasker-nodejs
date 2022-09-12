"use strict";
// Libs
const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Initial middleware
app.use(bodyParser.json());

// Resources
const usersResource = require("./resources/users");
app.use("/users", usersResource);

// Init server
app.listen(config.port, () => {
  console.log(`server listening at http://${config.host}:${config.port}`);
});