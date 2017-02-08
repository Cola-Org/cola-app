cola(function (model) {
	model.set("channels", App.channels);
	model.action({
		getSubViewName: function(name) {
			return "subView" + cola.util.capitalize(name);
		},
		onClick: function(channel){
				App.open(channel.get("path"));
		}
	});

});