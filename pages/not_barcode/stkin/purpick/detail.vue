<template>
	<view style="width: 100%;">
		<view class="nofi_view">
			<view>
				<text class="title_text">到货通知单：</text>
				<text class="des_text" :style="{ color: orderNoStyle(mst.fifcolorred) }">{{ mst.fpgno }}</text>
			</view>
			<!-- <img src="/static/img/scan.png" style="width: 26px; height: 26px;" @tap="SVScanCode" /> -->
		</view>
		<view class="nofi_view">
			<view>
				<text class="title_text">供应商：</text>
				<text class="des_text">{{ mst.fprvnname }}</text>
			</view>
		</view>
		<view class="nofi_view" @tap="GoToSelectCondition(1, mst.fdeptcode, {})">
			<view>
				<text class="title_text">收货部门：</text>
				<text class="des_text">{{ mst.fdeptname || '' }}</text>
			</view>
			<img src="/static/img/gonext.png" style="width: 8px;height: 12px;" />
		</view>
		<view style="width: 100%; height: auto;"><uniSearchBar radius="5" placeholder="品号/品号" clearButton="auto" cancelText="" @confirm="searchResponse" /></view>

		<view style="margin-bottom: 110px;">
			<checkbox-group @change="checkboxListChange">
				<view v-for="(value, key) in dataSource" :key="key">
					<uniCard :is-shadow="true" :show-arrow="false" note="true">
						<view style="display:flex;flex-direction:column;"></view>
						<view style="display: flex;">
							<checkbox :value="value.fsno.toString()" :checked="value.fsel === '1'"></checkbox>
							<text class="des_text" style="margin-top: 3px;">{{ `${value.fsno}.  ${value.fgoodscode}` }}</text>
							<text class="title_text inline_text" style="margin-top: 3px;margin-left: 8px;">{{ value.fgoodsname || '' }}</text>
						</view>

						<view style="display: flex;margin-top: 0px;justify-content: space-between;">
							<view>
								<text class="des_text">采购单：</text>
								<text class="title_text inline_text">{{ value.fpurno }}</text>
							</view>
							<view>
								<text class="title_text">到货数：</text>
								<text style="color: #BD2C00;font-size: 16px;">{{ value.fcanrecqty }}</text>
							</view>
						</view>

						<view style="display: flex;margin-top: 0px;">
							<text class="des_text">项目：</text>
							<text class="title_text" style="margin-right: 5px;">{{ value.fprjno || '' }}</text>
							<text class="title_text inline_text">{{ value.fprjname || '' }}</text>
						</view>

						<view
							v-if="value.fiflvlmng !== '0'"
							style="display: flex;align-items: center;margin-top: 0px;width: 45%;"
							@tap="value.fiflvlmng === '2' ? '' : conditionsSelect(key, 0)"
						>
							<text class="des_text">等级：</text>
							<sfCard :title="value.flvlname" :disable="value.fiflvlmng === '2'"></sfCard>
						</view>

						<view v-if="fIfUsePlace == 1" style="flex: 1;display: flex;align-items: center;" @tap="fifsupper == 0 ? '' : conditionsSelect(key, 1)">
							<text class="des_text">储位：</text>
							<sfCard style="width: 100%;" :title="value.fplacecode || ''" :disable="fifsupper == 0"></sfCard>
						</view>

						<template v-slot:footer>
							<view style="display: flex;align-items: center;justify-content: flex-end;">
								<view style="display: flex;align-items: center;">
									<text class="title_text" style="margin-left: 10px;text-align: right;">实收：</text>
									<sfCard cardType="1">
										<input
											:id="key"
											class="uni-input"
											style="display: inline;"
											@input="inputChange"
											placeholder="请输入"
											v-model="value.frecqtyofinvunit"
											type="digit"
										/>
									</sfCard>
								</view>
								<view style="display: flex;align-items: center;">
									<text class="title_text" style="margin-left: 5px;">/</text>
									<text style="color: #BD2C00;font-size: 16px;">{{ value.fcanoverrecqty }}</text>
									<text class="title_text" style="margin-left: 5px;">{{ value.finvunitname }}</text>
								</view>
							</view>
						</template>
					</uniCard>
				</view>
			</checkbox-group>
		</view>

		<view style="position: fixed;bottom: 0px;left: 0px;right: 0px;background: #ffffff;z-index: 999;">
			<view style="display: flex;align-items: center;margin-bottom: 12px;">
				<checkbox-group @change="allSelectCheckBox"><checkbox style="margin-left: 15px;" value="1" :checked="isAllSelect"></checkbox></checkbox-group>
				<text class="des_text" style="margin-left: 20px;">合计：{{ totalMoney }}</text>
			</view>

			<view style="display: flex;align-items: center;margin-bottom: 12px;background: #ffffff;">
				<button style="background: #669900;color: #ffffff;width: 40%;" @tap="clickCacheBtn">暂存</button>
				<button type="warn" style="color: #ffffff;width: 40%;" @tap="clickFinshBtn">完成</button>
			</view>
		</view>
	</view>
