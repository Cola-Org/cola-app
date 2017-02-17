/* 系统默认值 */
App.setProp({
	language: "zh",
	appTitle: "Cola-App",
	"mobile.defaultRouterPath": "/mobile/home",
	// REPLACE_START
	// 开发状态下的默认值，在Build时此段内容将被替换
	// liveMessage: false
	// REPLACE_END
});

/* 频道 */
App.channel({
	path: "/mobile/home",
	icon: "home",
	htmlUrl: "./example/mobile/home"
});
App.channel({
	path: "/mobile/my",
	icon: "user",
	authRequired: true,
	htmlUrl: "./example/mobile/my"
});

/* 路由 */
App.router({
	path: "/login",
	class: "open",
	animation: "slide down",
	htmlUrl: "./cola-app/mobile/account/login"
});
App.router({
	path: "/forgot-password1",
	type: "iFrame",
	htmlUrl: "./cola-app/mobile/account/forgot-password1"
});
App.router({
	path: "/forgot-password2",
	type: "iFrame",
	htmlUrl: function () {
		return "./cola-app/mobile/account/forgot-password2" + location.search
	}
});
App.router({
	path: "/new-password",
	type: "iFrame",
	htmlUrl: function () {
		return "./cola-app/mobile/account/new-password" + location.search
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
	htmlUrl: "./cola-app/mobile/account/set-password"
});