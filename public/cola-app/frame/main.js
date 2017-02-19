(function () {
    cola(function (model) {
        var logo = App.prop("app.logo.path");
        if (logo) {
            $("#appHeader").append($.xCreate({
                tagName: "img",
                "class": "img ui mini image",
                src: logo
            }));
        }

        var appName = App.prop("app.name");
        if (appName) {
            $("#appHeader").append($.xCreate({
                tagName: "span",
                content: appName
            }));
        }

        model.describe("menus", {
            provider: {
                url: App.prop("service.menus")
            }
        });
        model.describe("user", {
            provider: {
                url: App.prop("service.user.detail")
            }
        });


        (function () {
            model.dataType({
                name: "Login",
                properties: {
                    userName: {
                        validators: {
                            $type: "required",
                            message: ""
                        }
                    },
                    password: {
                        validators: {
                            $type: "required",
                            message: ""
                        }
                    }
                }
            });
            model.describe("login", "Login");
            model.set("login", {});

            model.action({
                signIn: function () {
                    cola.widget("formSignIn").setMessages(null);
                    if (model.get("login").validate()) {
                        loginSubmit();
                    } else {
                        showLoginMessage("用户名或密码不能为空！");
                    }
                }
            });

            function showLoginMessage(content) {
                cola.widget("formSignIn").setMessages([
                    {
                        type: "error",
                        text: content
                    }
                ]);
            }


            var loginCallback = null;
            window.login = function (callback) {
                cola.widget("loginDialog").show();
                if (callback && typeof callback === "function") {
                    return loginCallback = callback;
                } else {
                    loginCallback = null;
                }
            };
            function loginSubmit() {
                var data = model.get("login");
                cola.widget("containerSignIn").addClass("loading");
                $.ajax({
                    type: "POST",
                    url: App.prop("service.login"),
                    data: JSON.stringify(data.toJSON()),
                    contentType: "application/json"
                }).done(function (result) {
                    var callback;
                    cola.widget("containerSignIn").removeClass("loading");
                    if (!result.type) {
                        showLoginMessage(result.message);
                        return;
                    }
                    cola.widget("loginDialog").hide();
                    if (loginCallback) {
                        callback = loginCallback;
                        loginCallback = null;
                        callback();
                    }
                }).fail(function () {
                    cola.widget("containerSignIn").removeClass("loading");
                });
            }
        })();

        (function () {
            model.set("messages", {
                task: 4,
                message:12
            });
            var errorCount = 0, longPollingTimer = null;
            window.refreshMessage = function () {
                var options = {};
                if (longPollingTimer) {
                    clearTimeout(longPollingTimer);
                }
                if (App.prop("longPollingTimeout")) {
                    options.timeout = App.prop("longPollingTimeout");
                }
                $.ajax(App.prop("service.messagePull"), options).done(function (messages) {
                    if (messages) {
                        errorCount = 0;
                        for (var i = 0, len = messages.length; i < len; i++) {
                            var message = messages[i];
                            model.set("messages." + message.type, message.content);
                        }
                    }
                    if (App.prop("liveMessage")) {
                        longPollingTimer = setTimeout(refreshMessage, App.prop("longPollingInterval"));
                    }
                }).error(function (xhr, status, ex) {
                    if (App.prop("liveMessage")) {
                        if (status === "timeout") {
                            longPollingTimer = setTimeout(refreshMessage, App.prop("longPollingInterval"));
                        } else {
                            errorCount++;
                            longPollingTimer = setTimeout(refreshMessage, 5000 * Math.pow(2, Math.min(6, errorCount - 1)));
                        }
                    }
                });
            };
            longPollingTimer = setTimeout(refreshMessage, 1000);
        })();


        model.widgetConfig({
            subMenuTree: {
                $type: "tree",
                autoExpand: true,
                bind: {
                    expression: "menu in subMenu",
                    child: {
                        recursive: true,
                        expression: "menu in menu.menus"
                    }
                },
                itemClick: function (self, arg) {
                    var data, menus;
                    data = arg.item.get("data").toJSON();
                    menus = data.menus;
                    if (menus && menus.length > 0) {

                    } else {
                        App.open(data.path, data);
                        return cola.widget("subMenuLayer").hide();
                    }
                }
            },
            subMenuLayer: {
                beforeShow: function () {
                    $("#rightContainer").addClass("lock");
                },
                beforeHide: function () {
                    $("#rightContainer").removeClass("lock");
                }
            }
        });

        model.action({
            dropdownIconVisible: function (item) {
                var menus = item.get("menus"), result = false;
                if (menus && menus.entityCount > 0) {
                    result = true;
                }
                return result;
            },
            showUserSidebar: function () {
                cola.widget("userSidebar").show();
            },
            logout: function () {
                return $.ajax({
                    type: "POST",
                    url: App.prop("service.logout")
                }).done(function (result) {
                    if (result.type) {
                        return window.location.reload();
                    }
                }).fail(function () {
                    alert("退出失败，请检查网络连接！");
                });
            },
            menuItemClick: function (item) {
                var data = item.toJSON(), menus = data.menus;

                function recursive(d) {
                    if (d.menus && d.menus.length > 0) {
                        var ref = d.menus;
                        for (var i = 0, len = ref.length; i < len; i++) {
                            recursive(ref[i]);
                        }
                    } else {
                        d.menus = null;
                        d.hasChild = false;
                    }
                }

                if (menus && menus.length > 0) {
                    for (var i = 0, len = menus.length; i < len; i++) {
                        recursive(menus[i]);
                    }
                    model.set("subMenu", menus);
                    model.set("currentMenu", data);
                    cola.widget("subMenuLayer").show();
                } else {
                    model.set("subMenu", []);
                    cola.widget("subMenuLayer").hide();
                    App.open(data.path, data);
                }
            },
            hideSubMenuLayer: function () {
                cola.widget("subMenuLayer").hide();
            },
            toggleSidebar: function () {
                var className = "collapsed", $dom = $("#frameworkSidebarBox");
                $dom.toggleClass(className, !$dom.hasClass(className));
            },
            messageBtnClick: function () {
                var action = App.prop("message.action");
                if (action && typeof action === "object") {
                    App.open(action.path, action);
                }
            },
            taskBtnClick: function () {
                var action = App.prop("task.action");
                if (action && typeof action === "object") {
                    App.open(action.path, action);
                }
            }
        });
        $("#frameworkSidebar").accordion({
            exclusive: App.prop("menu.exclusive")
        }).delegate(".menu-item", "click", function () {
            $("#frameworkSidebar").find(".menu-item.current-item").removeClass("current-item");
            $fly(this).addClass("current-item");
        });
        $("#rightContainer>.layer-dimmer").on("click", function () {
            cola.widget("subMenuLayer").hide();
        });
    });

    cola.ready(function () {
        var workbench = App.prop("workbench");
        if (workbench) {
            return App.open(workbench.path, workbench);
        }
    })
})();