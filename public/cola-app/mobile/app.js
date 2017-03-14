App.channels = [];

App.getPlus = function() {
	return this.getRootWindow().plus;
};

App.router = function(config) {
	if (this.rootApp) {
		this.rootApp.router(config);
	}
	else {
		if (!this._prependingRouters) this._prependingRouters = [];
		this._prependingRouters.push(config);
	}
	return this;
};

App.channel = function(config) {
	config.level = 0;
	this.router(config);
};

App.open = function (path, config) {
	var target, callback, replace, argument;

	if (config) {
		switch (typeof(config)) {
			case "string":
				target = config;
				break;
			case "function":
				callback = config;
				break;
			case "boolean":
				replace = config;
				break;
			case "object":
				target = config.target;
				callback = config.callback;
				argument = config.argument;
				replace = config.replace;
				break;
		}
	}

	var rootWindow = this.getRootWindow();
	if (target) {
		rootWindow.open(path, target);
	}
	else if (path.match(/^https*:/)) {
		var domainRegExp = App.prop("domainRegExp");
		if (this.getPlus()) {
			 var match = domainRegExp && path.match(domainRegExp);
			if (match) {
				path = "link?" + encodeURIComponent(path.substring(match[0].length));
				rootWindow.setRoutePath(window, path, {
					argument: argument,
					callback: callback,
					replace: replace
				});
			}
			else {
				rootWindow.setRoutePath(window, "browser?" + encodeURIComponent(path), {
					argument: argument,
					callback: callback,
					replace: replace
				});
			}
		}
		else {
			rootWindow.open(path, "_self");
		}
	}
	else {
		rootWindow.setRoutePath(window, path, {
			argument: argument,
			callback: callback,
			replace: replace
		});
	}
};

App.getArgument = function(model) {
	var layerInfo = this.getRootWindow().getLayerInfo(model, window);
	if (layerInfo) return layerInfo.argument;
};

App.setReturnValue = function(model, value) {
	var layerInfo = this.getRootWindow().getLayerInfo(model, window);
	if (layerInfo && value != null) {
		if (value instanceof cola.Entity || value instanceof cola.EntityList) {
			value = value.toJSON();
		}
		layerInfo.returnValue = JSON.stringify(value);
	}
};

App.goLogin = function (nextPath, callback) {

	function trimPath(path) {
		if (path) {
			if (path.charCodeAt(0) == 47) // `/`
				path = path.substring(1);
			if (path.charCodeAt(path.length - 1) == 47)	// `/`
				path = path.substring(0, path.length - 1);
		}
		return path || "";
	}

	var loginPath = trimPath(App.prop("mobile.loginPath", "/login"));
	if (trimPath(cola.getCurrentRoutePath()) == loginPath) {
		return;
	}

	if (this.rootApp) {
		return this.rootApp.goLogin(nextPath, callback);
	}
	else {
		var replace = true;
		if (typeof nextPath == "function") {
			callback = nextPath;
			nextPath = null;
		}
		else if (typeof nextPath == "boolean") {
			replace = nextPath;
			nextPath = null;
		}

		var path = loginPath, realNextPath = nextPath || cola.getCurrentRoutePath();

		if (realNextPath) path += "?" + encodeURIComponent(realNextPath);
		this.open(path, {
			callback: callback,
			replace: replace
		});
	}
};

App.logout = function(callback) {
	$.post(App.prop("service.logout", "./service/account/logout"), function(result) {
		App.boardcastMessage({
			type: "authStateChange",
			data: { authenticated: false }
		});
		if (callback) callback(result);
	});
};

App.setTitle = function (model, title) {
	this.getRootWindow().layerTitleChange(model, window, title);
};

$(function () {
	$(document.body).delegate("a.state", "click", function (evt) {
		var href = this.getAttribute("href");
		if (href) {
			App.open(href, this.getAttribute("target"));
		}
		evt.stopImmediatePropagation();
		return false;
	});
});
