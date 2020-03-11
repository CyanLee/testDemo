<template>
	<view class="mcontent">
		<view class="rheader">
			<view class="tiptext">托盘</view>
			<view class="input-row"><m-input class="m-input" type="text" v-model="ipadd" placeholder="请扫描托盘条码" @input="bindChange"></m-input></view>
		</view>
		<view class="vlist"><img class="tipimg" src="/static/img/saomt_img@3x.png" /></view>
	</view>
</template>

<script>
import mInput from '../../components/m-input.vue';
import { request } from '@/api/http';
import { mapState, mapMutations } from 'vuex';

export default {
	components: {
		mInput
	},
	computed: {
		...mapState(['serverUrl', 'userInfo'])
	},
	data() {
		return {
			ipadd: '',
			barCode: ''
		};
	},
	onLoad(option) {
		this.barCode = option.barcode;
	},
	methods: {
		...mapMutations(['initdata']),
		bindChange() {
			var data = {
				sf_action: 'TrayPDAGrp_FGI_ValTray',
				fstktraycode: this.ipadd, //托盘代号
				ftraygrptype: '2', //组盘类型
				fstkinlogno: this.barCode, //入库单
				slanguage: this.$language,
				usercode: this.userInfo.userId,
				username: this.userInfo.userName
			};
			uni.showNavigationBarLoading();
			request(this.serverUrl + '/sfapi/TrayPDAGrp_FGI/TrayPDAGrp_FGI_ValTray', 'POST', data)
				.then(res => {
					uni.hideNavigationBarLoading();
					if (res.Succeed) {
						if (res.Data.success) {
							var obj = {};
							obj.fgdtlitem = res.Data.data.fgdtlitem;
							obj.baritem = res.Data.data.baritem;
							this.initdata(obj);
							uni.navigateTo({
								url: '../group_disk/gdisklist?barcode=' + this.ipadd + '&type=2' + '&placecode=' + this.barCode
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
