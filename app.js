var express = require("express");
var path = require("path");
var app = express();

// view engine setup
app.use(express.static(path.join(__dirname, "dest/app")));

module.exports = app;
