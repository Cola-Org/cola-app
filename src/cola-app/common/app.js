"use strict";

(function () {
	var rootApp, rootWindow, win = window.parent;
	while (win) {
		try {
			if (win.App) {
				rootApp = win.App;
				rootWindow = win;
				break;
			}
			if (win === win.parent) break;
			win = win.parent;
		}
		catch (e) {
		}
	}

	var properties;
	if (!rootApp) {
		properties = {
			contextPath: "/",
			serviceUrlPattern: /^\/?service\/[a-z]+/,
			serviceUrlPrefix: "/",
			serviceUrlReplacePattern: null
		};
	}

	var App = window.App = {
		rootApp: rootApp,
		eventHandlers: {},

		prop: function (key, defaultValue) {
			if (this.rootApp) {
				return this.rootApp.prop.apply(this.rootApp, arguments);
			}
			else {
				if (properties.hasOwnProperty(key)) {
					return properties[key];
				}
				else {
					return defaultValue;
				}
			}
		},

		setProp: function (key, value) {
			if (this.rootApp) {
				return this.rootApp.setProp.apply(this.rootApp, arguments);
			}
			else {
				if (typeof key === "string") {
					properties[key] = value;
				}
				else if (key) {
					for (var p in key) {
						if (key.hasOwnProperty(p)) properties[p] = key[p];
					}
				}
			}
		},

		on: function (event, listener) {
			var listeners = this.eventHandlers[event];
			if (!listeners) {
				this.eventHandlers[event] = listeners = [];
			}
			listeners.push(listener);
			return this;
		},

		off: function (event, listener) {
			var listeners = this.eventHandlers[event];
			if (listeners) {
				if (listener) {
					var i = listeners.indexOf(listener);
					if (i > -1) listeners.splice(i, 1);
				}
				else {
					delete this.eventHandlers[event];
				}
			}
			return this;
		},

		trigger: function (event, param) {
			var retValue, listeners = this.eventHandlers[event];
			if (listeners) {
				for (var i = 0, listener; i < listeners.length; i++) {
					listener = listeners[i];
					var ret = listener(param);
					if (ret !== undefined) retValue = ret;
					if (retValue === false) break;
				}
			}
			return retValue;
		},

		getRootWindow: function () {
			return (this.rootApp) ? rootWindow : window;
		},

		boardcastMessage: function (message) {
			if (this.rootApp) {
				this.rootApp.boardcastMessage(message);
			}
			else {
				boardcastMessage(message);
			}
		},

		sendMessage: function (message) {
			var webSocket = App.prop("webSocket");
			if (webSocket && webSocket.readyState === 1) {
				webSocket.send(JSON.stringify(message));
			}
		}
	};

	$(document).ajaxError(function (event, jqXHR) {
		if (jqXHR.status === 401) {
			App.goLogin();
			return false;
		}
		else {
			var message = jqXHR.responseJSON;
			if (message) {
				if (typeof message === "object") {
					throw new cola.Exception(message.msg);
				}
				else {
					throw new cola.Exception(message);
				}
			}
		}
	});
	$.ajaxPrefilter(function (options) {
		var serviceUrlPrefix = App.prop("serviceUrlPrefix");
		var serviceUrlReplacePattern = App.prop("serviceUrlReplacePattern");
		var serviceUrlPattern = App.prop("serviceUrlPattern");
		if (serviceUrlReplacePattern && typeof serviceUrlReplacePattern === "string") {
			serviceUrlReplacePattern = new RegExp(serviceUrlReplacePattern);
		}
		if (serviceUrlPattern && typeof serviceUrlPattern === "string") {
			serviceUrlPattern = new RegExp(serviceUrlPattern);
		}

		var url = options.url;
		if (serviceUrlPrefix && url.match(serviceUrlPattern)) {
			if (serviceUrlReplacePattern) {
				options.url = url.replace(serviceUrlReplacePattern, serviceUrlPrefix);
			}
			else {
				options.url = cola.util.path(serviceUrlPrefix, url);
			}
			if (serviceUrlPrefix !== "/") {
				options.crossDomain = true;
				options.xhrFields = {withCredentials: true};
			}
		}
		// options.contentType = "text/plain";
	});

	cola.defaultAction("setting", function (key) {
		return App.prop(key);
	});
	cola.defaultAction("getAvatarUrl", function (filePath) {
		return filePath ? App.prop("serviceUrlPrefix") + "file/" + filePath : App.prop("mobile.contextPath") + "/resources/images/avatars/elyse.png"
	});

	// if (!window._isColaShell) {
	// 	var language = App.prop("language");
	// 	if (language != "none") {
	// 		language = language || window.navigator.language;
	// 		document.write("<script src=\"resources/cola-ui/i18n/" + language + "/cola.js\"></script>");
	// 		var i18nResources = App.prop("i18nResources");
	// 		if (i18nResources) {
	// 			i18nResources = i18nResources.split(/[;,]/);
	// 			for (var i = 0, len = i18nResources.length; i < len; i++) {
	// 				document.write(cola.util.path("<script src=\"resources/i18n", language, i18nResources[i], "></script>"));
	// 			}
	// 		}
	//
	// 	}
	// }

	window.boardcastMessage = function (message) {
		$(window).trigger("appmessage", message);
		$("iframe").each(function () {
			try {
				var win = this.contentWindow;
				if (win.boardcastMessage) {
					win.boardcastMessage(message);
				}
			}
			catch (e) {
			}
		});
	};
})();