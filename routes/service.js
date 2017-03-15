const express = require('express');
const router = express.Router();

const $ = require('node-httpclient');
const target = 'http://localhost/service';
const proxyMode = true;

const userDetail = {
	id: 'u0001', name: 'Alex Tong',
	avatar: '/resources/images/avatars/alex.png'
};

/**
 * 手机模块获得系统信息接口 GET
 */
router.get('/sys/info', (req, res, next) => {
	res.json({
		sysInfoRetrieved: false,
		availableVersion: '0.0.1',
		authenticated: req.session.authenticated,
		authInfo: {}
	});
});
/**
 * 桌面框架-用户登录接口 POST
 */
router.post('/account/login', (req, res, next) => {
	var body = req.body,
		result = {
			authenticated: false,
			message: '用户名或密码错误！'
		};
	if (body.userName == 'admin' && body.password == '123456') {
		result = {
			authenticated: true,
			user: userDetail
		}
		req.session.authenticated = true
	} else {
		req.session.authenticated = false
	}
	res.send(result)
});

/**
 * 桌面框架-用户登出接口 POST
 */
router.post('/account/logout', (req, res, next) => {
	req.session.authenticated = false
	res.send({type: true, message: '已安全退出！'})
});

/**
 * 桌面框架模块获取菜单信息接口 GET
 */
router.get('/menus', (req, res, next) => {
	res.send(require('./data/menu'))
});

/**
 * 桌面框架模块拉取消息接口
 */
router.get('/message/pull', (req, res, next) => {
	res.send([
		{type: 'message', content: 8},
		{type: 'task', content: 22}
	])
});


/**
 * 桌面框架模块获得用户信息接口 GET
 */
router.get('/user/detail', (req, res, next) => {
	res.send(userDetail)
});

/**
 * 请求代理配置模块
 */
if (proxyMode) {
	router.all('*', (req, res, next) => {
		$.ajax({
			async: false, type: req.method,
			url: target + req.url, data: req.body,
			headers: req.headers,
			complete: (data, status, headers) => {
				//TODO
				var k;
				for (k in headers) {
					if (headers.hasOwnProperty(k)) {
						res.setHeader(k, headers[k])
					}
				}
				res.status(status)
				if (data == null)
					res.end()
				else
					res.end(data)
			}
		})
	})
}

module.exports = router;