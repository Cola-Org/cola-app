var express = require('express');
var router = express.Router();

router.get(['/mobile', '/mobile/home', '/mobile/my'], function(req, res, next) {
	return res.render('cola-app/mobile/shell');
});

router.get('/frame/main', function(req, res, next) {
	if (req.session.authenticated) {
		return res.render('cola-app/frame/main');
	} else {
		return res.render('cola-app/frame/account/login');
	}
});

router.get('/', function(req, res, next) {
	if (req.data.uaInfo.mobile) {
		return res.redirect('/mobile');
	}
	else {
		return res.redirect('/readme');
	}
});

router.get('/readme', function(req, res, next) {
	return res.render('readme');
});

module.exports = router;