</template>

<script>
import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue';
import uniCard from '@/components/uni-card/uni-card.vue';
import sfCard from '@/components/sf-card/sf-card.vue';
import { dateUtils } from '@/common/util.js';
import { PurPickRc_GetPGItem, PurPickRc_Save, PurPickRc_SaveTemp, PurPickRc_Unlock } from '@/api/api.js';
import { requestHepler } from '@/api/http.js';
import calc from '@/common/calc.js';
import { NOFI_SAVEFINSH_BILL } from '@/common/notificationKey.js';
export default {
	components: {
		uniSearchBar,
		uniCard,
		sfCard
	},
	data() {
		return {
			mst: {},
			dataSource: [],
			originDataSource: [], //源头数据
			orderNo: '', //接收上一个界面传来的参数
			isAllSelect: false, //是否全选
			totalMoney: 0, //总金额
			searchText: '', //搜索字符
			fIfUsePlace: 0, //是否启用储位
			fifsupper: 0 //储位是否可以编辑
		};
	},
	methods: {
		getDetail(orderNo) {
			requestHepler({
				url: PurPickRc_GetPGItem,
				addStkcode: true,
				data: {
					pgno: orderNo
				}
			}).then(res => {
				if (res.mst && res.mst.length > 0) {
					this.mst = res.mst[0];
				}
				this.dataSource = res.item;
				this.originDataSource = res.item;
				this.initCalculateTotal();
			});
		},
		//列表checkBox
		checkboxListChange(res) {
			const values = res.detail.value;
			let isAlllSelect = true;
			for (let i = 0; i < this.dataSource.length; i++) {
				const item = this.dataSource[i];
				if (values.includes(item.fsno.toString())) {
					this.$set(item, 'fsel', '1');
				} else {
					this.$set(item, 'fsel', '0');
					isAlllSelect = false;
				}
			}
			this.isAllSelect = isAlllSelect;
			this.calculateTotal();
		},
		//全选check
		allSelectCheckBox(res) {
			const values = res.detail.value;
			if (values.length > 0) {
				this.isAllSelect = true;
				this.setAllSelect(true);
			} else {
				this.isAllSelect = false;
				this.setAllSelect(false);
			}
		},
		//全选和反选
		setAllSelect(isSelect) {
			console.log('全选触发');
			for (let i = 0; i < this.dataSource.length; i++) {
				const item = this.dataSource[i];
				this.$set(item, 'fsel', isSelect ? '1' : '0');
			}
			this.calculateTotal();
		},
		//计算合计数
		calculateTotal() {
			let frecqtyofinvunit = 0;
			for (let i = 0; i < this.dataSource.length; i++) {
				const item = this.dataSource[i];
				if (item.fsel === '1') {
					frecqtyofinvunit = calc.accAdd(frecqtyofinvunit, item.frecqtyofinvunit);
				}
			}
			this.totalMoney = frecqtyofinvunit;
		},
		//首次获取到数据的时候计算全选按钮和合计数
		initCalculateTotal() {
			let frecqtyofinvunit = 0;
			let isAllSelect = true;
			for (let i = 0; i < this.dataSource.length; i++) {
				const item = this.dataSource[i];
				if (item.fsel === '1') {
					frecqtyofinvunit = calc.accAdd(frecqtyofinvunit, item.frecqtyofinvunit);
				} else {
					isAllSelect = false;
				}
			}
			this.totalMoney = frecqtyofinvunit;
			this.isAllSelect = isAllSelect;
		},

		inputChange(res) {
			//坑，键盘类型为number或者digit时输入小数点此方法不会回调
			let itemValue = this.dataSource[res.target.id];
			const valueTager = calc.clearNoNum(res.target.value, itemValue.finvdecimal);
			if (calc.comAGreaterB(valueTager, itemValue.fcanoverrecqty)) {
				//这里需要特别注意，不用延迟修改会没有效果
				setTimeout(() => {
					this.$set(itemValue, 'frecqtyofinvunit', calc.floorFloat(itemValue.fcanoverrecqty, itemValue.finvdecimal));
					this.calculateTotal();
				}, 0);
			} else {
				setTimeout(() => {
					this.$set(itemValue, 'frecqtyofinvunit', valueTager);
					this.calculateTotal();
				}, 0);
			}
		},

		GoToSelectCondition(type, id, expand) {
			uni.navigateTo({
				url: '/pages/public/condition_select?type=' + type + '&id=' + id + '&expand=' + encodeURIComponent(JSON.stringify(expand))
			});
		},
		//index 行 type 类型 0是等级选择 1是储位
		conditionsSelect(index, type) {
			let item = this.dataSource[index];
			if (Number(type) == 0) {
				this.GoToSelectCondition(2, item.flvlcode, {
					fgoodsid: item.fgoodsid,
					index: index
				});
			} else if (Number(type) == 1) {
				this.GoToSelectCondition(3, item.fplacecode, {
					index: index
				});
			}
		},
		//暂存
		clickCacheBtn() {
			requestHepler({
				url: PurPickRc_SaveTemp,
				addStkcode: true,
				data: {
					data: this.dataSource
				}
			}).then(res => {
				uni.showToast({
					title: '暂存成功',
					icon: 'none',
					mask: true
				});
				setTimeout(() => {
					this.requestUnLock();
				}, 1500);
			});
		},
		//保存完成方法
		clickFinshBtn() {
			let isNoCheckDate = 0;
			let dataArrays = [];
			for (let i = 0; i < this.dataSource.length; i++) {
				const item = this.dataSource[i];
				if (Number(item.fsel) == 0) {
					isNoCheckDate = isNoCheckDate + 1;
					continue;
				}
				dataArrays.push(item);
			}
			if (dataArrays.length == 0) {
				uni.showToast({
					title: '请先选择需要提交的单据',
					icon: 'none'
				});
				return;
			}

			if (isNoCheckDate > 0) {
				uni.showModal({
					//提醒用户更新
					title: '提示',
					content: '还有未选择的数据，是否继续提交？',
					success: res => {
						if (res.confirm) {
							this.sumbitFinshData(dataArrays);
						}
					}
				});
			} else {
				this.sumbitFinshData(dataArrays);
			}
		},
		//退出的时候需要解锁单据
		requestUnLock() {
			// this.mst.fpgno = 'W0820200209005'
			if (!this.mst.fpgno) return;
			requestHepler({
				url: PurPickRc_Unlock,
				addStkcode: true,
				data: {
					pgno: this.mst.fpgno
				}
			}).then(res => {
				uni.navigateBack({});
			});
		},
		//搜索算法
		searchResponse(res) {
			this.searchText = res.value;
			this.dataSource = this.originDataSource.filter(element => {
				//通过品名品号模糊搜索
				return element.fgoodsname.indexOf(this.searchText) != -1 || element.fgoodscode.indexOf(this.searchText) != -1;
			});
		},
		sumbitFinshData(dataArrays) {
			requestHepler({
				url: PurPickRc_Save,
				addStkcode: true,
				data: {
					deptcode: this.mst.fdeptcode,
					data: dataArrays
				}
			}).then(res => {
				if (res) {
					if (res.rtn && res.rtn.length > 0) {
						let rtn = res.rtn[0].fifrecover;
						if (Number(rtn | 0) == 1) {
							//收完成才发通知删除
							uni.$emit(NOFI_SAVEFINSH_BILL, this.orderNo.orderNo);
						}
					}
				}
				uni.showToast({
					title: '操作成功',
					icon: 'none',
					mask: true
				});
				setTimeout(() => {
					this.requestUnLock();
				}, 1500);
			});
		},
		orderNoStyle(val) {
			if (val) {
				return '#dd524d';
			} else return '#666666';
		}
	},
	onLoad(option) {
		this.orderNo = option;
		this.getDetail(this.orderNo.orderNo);
		let _that = this;
		uni.getStorage({
			key: _that.GLOBAL.Key_User,
			success(res) {
				(_that.fIfUsePlace = res.data.store.fIfUsePlace), (_that.fifsupper = Number(res.data.user.fifsupper | 0));
			}
		});
		//部门选择
		uni.$on('1', data => {
			if (data) {
				this.mst.fdeptname = data.fdeptname;
				this.mst.fdeptcode = data.fdeptcode;
			}
		});
		//等级选择
		uni.$on('2', data => {
			if (data) {
				let item = this.dataSource[data.index];
				item.flvlcode = data.flvlcode;
				item.flvlname = data.flvlname;
			}
		});
		//储位选择
		uni.$on('3', data => {
			if (data) {
				let item = this.dataSource[data.index];
				item.fplacename = data.fplacename;
				item.fplacecode = data.fplacecode;
			}
		});
	},
	onUnload() {
		uni.$off(['1', '2', '3']);
	},
	onBackPress(e) {
		console.log('返回' + e.from);
		if (e.from === 'backbutton') {
			//点击物理按钮和左上角按钮才调用
			if (!this.mst.fpgno) return false;
			//如果单据被锁了就直接返回
			else {
				this.requestUnLock();
				return true; //返回true禁止默认返回事件
			}
		} else {
			return false;
		}
	}
};
</script>

<style lang="scss" scoped>
.nofi_view {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0px 12px 0px 12px;
}

.title_text {
	color: $color-theme;
	font-size: $font-size-md;
	white-space: nowrap;
}

.des_text {
	color: $color-subtitle;
	font-size: $font-size-md;
	white-space: nowrap;
}

.inline_text {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
