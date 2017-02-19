cola(function (model) {
    model.describe({
        userName: {
            validators: {
                $type: "required", message: ""
            }
        },
        password: {
            validators: {
                $type: "required", message: ""
            }
        }
    });
    model.set("userName", $.cookie("_userName"));
    function showMessage(content) {
        cola.widget("formSignIn").setMessages([
            {
                type: "error",
                text: content
            }
        ]);
    }

    function submit() {
        var data = model.get();
        cola.widget("containerSignIn").addClass("loading");
        $.ajax({
            type: "POST",
            url: App.prop("service.login"),
            data: JSON.stringify(data.toJSON()),
            contentType: "application/json"
        }).done(function (result) {
            cola.widget("containerSignIn").removeClass("loading");
            if (!result.authenticated) {
                showMessage(result.message);
                return;
            }
            if (model.get("cacheInfo")) {
                $.cookie("_userName", model.get("userName"), {
                    path: "/",
                    expires: 365
                });
            }
            window.location = App.prop("mainView");
        }).fail(function () {
            cola.widget("containerSignIn").removeClass("loading");
        });
    }
    model.action({
        signIn: function () {
            cola.widget("formSignIn").setMessages(null);
            if (!model.get().validate()) {
                showMessage("用户名或密码不能为空！");
                return
            }
            submit();
        }
    });
});

