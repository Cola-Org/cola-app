const express = require('express');
const router = express.Router();

router.get("*", (req, res, next) => {
	const i = req.url.indexOf('?');
	var templatePath = req.originalUrl.substring(1, i);
	if (i < 0) {
		templatePath = req.originalUrl.substring(1)
	}
	res.render(templatePath)
});

module.exports = router;