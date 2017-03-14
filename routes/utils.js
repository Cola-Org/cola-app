module.exports = {
	getUserAgentInfo: function (req) {
		var uaInfo = req.data.uaInfo;
		if (!uaInfo) {
			var ua = req.headers["user-agent"] || "";
			var match = ua.match(/msie ([\d.]+)/i), msie = 0, weixin = 0;
			if (match) {
				msie = parseFloat(match[1]) || -1;
			}
			else if (ua.match(/trident\/7\./i)) {
				msie = 11;
			}
			else if (ua.match(/micromessenger\/([\d.]+)/i)) {
				weixin = true;
			}

			uaInfo = {
				mobile: ua.match(/iPhone|Android/),
				oldIE: msie && msie < 10,
				weixin: weixin
			};

			req.data.uaInfo = uaInfo;
		}
		return uaInfo;
	}
};