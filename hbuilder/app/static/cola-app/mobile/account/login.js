cola(function (model) {
	model.set("userName", $.cookie("_userName"),  { path: "/" });
	model.describe({
		userName: {
			validators: {$type: "required", message: ""}
		},
		password: {
			validators: {$type: "required", message: ""}
		}
	});

	model.action({
		signIn: function () {
			cola.widget("formSignIn").setMessages(null);
			var data = model.get();
			if (data.validate()) {
				cola.widget("containerSignIn").showDimmer();
				$.post(App.prop("mobile.login", "service/account/login"), model.get()).done(function (authState) {
					cola.widget("containerSignIn").hideDimmer();
					App.setReturnValue(authState.authenticated);

					if (authState.authenticated) {
						cola.widget("containerSignIn").hideDimmer();

						App.boardcastMessage({
							type: "authStateChange",
							data: {
								authenticated: true,
								authInfo: authState.authInfo
							}
						});
						$.cookie("_userName", data.get("userName"),  { path: "/" });

						var forward = location.search;
						if (forward && forward.charAt(0) == "?") {
							forward = forward.substring(1);
						}
						if (forward == "_back") {
							history.back();
						}
						else {
							App.open(decodeURIComponent(forward) || "/", true);
						}
					}
					else {
						cola.widget("formSignIn").setMessages([{
							type: "error",
							text: authState.message
						}]);
					}
				}).fail(function () {
					cola.widget("containerSignIn").hideDimmer();
				});
			}
			return false;
		}
	});

	model.widgetConfig({
		buttonSignIn: {
			$type: "button",
			class: "fluid orange",
			caption: cola.resource("signIn"),
			click: function () {
				model.action.signIn();
			}
		},
		buttonRegister: {
			$type: "button",
			class: "fluid green",
			caption: cola.resource("register"),
			click: function () {
				App.open("/register" + location.search);
			}
		}
	});
});