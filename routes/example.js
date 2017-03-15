const express = require('express');
const router = express.Router();

router.get("*", (req, res, next) => {
	const originalUrl = req.originalUrl;
	const template = originalUrl.substring(1, originalUrl.length);

	res.render(template)
})
module.exports = router;
