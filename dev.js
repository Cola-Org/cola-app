var debug = require("debug")("edu:server");
var http = require("http");

var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var routes = require("./routes/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "src"));
app.set("view engine", "pug");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require("less-middleware")(path.join(__dirname, "src")));
app.use(express.static(path.join(__dirname, "src")));

app.use("/", routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error("\"" + req.originalUrl + "\" Not Found");
	err.status = 404;
	next(err);
});

// error handlers

app.use(function (err, req, res, next) {
	var status, error;
	if (isFinite(err) && err >= 0) {
		status = err;
	}
	else {
		status = 500;
		error = err;
	}

	res.status(status);
	if (req.originalUrl.indexOf("/service/") >= 0) {
		res.json(error && error.message || status);
	}
	else {
		res.render("error", {
			message: error && error.message || status,
			error: error
		});
	}

	if (error) {
		console.log(error.message);
		console.log(error.stack);
	}
});

module.exports = app;
