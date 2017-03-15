var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render(`cola-app/frame/${err.status == 404 ? '404' : '500'}`);
});

module.exports = app;
