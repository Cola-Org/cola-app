express = require 'express'
router = express.Router()

router.get '/*', (req, res, next) ->
	i = req.url.indexOf('?')
	if i >= 0
		templatePath = req.originalUrl.substring(1, i)
	else
		templatePath = req.originalUrl.substring(1)
	res.render templatePath

module.exports = router
