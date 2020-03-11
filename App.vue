<script>
import { mapMutations } from 'vuex';
export default {
	methods: {
		...mapMutations(['setBaseUrl', 'login', 'initdata', 'scanerrorlog', 'loadmorelanguage'])
	},
	onLaunch: function() {
		console.log('App Launch');
		uni.getStorage({
			key: 'baseUrl',
			success: res => {
				this.setBaseUrl(res.data);
			}
		});
		uni.getStorage({
			key: 'userInfo',
			success: res => {
				this.login(res.data);
			}
		});
		uni.getStorage({
			key: 'scanbar',
			success: res => {
				this.initdata(res.data);
			}
		});
		uni.getStorage({
			key: 'scanerror',
			success: res => {
				this.scanerrorlog(res.data);
			}
		});
		uni.getStorage({
			key: 'morelanguage',
			success: res => {
				this.loadmorelanguage(res.data);
			}
		});
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style>
@import './components/icon.css';
/*每个页面公共css */
/* uni-app默认全局使用flex布局。因为flex布局有利于跨更多平台，尤其是采用原生渲染的平台。如不了解flex布局，请参考http://www.w3.org/TR/css3-flexbox/。如不使用flex布局，请删除或注释掉本行。*/
body,
page {
	min-height: 100%;
	display: flex;
}

/* #ifdef MP-BAIDU */
page {
	width: 100%;
	height: 100%;
	display: block;
}

swan-template {
	width: 100%;
	min-height: 100%;
	display: flex;
}

/* #endif */

/* 原生组件模式下需要注意组件外部样式 */
m-input {
	width: 100%;
	min-height: 100%;
	display: flex;
}

.content {
	display: flex;
	flex: 1;
	flex-direction: column;
	background-color: #ffffff;
	padding: 20upx;
}

.input-group {
	background-color: #ffffff;
	margin-top: 40upx;
	position: relative;
}

.input-group::before {
	position: absolute;
	right: 0;
	top: 0;
	left: 0;
	height: 1upx;
	content: '';
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	background-color: #c8c7cc;
}

.input-group::after {
	position: absolute;
	right: 0;
	bottom: 0;
	left: 0;
	height: 1upx;
	content: '';
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	background-color: #c8c7cc;
}

.input-row {
	display: flex;
	flex-direction: row;
	position: relative;
}

.input-row .title {
	width: 20%;
	height: 50upx;
	min-height: 50upx;
	padding: 15upx 0;
	padding-left: 30upx;
	line-height: 50upx;
}

.input-row.border::after {
	position: absolute;
	right: 0;
	bottom: 0;
	left: 15upx;
	height: 1upx;
	content: '';
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	background-color: #c8c7cc;
}

.btn-row {
	margin-top: 50upx;
	padding: 20upx;
}

.div-vertical {
	width: 1px;
	height: 100%;
	border-right: 1px solid #e1e1e1;
}

.div-horizontal {
	width: 100%;
	height: 1px;
	border-bottom: 1px solid #e1e1e1;
}

button.primary {
	background-color: #0faeff;
}
.uni-popup__wrapper-box {
	border-radius: 9px;
	padding: 0 !important;
	background-color: #e6e6e6;
	width: 100%;
}
.fab-circle .icon-jia {
	color: #c7c7c7 !important;
}
.uni-badge-error {
	background-color: #e4393e !important;
}
.uni-numbox:after {
	border: none !important;
}
.uni-numbox {
	height: 24px !important;
}
.uni-numbox__minus,
.uni-numbox__plus {
	width: 26px !important;
	line-height: 26px !important;
	background-color: #ffffff !important;
}
.uni-numbox__value {
	width: 36px !important;
}
uni-input {
	font-size: 16px !important;
}
.uni-numbox__value:after {
	border: none !important;
	height: 24px !important;
}
.uni-numbox__value {
	border: 1px solid #e6e6e6;
	border-radius: 4px;
	height: 24px !important;
}
.uni-input-wrapper {
	height: 24px !important;
}

/* 控制uni-card全局样式 */
.uni-card {
	margin: 0px 8px 8px !important;
}
.uni-card__footer {
	padding: 4px 10px !important;
}
.uni-card__content--pd {
	padding: 4px 10px !important;
}
</style>
