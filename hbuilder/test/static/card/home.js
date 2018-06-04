cola(function (model) {
	var user = App.prop("authInfo").user;
	var isTeacher = user.userType === "Teacher";

	var links = {
		courseware: {
			student: "/courseware/student/list",
			teacher: "/courseware/list",
			delay: 350
		},
		classroom: {
			student: "/listen/select",
			teacher: "/lesson/select",
			delay: 200
		},
		homework: {
			student: "/homework/task",
			teacher: "/homework/suit",
			delay: 500
		},
		chart: {
			teacher: "/chart",
			delay: 350
		}
	};
	model.set("user", user);

	if (!isTeacher) {
		model.describe("homeworkNotificationCount", {
			provider: {
				url: "/service/questionTask/getTaskNotificationCount",
				parameter: {
					userId: user.id
				}
			}
		});
	}

	model.action({
		logout: function () {
			open(cola.setting("routerContextPath") + "/shell" + App.prop("mobile.htmlSuffix"), "_self");
		},
		showAppInfo: function () {
			cola.widget("homeSidebar").show()
		},
		enterLink: function (name) {
			var authInfo = App.prop("authInfo"), link = links[name];

			if (name === "classroom") {
				if (isTeacher) {
					$.get("/service/classRoom/" + authInfo.term.id + "/load/").done(function (data) {
						model.set("classRooms", data);
					});
					$.get("/service/course/term/" + authInfo.term.id + "/teacher/" + authInfo.user.id + "/load").done(function (data) {
						model.set("courses", data);
					});
					model.widget("dialogTeacherSelectClassroom").show();
				}
				else {
					model.set("classRooms", [authInfo.classRoom]);
					model.widget("dialogStudentSelectClassroom").show();
				}
			}
			else {
				var path = isTeacher ? link.teacher : link.student;
				App.open(path);
			}
		},
		setCurrent: function (entity) {
			entity.setCurrent();
		},
		teacherEnterClassroom: function () {
			var courseId = model.get("courses#.id");
			var classRoomId = model.get("classRooms#.id");
			App.open("/lesson/classroom/" + classRoomId + ((courseId) ? ("?courseId=" + courseId) : ""));
			setTimeout(function () {
				var dialogTeacherSelectClassroom = model.widget("dialogTeacherSelectClassroom");
				if (dialogTeacherSelectClassroom) dialogTeacherSelectClassroom.hide();
			}, 600);
		},
		teacherStudentClassroom: function (classRoom) {
			setTimeout(function () {
				var classRoomId = classRoom.get("id");
				App.open("/listen/classroom/" + classRoomId);
				setTimeout(function () {
					var dialogStudentSelectClassroom = model.widget("dialogStudentSelectClassroom");
					if (dialogStudentSelectClassroom) dialogStudentSelectClassroom.hide();
				}, 600);
			}, 200);
		}
	});

	$(window).on("appmessage.home", function (evt, message) {
		var data = message.data;
		switch (message.type) {
			case "kickoff": {
				cola.alert(data.message, function () {
					model.action.logout();
				});
				break;
			}
			case "submit-answers": {
				if (isTeacher) {
					cola.NotifyTipManager.info({
						message: data.user.cname + "提交了" + data.questionTask.questionSuit.title + "的答案。",
						description: {
							tagName: "a",
							class: "state",
							href: "/question/answer/" + data.questionTask.id + "?correctMode=true",
							content: "查看答案"
						},
						showDuration: 5000
					});
				}
				break;
			}
			case "dispatch-questions": {
				if (!isTeacher) {
					cola.NotifyTipManager.info({
						message: "你收到了新的任务\"" + data.questionTask.questionSuit.title + "\"。",
						description: {
							tagName: "a",
							class: "state",
							href: "/question/answer/" + data.questionTask.id + "",
							content: "打开任务"
						},
						showDuration: 5000
					});
				}
				break;
			}
			case "correct-answers": {
				if (!isTeacher) {
					cola.NotifyTipManager.info({
						message: "\"" + data.questionTask.questionSuit.title + "\"已批改完成。",
						description: {
							tagName: "a",
							class: "state",
							href: "/question/answer/" + data.questionTask.id + "",
							content: "打开任务"
						},
						showDuration: 5000
					});
				}
				break;
			}
			case "websocket-closed": {
				model.action.logout();
				break;
			}
			case "open-task": {
				if (!isTeacher) {
					setTimeout(function () {
						model.flush("homeworkNotificationCount");
					}, 500);
				}
				break;
			}
		}
	});
	model.destroy = function () {
		$(window).off("appmessage.home");
	};

	cola.ready(function () {
		var user = App.prop("authInfo").user;


		$(".ground a.menu-item.reserve").each(function () {
			var dom = this, delay = parseInt(dom.getAttribute("delay")) || 0;
			setTimeout(function () {
				$(dom).removeClass("reserve");
			}, delay);
		});


		if (user.account.loginCount <= 1) {
			setTimeout(function () {
				cola.alert("为保证账户安全，请修改密码！");
			},2000);
		}

	});

});