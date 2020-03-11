import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: { //全局变量定义处
		serverUrl: '', //服务器地址
		userInfo: {}, //用于存放用户账户数据
		fgdtlitem: [],
		baritem: [],
		scanerrordata: [],
		languageData: [],
	},
	mutations: {
		setBaseUrl(state, provider) {
			state.serverUrl = provider;
			uni.setStorage({
				key: 'baseUrl',
				data: provider
			})
		},
		login(state, provider) {
			state.userInfo = provider;
			uni.setStorage({
				key: 'userInfo',
				data: provider
			})
		},
		initdata(state, provider) {
			state.fgdtlitem = provider.fgdtlitem;
			state.baritem = provider.baritem;
			uni.setStorage({
				key: 'scanbar',
				data: provider
			})
		},
		scanerrorlog(state, provider) {
			state.scanerrordata = provider;
			uni.setStorage({
				key: 'scanerror',
				data: provider
			})
		},
		loadmorelanguage(state, provider) {
			state.languageData = provider;
			uni.setStorage({
				key: 'morelanguage',
				data: provider
			})
		}
	}
})

export default store
