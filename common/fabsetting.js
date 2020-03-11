import helper from './helper.js';
const fabfiled = {
	horizontal: 'right',
	vertical: 'bottom',
	direction: 'vertical',
	pattern: {
		color: '#888888',
		backgroundColor: '#FFFFFF',
		selectedColor: '#000000',
		buttonColor: "#FFFFFF"
	},
	content: [{
			iconPath: '/static/img/hjzg.png',
			selectedIconPath: '/static/componentHL.png',
			text: '呼叫主管',
			active: false
		},
		{
			iconPath: '/static/img/qlbj.png',
			selectedIconPath: '/static/componentHL.png',
			text: '缺料报警',
			active: false
		},
		{
			iconPath: '/static/img/hjjx.png',
			selectedIconPath: '/static/componentHL.png',
			text: '呼叫机修',
			active: false
		},
		{
			iconPath: '/static/img/hjpg.png',
			selectedIconPath: '/static/apiHL.png',
			text: '呼叫品管',
			active: false
		},
		{
			iconPath: '/static/img/signicon.png',
			selectedIconPath: '/static/templateHL.png',
			text: '签到',
			active: false
		}
	]
}

const trigger = function(e, _this) {
	console.log(e);
	if (e.index == 4) {
		helper.tosgin(_this);
	}
	// uni.navigateTo({
	// 	url: '../login/signin'
	// });
}

export default {
	fabfiled,
	trigger
}
