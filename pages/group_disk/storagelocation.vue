<template>
	<view class="mcontent">
		<view class="rheader">
			<view class="tiptext">{{ isStore }}</view>
			<view class="input-row"><m-input @input="bindChange()" class="m-input" type="text" v-model="ipadd" placeholder="请扫描储位条码"></m-input></view>
		</view>
		<view class="vlist"><img class="tipimg" src="/static/img/saomt_img@3x.png" /></view>
	</view>
</template>

<script>
import mInput from '../../components/m-input.vue';
import { request } from '@/api/http';
import helper from '../../common/helper.js';
import { mapState, mapMutations } from 'vuex';

export default {
	components: {
		mInput
	},
	computed: {
		...mapState(['userInfo', 'languageData'])
	},
	data() {
		return {
			ipadd: '',
			stkcode: '',
			userid: '',
			username: '',
			serverUrl: '',
			isStore: ''
		};
	},
	onLoad(option) {
		var title = helper.getDescribe(this, 'initial_set');
		isStore = helper.getDescribe(this, 'is_store'); //储位
		uni.setNavigationBarTitle({
			title: title
		});
		this.serverUrl = window.location.protocol + '//' + window.location.host;
		this.moreLanguage();
		if (option.type == 1) {
			//来自本地跳转
			this.stkcode = this.userInfo.stkcode; //仓库代号
			this.userid = this.userInfo.userId;
			this.username = this.userInfo.userName;
		} else {
			//来自原生PDA跳转
			this.stkcode = option.code; //仓库代号
			this.userid = option.userid;
			this.username = option.username;
		}
	},
	methods: {
		...mapMutations(['setBaseUrl', 'login', 'loadmorelanguage']),
		moreLanguage() {
			uni.showNavigationBarLoading();
			request(this.serverUrl + '/sfapi/BaseDataInfo/GetRecRst_PDA_F19', 'POST', {})
				.then(res => {
					uni.hideNavigationBarLoading();
					if (res.success) {
						this.loadmorelanguage(res.data.itemPRC);
					} else {
						uni.showToast({
							icon: 'none',
							title: res.errormsg
						});
					}
				})
				.catch(e => {
					uni.hideNavigationBarLoading();
					uni.showToast({
						icon: 'none',
						title: '请求异常'
					});
				});
		},
		bindChange() {
			var data = {
				sf_action: 'TrayPDAGrp_FGI_ValPlace',
				stkcode: this.stkcode,
				fplacecode: this.ipadd,
				slanguage: this.$language,
				usercode: this.userid,
				username: this.username
			};
			uni.showNavigationBarLoading();
			request(this.serverUrl + '/sfapi/TrayPDAGrp_FGI/TrayPDAGrp_FGI_ValPlace', 'POST', data)
				.then(res => {
					uni.hideNavigationBarLoading();
					if (res.Succeed) {
						if (res.Data.success) {
							this.setBaseUrl(this.serverUrl);
							let obj = {};
							obj.userId = this.userid;
							obj.userName = this.username;
							obj.stkcode = this.stkcode;
							this.login(obj);
							uni.navigateTo({
								url: '../group_disk/tray?barcode=' + this.ipadd
							});
						} else {
							uni.showToast({
								icon: 'none',
								title: res.Data.errormsg
							});
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: res.ErrorMessage
						});
					}
				})
				.catch(e => {
					uni.hideNavigationBarLoading();
					uni.showToast({
						icon: 'none',
						title: '请求异常'
					});
				});
		}
	}
};
</script>

<style>
.mcontent {
	display: flex;
	flex: 1;
	flex-direction: column;
}
.m-input {
	font-size: 15px;
	border-radius: 6px;
	height: 44px;
	padding-left: 20px;
	padding-right: 70px;
	border: 1px solid #e5e5e5;
}
.rheader {
	padding: 38px 24px;
}
.tiptext {
	font-size: 16px;
	color: #303030;
	margin-bottom: 10px;
}
.vlist {
	width: 100%;
	text-align: center;
	padding-top: 80px;
}
.tipimg {
	width: 218px;
	height: 266px;
}
</style>
