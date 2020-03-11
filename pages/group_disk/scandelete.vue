<template>
	<view class="mcontent">
		<view class="rheader">
			<view class="input-row"><m-input class="m-input" type="text" v-model="ipadd" placeholder="请扫描条码" @onChange="bindChange"></m-input></view>
		</view>
		<view class="vlist">
			<view v-for="item in fgdtlitem" style="padding: 14px 14px;border-bottom: 1px solid #E5E5E5;" class="input-row">
				<view style="width: 80%;">
					<view style="color: #303030;font-size: 18px;font-weight: bold;">{{ item.fgoodsname }}</view>
					<view style="color: #888888;font-size: 14px;margin-top: 8px;">规格：{{ item.fsizedesc }}</view>
					<view style="color: #888888;font-size: 14px;margin-top: 4px;">订单：{{ item.fstkordno }}</view>
					<view style="color: #888888;font-size: 14px;margin-top: 4px;">品号：{{ item.fgoodscode }}</view>
				</view>
				<view style="text-align: right;width: 20%;font-size: 20px;color: #31D06B;font-weight: bold;line-height: 90px;">x{{ item.fpackqty }}</view>
			</view>
		</view>
		<!-- <view class="vbar">
			<button class="submit-button" type="warn" @tap="submit()">完成</button>
			<view class="more" @tap="more()"><img class="moreimg" src="/static/img/navbar_mobile_light@2x.png" /></view>
			<view class="moreview" v-if="moreShow">
				<view class="input-row" style="margin-bottom: 19px;">
					<view><img style="width: 20px;height: 22px;margin-right: 11px;" src="/static/img/shanc_icon@2x.png" /></view>
					<view>删除</view>
				</view>
				<view class="input-row">
					<view><img style="width: 20px;height: 20px;margin-right: 11px;" src="/static/img/qux_icon@2x.png" /></view>
					<view>取消扫描</view>
				</view>
			</view>
		</view> -->
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
		...mapState(['serverUrl', 'userInfo', 'fgdtlitem', 'baritem'])
	},
	data() {
		return {
			ipadd: '',
			moreShow: false,
			barCode: '',
			bardata: [
				{
					fgoodsname: '1403-02B床',
					fsizedesc: '3600*2500*1600',
					fstkordno: 'ORD20191120125',
					fgoodscode: 'CP12015685',
					fpackqty: 1
				},
				{
					fgoodsname: '1403-02B床',
					fsizedesc: '3600*2500*1600',
					fstkordno: 'ORD20191120125',
					fgoodscode: 'CP12015685',
					fpackqty: 1
				},
				{
					fgoodsname: '1403-02B床',
					fsizedesc: '3600*2500*1600',
					fstkordno: 'ORD20191120125',
					fgoodscode: 'CP12015685',
					fpackqty: 1
				},
				{
					fgoodsname: '1403-02B床',
					fsizedesc: '3600*2500*1600',
					fstkordno: 'ORD20191120125',
					fgoodscode: 'CP12015685',
					fpackqty: 1
				}
			]
		};
	},
	onLoad(option) {
		this.barCode = option.barcode;
	},
	methods: {
		...mapMutations(['initdata']),
		bindChange() {
			var data = {
				sf_action: 'TrayPDAGrp_FGI_DelBar',
				fbarcode: this.ipadd, //条码代号
				fstktraycode: this.barCode, //托盘代号
				slanguage: this.$language,
				usercode: this.userInfo.userId,
				username: this.userInfo.userName
			};
			uni.showNavigationBarLoading();
			request(this.serverUrl + '/sfapi/TrayPDAGrp_FGI/TrayPDAGrp_FGI_DelBar', 'POST', data)
				.then(res => {
					uni.hideNavigationBarLoading();
					if (res.Succeed) {
						if (res.Data.success) {
							var fgdtldata = this.fgdtlitem;
							var bardata = this.baritem;
							res.Data.data.fgdtlitem.forEach(item => {
								fgdtldata.forEach(res => {
									if (res.fgoodsid == item.fgoodsid && res.fstkordno == item.fstkordno) {
										res.fpackqty += item.fpackqty;
									}
								});
							});
							var ind = -1;
							bardata.forEach((item, index) => {
								if (item.fbarcode == res.Data.data.baritem[0].fbarcode) {
									ind = index;
								}
							});
							bardata.splice(ind, 1);
							var obj = {};
							obj.fgdtlitem = fgdtldata;
							obj.baritem = bardata;
							this.initdata(obj);
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
		},
		submit() {},
		more() {
			this.moreShow = !this.moreShow;
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
	padding: 20px 24px;
	z-index: 9999;
	position: fixed;
	right: 0px;
	left: 0;
	background-color: #ffffff;
	border-bottom: 16px solid #f5f5f5;
}
.vlist {
	width: 100%;
	margin-bottom: 80px;
	margin-top: 103px;
}
.vbar {
	z-index: 9998;
	position: fixed;
	right: 0px;
	left: 0;
	bottom: 0;
}
.submit-button {
	height: 44px;
	line-height: 42px;
	font-size: 16px;
}
.more {
	position: absolute;
	right: 0;
	top: 0;
	width: 42px;
	height: 44px;
	border-left: 1px solid #ffffff;
	padding-left: 12px;
	padding-top: 7px;
}
.moreimg {
	width: 30px;
	height: 30px;
}
.moreview {
	position: absolute;
	right: 0;
	top: -111px;
	background-color: #ffffff;
	padding: 20px 14px;
	color: #888888;
	font-size: 16px;
	border-left: 1px solid #d5d5d5;
	border-top: 1px solid #d5d5d5;
}
</style>
