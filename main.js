import Vue from 'vue'
import App from './App'
//多语言
import VueI18n from 'vue-i18n'
import store from './store'
import constant from '@/api/constant.js'
import './fonts/iconfont.css'
import uniFab from './components/uni-fab.vue';
import request from './common/request.js'
Vue.component('uni-fab', uniFab)
Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.GLOBAL = constant
Vue.prototype.$request = request
Vue.prototype.$language = 'simplified chinese'

App.mpType = 'app'
//--------------下面这一段仅在手机上有效, 浏览器运行时屏蔽-----------------
// 重写toast方法如果内容为 ‘再按一次退出应用’ 就隐藏应用，其他正常toast  
// plus.nativeUI.toast = (function(str) {
// 	if (str == '再按一次退出应用') {
// 		plus.runtime.quit()
// 		return false;
// 	}
// });
//--------------以上这一段仅在手机上有效, 浏览器运行时屏蔽-----------------
const app = new Vue({
	store,
	...App
})
app.$mount()
