<template>
	<view class="mcontent">
		<view class="rheader">
			<view class="input-row"><m-input class="m-input" type="text" v-model="ipadd" placeholder="请扫描条码" @onChange="bindChange"></m-input></view>
			<view>
				<view class="input-row" style="padding: 24px 0;font-size: 16px;color: #303030 ;">
					<navigator :url="'successbarcode?barcode=' + barCode + '&type=' + type + '&placecode=' + placecode" style="width: 50%;text-align: center;">
						<view style="color: #31D06B;font-weight: bold;font-size: 30px;">{{ fgdtlitem.length }}</view>
						<view>扫描成功</view>
					</navigator>
					<navigator url="scanlog" style="width: 50%;text-align: center;">
						<view style="color: #EB433A;font-weight: bold;font-size: 30px;">{{ scanerrordata.length }}</view>
						<view>扫描失败</view>
					</navigator>
				</view>
			</view>
		</view>
		<view class="vlist" v-if="successShow">
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
		<view class="vlist errerimg" v-else>
			<img class="tipimg" src="/static/img/cuow_icon@2x.png" />
			<view style="color: #888888;font-size: 18px;margin-top: 10px;">{{ errorText }}</view>
		</view>
		<view class="vbar">
			<button class="submit-button" type="warn" @tap="submit()">完成</button>
			<view class="more" @tap="more()"><img class="moreimg" src="/static/img/navbar_mobile_light@2x.png" /></view>
			<view class="moreview" v-if="moreShow">
				<view class="input-row" style="margin-bottom: 19px;">
					<view><img style="width: 20px;height: 22px;margin-right: 11px;" src="/static/img/shanc_icon@2x.png" /></view>
					<navigator :url="'scandelete?barcode=' + barCode">删除</navigator>
				</view>
				<view class="input-row">
					<view><img style="width: 20px;height: 20px;margin-right: 11px;" src="/static/img/qux_icon@2x.png" /></view>
					<view @tap="openPopup">取消扫描</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="center" class="cpopup">
			<view style="text-align: center;font-size: 16px;color: #303030;margin-top: 39px;margin-bottom: 22px;">是否签退</view>
			<view class="input-row popup-row" style="color: #E4393E;text-align: center;">
				<text style="width: 35%;" @tap="cancel">否</text>
				<text style="width: 30%;"></text>
				<text style="width: 35%;" @tap="confirm">是</text>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import mInput from '../../components/m-input.vue';
import { request } from '@/api/http';
import uniPopup from '@/components/uni-popup.vue';
import { mapState, mapMutations } from 'vuex';

