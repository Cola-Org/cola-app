var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var utils = require('./routes/utils');
var routes = require('./routes/index');
var service = require('./routes/service');
var colaApp = require('./routes/cola-app');
var example = require('./routes/example');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(require('coffee-middleware')(path.join(__dirname, 'public')));
app.use(express["static"](path.join(__dirname, 'public')));
app.use(express["static"](path.join(__dirname, 'data')));

app.use(session({
	secret: 'recommand 128 bytes random string',
	cookie: {
		maxAge: 20 * 60 * 1000
	}
}));

app.use("/*", function (req, res, next) {
	if (req.method === "GET" && req.originalUrl.indexOf("/service/") < 0) {
		req.data = {};
		utils.getUserAgentInfo(req);
	}
	next();
});

app.use('/', routes);
app.use('/cola-app', colaApp);
app.use('/service', service);
app.use('/example', example);

app.use(function(req, res, next) {
	var err;
	err = new Error('Not Found');
	err.status = 404;
	return next(err);
});

if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		return res.render('cola-app/frame/404', {
			message: err.message,
			error: err
		});
	});
}

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	return res.render('cola-app/frame/500', {
		message: err.message,
		error: {}
	});
});

process.on('uncaughtException', function(err) {
	return console.log('Uncaught Exception: ', err);
});

module.exports = app;