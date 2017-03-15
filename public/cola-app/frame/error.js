cola(function (model) {
	var waitingTime = 15;
	model.set("timer", waitingTime);
	var homePath = App.prop("mainView");
	model.set("home", homePath);
	$("#timeProgress").progress({
		total: waitingTime
	});
	var value = 1;
	setInterval(function () {
		value++;
		if (value >= waitingTime) {
			window.location = homePath;
		}
		model.set("timer", waitingTime - value);
		$("#timeProgress").progress({
			value: Math.round(value / waitingTime * 10000) / 100.00
		});
	}, 1000);
});
