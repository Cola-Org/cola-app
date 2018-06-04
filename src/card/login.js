cola(function (model) {
	model.set("username", ($.cookie() && $.cookie()["_username"]) || "");
	model.set("password", "");
	model.describe({
		username: {
			validators: {$type: "required", message: ""}
		},
		password: {
			validators: {$type: "required", message: ""}
		}
	});

	model.action({
		login: function (self) {
			self.addClass("loading");
			model.widget("formSignIn").setMessages(null);
			var data = model.get();
			if (data.validate()) {
				$.post(App.prop("mobile.login", "service/account/login"), model.get()).done(function (authState) {
					var authenticated = authState.authenticated;
					App.setReturnValue(authenticated);

					App.setProp("authenticated", authenticated);
					if (authenticated) {
						$.cookie("_username", data.get("username"));

						App.boardcastMessage({
							type: "authStateChange",
							data: {
								authenticated: true,
								authInfo: authState.authInfo
							}
						});

						var forward = location.search;
						if (forward && forward.charAt(0) === "?") {
							forward = forward.substring(1);
						}
						if (forward === "_back") {
							history.back();
						}
						else {
							App.open(decodeURIComponent(forward) || App.prop("mobile.defaultRouterPath") || "/", true);
						}
					}
					else {
						model.widget("formSignIn").setMessages([{
							type: "error",
							text: authState.message || "用户名或密码错误！"
						}]);
					}
				}).always(function() {
					self.removeClass("loading");
				});
			}
			else {
				setTimeout(function() {
					self.removeClass("loading");
				}, 500);
			}
			return false;
		}
	});

	setTimeout(function() {
		model.$("#formSignIn").removeClass("reserve");
	}, 200);
});