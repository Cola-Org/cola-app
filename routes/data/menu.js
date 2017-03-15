module.exports = [
	{
		icon: "icon browser", label: "框架页面",
		menus: [
			{
				icon: "icon sign in", label: "登录界面"
			},
			{
				icon: "icon help", label: "404界面"
			},
			{
				icon: "icon info circle", label: "500界面"
			}
		]
	},

	{
		icon: "icon sitemap", label: "多级菜单演示",
		menus: [
			{
				icon: "icon adjust", label: "新窗口",
				blank: true, path: "http://baidu.com",
			},
			{
				icon: "icon crosshairs", label: "内容设置",
				menus: [
					{label: "导航设置"},
					{
						label: "分类管理",
						menus: [
							{label: "用户列表"},
							{label: "用户组"},
							{label: "职位管理"}
						]
					},
					{label: "专题管理"}
				]
			}
		]
	}
];
