/* 系统默认值 */
App.setProp({
	"version": "0.0.0",
	"appTitle": "Cola-App",
	"language": "none",
	"service.authInfo": "none",
	"mobile.defaultRouterPath": "/home",
	"mobile.defaultAuthRequired": true,
	"mobile.login": "/service/mobile/login",
	"mobile.loginPath": "/login"
});

App.setProp({"dest":"hbuilder/test/static","version":"0.0.1","packageName":"HOL-WIN EDU","serviceUrlPrefix":"https://test.hol-win.com/","serviceUrlPattern":"(^/?service/.+|^/?login$)","service.webSocketService":"wss://test.hol-win.com/service/web-socket","appMode":true,"mobile.htmlSuffix":".html"});

/* 频道 */
App.router({
	path: "/home",
	class: "free",
	icon: "home",
	htmlUrl: "/card/home",
	cssUrl: "/card/home.css"
});


/* 登录 */
App.router({
	path: "/login",
	class: "free",
	authRequired: false,
	animation: "none",
	htmlUrl: "/card/login",
	cssUrl: "/card/login.css"
});
App.router({
	path: "/forgot-password1",
	type: "iFrame",
	authRequired: false,
	htmlUrl: "/cola-app/mobile/account/forgot-password1"
});
App.router({
	path: "/forgot-password2",
	type: "iFrame",
	authRequired: false,
	htmlUrl: function () {
		return "/cola-app/mobile/account/forgot-password2" + location.search
	}
});
App.router({
	path: "/new-password",
	type: "iFrame",
	authRequired: false,
	htmlUrl: function () {
		return "/cola-app/mobile/account/new-password" + location.search
	}
});
App.router({
	path: "/register",
	class: "open",
	authRequired: false,
	htmlUrl: "shell/account/register"
});
App.router({
	path: "/set-password",
	type: "iFrame",
	authRequired: false,
	htmlUrl: "/cola-app/mobile/account/set-password"
});