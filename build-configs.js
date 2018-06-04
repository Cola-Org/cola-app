module.exports = {
	app: {
		dest: "hbuilder/app/static",
		version: "0.0.1",
		packageName: "Cola-UI APP",
		"serviceUrlPrefix": "https://hy.hol-win.com/",
		"serviceUrlPattern": "(^/?service/.+|^/?login$)",
		// "service.webSocketService": "wss://cola-ui.com/service/web-socket"
	},
	test: {
		dest: "hbuilder/test/static",
		version: "0.0.1",
		packageName: "Cola-UI APP",
		"serviceUrlPrefix": "https://test.hol-win.com/",
		"serviceUrlPattern": "(^/?service/.+|^/?login$)",
		// "service.webSocketService": "wss://cola-ui.com/service/web-socket"
	}
};