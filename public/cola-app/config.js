/* 系统默认值 */
App.setProp({
	language: "zh",
	appTitle: "Cola-App",
	"spa.defaultRouterPath": "/spa/home",
	// REPLACE_START
	// 开发状态下的默认值，在Build时此段内容将被替换
	// liveMessage: false
	// REPLACE_END
});

/* 频道 */
App.channel({
	path: "/spa/home",
	icon: "home",
	htmlUrl: "./example/spa/home"
});
App.channel({
	path: "/spa/my",
	icon: "user",
	authRequired: true,
	htmlUrl: "./example/spa/my"
});

/* 路由 */
App.router({
	path: "/login",
	class: "open",
	animation: "slide down",
	htmlUrl: "./cola-app/spa/account/login"
});
App.router({
	path: "/forgot-password1",
	type: "iFrame",
	htmlUrl: "./cola-app/spa/account/forgot-password1"
});
App.router({
	path: "/forgot-password2",
	type: "iFrame",
	htmlUrl: function () {
		return "./cola-app/spa/account/forgot-password2" + location.search
	}
});
App.router({
	path: "/new-password",
	type: "iFrame",
	htmlUrl: function () {
		return "./cola-app/spa/account/new-password" + location.search
	}
});
App.router({
	path: "/register",
	class: "open",
	htmlUrl: "shell/account/register"
});
App.router({
	path: "/set-password",
	type: "iFrame",
	htmlUrl: "./cola-app/spa/account/set-password"
});