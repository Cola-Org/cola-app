var express = require("express");
var router = express.Router();

router.get("*.html", function (req, res, next) {
	var path = req.url.replace(".html", "").substring(1);
	res.render(path);
});

module.exports = router;