export default {
	components: {
		mInput,
		uniPopup
	},
	computed: {
		...mapState(['serverUrl', 'userInfo', 'fgdtlitem', 'baritem', 'scanerrordata'])
	},
	data() {
		return {
			ipadd: '',
			moreShow: false,
			type: 1,
			barCode: '',
			placecode: '',
			successShow: true,
			errorText: '条码未打印'
		};
	},
	onLoad(option) {
		this.barCode = option.barcode;
		this.placecode = option.placecode;
		this.type = option.type;
		if (this.type == 2) {
			uni.setNavigationBarTitle({
				title: '入库单组盘'
			});
		}
		if (this.type == 0) {
			uni.setNavigationBarTitle({
				title: '生产组盘'
			});
		}
	},
	onShow() {
		this.moreShow = false;
	},
	methods: {
		...mapMutations(['initdata', 'scanerrorlog']),
		bindChange() {
			var data = {
				sf_action: 'TrayPDAGrp_FGI_ParseBar',
				fbarcode: this.ipadd, //条码代号
				fstktraycode: this.barCode, //托盘代号
				fstkinlogno: this.barCode, //入库单号
				ftraygrptype: this.type, //组盘类型
				fplacecode: this.placecode, //储位代号
				slanguage: this.$language,
				usercode: this.userInfo.userId,
				username: this.userInfo.userName
			};
			uni.showNavigationBarLoading();
			request(this.serverUrl + '/sfapi/TrayPDAGrp_FGI/TrayPDAGrp_FGI_ParseBar', 'POST', data)
				.then(res => {
					uni.hideNavigationBarLoading();
					if (res.Succeed) {
						if (res.Data.success) {
							var fgdtldata = this.fgdtlitem;
							var bardata = this.baritem;
							bardata.push(res.Data.data.baritem[0]);
							res.Data.data.fgdtlitem.forEach(item => {
								var flag = true;
								fgdtldata.forEach(res => {
									if (res.fgoodsid == item.fgoodsid && res.fstkordno == item.fstkordno) {
										res.fpackqty += item.fpackqty;
										flag = false;
									}
								});
								if (flag) {
									fgdtldata.push(item);
								}
							});

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
						this.successShow = false;
						this.errorText = res.ErrorMessage;
						var errordata = this.scanerrordata;
						var flag = true;
						errordata.forEach(item => {
							if (item.barcode == this.ipadd) {
								flag = false;
							}
						});
						if (flag) {
							var logObj = {};
							logObj.barcode = this.ipadd;
							logObj.createtime = this.getDateFormat();
							logObj.errormsg = res.ErrorMessage;
							errordata.push(logObj);
							this.scanerrorlog(errordata);
						}
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
		openPopup() {
			this.$refs.popup.open();
			this.moreShow = false;
		},
		cancel() {
			this.$refs.popup.close();
		},
		confirm() {
			var data = {
				sf_action: 'TrayPDAGrp_FGI_CancelTrayScan',
				fstktraycode: this.barCode, //托盘代号
				slanguage: this.$language,
				usercode: this.userInfo.userId,
				username: this.userInfo.userName
			};
			uni.showNavigationBarLoading();
			request(this.serverUrl + '/sfapi/TrayPDAGrp_FGI/TrayPDAGrp_FGI_CancelTrayScan', 'POST', data)
				.then(res => {
					uni.hideNavigationBarLoading();
					if (res.Succeed) {
						if (res.Data.success) {
							//缓存初始化
							var obj = {};
							obj.fgdtlitem = [];
							obj.baritem = [];
							this.initdata(obj);
							this.scanerrorlog([]);
							if (this.type == 0) {
								uni.redirectTo({
									url: '../group_disk/sctray?type=1'
								});
							}
							if (this.type == 1) {
								uni.redirectTo({
									url: '../group_disk/tray?barcode=' + this.placecode
								});
							}
							if (this.type == 2) {
								uni.redirectTo({
									url: '../group_disk/rktray?barcode=' + this.placecode
								});
							}
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
		submit() {
			var data = {
				sf_action: 'TrayPDAGrp_FGI_SaveBar',
				fstktraycode: this.barCode, //托盘代号
				fstkinlogno: this.barCode, //入库单号
				ftraygrptype: this.type, //组盘类型
				fplacecode: this.placecode, //储位代号
				slanguage: this.$language,
				usercode: this.userInfo.userId,
				username: this.userInfo.userName
			};
			uni.showNavigationBarLoading();
			request(this.serverUrl + '/sfapi/TrayPDAGrp_FGI/TrayPDAGrp_FGI_SaveBar', 'POST', data)
				.then(res => {
					uni.hideNavigationBarLoading();
					if (res.Succeed) {
						if (res.Data.success) {
							//缓存初始化
							var obj = {};
							obj.fgdtlitem = [];
							obj.baritem = [];
							this.initdata(obj);
							this.scanerrorlog([]);
							if (this.type == 0) {
								//生产组盘
								uni.redirectTo({
									url: '../group_disk/sctray?type=1'
								});
							}
							if (this.type == 1) {
								//期初组盘
								uni.redirectTo({
									url: '../group_disk/storagelocation?type=1'
								});
							}
							if (this.type == 2) {
								//入库单组盘
								uni.redirectTo({
									url: '../group_disk/warehousing?type=1'
								});
							}
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
		more() {
			this.moreShow = !this.moreShow;
		},
		getDateFormat() {
			var myDate = new Date();
			var year = myDate.getFullYear();
			var month = myDate.getMonth() + 1;
			var date = myDate.getDate();

			var h = myDate.getHours();
			var m = myDate.getMinutes();
			var s = myDate.getSeconds();
			var now = year + '-' + this.getNow(month) + '-' + this.getNow(date) + ' ' + this.getNow(h) + ':' + this.getNow(m) + ':' + this.getNow(s);
			return now;
		},
		getNow(s) {
			return s < 10 ? '0' + s : s;
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
	padding: 38px 24px 0 24px;
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
	margin-top: 210px;
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
.errerimg {
	text-align: center;
	padding-top: 118px;
}
.tipimg {
	width: 60px;
	height: 60px;
}
.popup-row {
	height: 50px;
	line-height: 50px;
}
.cpopup {
	padding: 0 auto;
}
</style>
