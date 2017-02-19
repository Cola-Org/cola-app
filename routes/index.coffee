express = require 'express'
router = express.Router()

mobileUrls = [
	'/spa'
	'/spa/home'
	'/spa/my'
]
router.get mobileUrls, (req, res, next) ->
	res.render 'cola-app/spa/shell'

router.get '/frame/main', (req, res, next) ->
	if req.session.authenticated
		res.render 'cola-app/frame/main'
	else
		res.render 'cola-app/frame/account/login'

router.get ['/', '/readme'], (req, res, next) ->
	res.render 'index'

module.exports = router
