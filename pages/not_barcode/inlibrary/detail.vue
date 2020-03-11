<template>
	<view style="width: 100%;">
		<view class="nofi_view">
			<view>
				<text class="title_text">调拨单号：</text>
				<text class="des_text">{{mst.fmoveno}}</text>
			</view>
			<!-- <img src="/static/img/scan.png" style="width: 26px; height: 26px;" @tap="SVScanCode" /> -->
		</view>

		<view class="nofi_view">
			<view>
				<text class="title_text">调拨原因：</text>
				<text class="des_text">{{mst.freasondesc||''}}</text>
			</view>
		</view>
		
		<view class="nofi_view">
			<view>
				<text class="title_text">调入仓库：</text>
				<text class="des_text">{{mst.finstkname||''}}</text>
			</view>
		</view>
		
		<view class="nofi_view">
			<view>
				<text class="title_text">调出仓库：</text>
				<text class="des_text">{{mst.foutstkname||''}}</text>
			</view>
		</view>

		<view style="width: 100%; height: auto;">
			<uniSearchBar radius="5" placeholder="品号/品名" clearButton="auto" cancelText="" @confirm="searchResponse" />
		</view>

		<view style="margin-bottom: 110px;">
			<checkbox-group @change="checkboxListChange">
				<view v-for="(value, key) in dataSource" :key="key">
					<uniCard :is-shadow='true' :show-arrow="false" note="true">
						<view style="display:flex;flex-direction:column;"></view>
						<view style="display: flex;">
							<checkbox :value="value.fsno.toString()" :checked="value.fsel==='1'"></checkbox>
							<text class="des_text" style="margin-top: 5px;">{{`${value.fsno}.  ${value.fgoodscode}`}}</text>
							<text class="title_text inline_text" style="margin-top: 5px;margin-left: 8px;">{{value.fgoodsname}}</text>
						</view>

						<view style="display: flex;margin-top: 8px;">
							<text class="des_text">调入储位：</text>
							<text class="title_text">{{value.fplaninplacecode}}</text>
						</view>
						
						<view style="display: flex;margin-top: 8px;">
							<text class="des_text">调出储位：</text>
							<text class="title_text">{{value.fplanoutpacecode}}</text>
						</view>
						
						<view v-if="value.fiflotmng!=='0'" style="display: flex;margin-top: 8px;">
							<text class="des_text">调入批号：</text>
							<text class="title_text">{{value.fplaninlotno}}</text>
						</view>
						
						<view v-if="value.fiflotmng!=='0'" style="display: flex;margin-top: 8px;">
							<text class="des_text">调出批号：</text>
							<text class="title_text">{{value.fplanoutlotno}}</text>
						</view>

						<template v-slot:footer>
							<view style="display: flex;align-items: center;">
								<view style="flex: 1;">
									<text class="title_text">计划数：</text>
									<text style="color: #BD2C00;font-size: 16px;margin-right: 10px;">{{value.fplanmoveqty}}</text>
									<text class="title_text">{{value.funitname}}</text>
								</view>
								<view style="flex: 1;display: flex;align-items: center;">
									<text class="title_text" style="margin-left: 10px;">实际数：</text>
									<sfCard cardType='1'>
										<input :id="key" class="uni-input" @input="inputChange" placeholder="请输入" v-model="value.factmoveqty" type="digit" />
										<text class="title_text">{{value.funitname}}</text>
									</sfCard>
								</view>
							</view>
						</template>
					</uniCard>
				</view>
			</checkbox-group>
		</view>

		<view style="position: fixed;bottom: 0px;left: 0px;right: 0px;background: #ffffff;z-index: 999;">
			<view style="display: flex;align-items: center;margin-bottom: 12px;">
				<checkbox-group @change="allSelectCheckBox">
					<checkbox style="margin-left: 15px;" value="1" :checked="isAllSelect"></checkbox>
				</checkbox-group>
				<text class="des_text" style="margin-left: 20px;">合计：{{totalMoney}}</text>
			</view>

			<view style="display: flex;align-items: center;margin-bottom: 12px;background: #ffffff;">
				<button style="background: #669900;color: #ffffff;width: 40%;" @tap="clickCacheBtn">暂存</button>
				<button type="warn" style="color: #ffffff;width: 40%;" @tap="clickFinshBtn">完成</button>
			</view>
		</view>
	</view>
</template>

<script>
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
	import uniCard from '@/components/uni-card/uni-card.vue'
	import sfCard from '@/components/sf-card/sf-card.vue'
	import {
		dateUtils
	} from '@/common/util.js'
	import {
		ValStkMoveNo_PDA,
		StkMoveNoSave_PDA,
		StkMoveNoSaveTemp_PDA,
		StkMoveNoCancel_PDA
	} from '@/api/api.js'
	import {
		requestHepler
	} from '@/api/http.js'
	import calc from '@/common/calc.js'
	import { NOFI_SAVEFINSH_BILL } from '@/common/notificationKey.js'
	export default {
		components: {
			uniSearchBar,
			uniCard,
			sfCard,
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
			}
		},
		methods: {
			getDetail(orderNo) {
				requestHepler({
						url: ValStkMoveNo_PDA,
						addStkcode: true,
						data: {
							fmoveno: orderNo,
						},
					})
					.then(res => {
						if (res.mst && res.mst.length > 0) {
							this.mst = res.mst[0]
						}
						this.dataSource = res.item;
						this.originDataSource = res.item;
						this.initCalculateTotal();
					})
			},
			//列表checkBox
			checkboxListChange(res) {
				const values = res.detail.value;
				let isAlllSelect = true;
				for (let i = 0; i < this.dataSource.length; i++) {
					const item = this.dataSource[i]
					if (values.includes(item.fsno.toString())) {
						this.$set(item, 'fsel', '1')
					} else {
						this.$set(item, 'fsel', '0')
						isAlllSelect = false
					}
				}
				this.isAllSelect = isAlllSelect
				this.calculateTotal()
			},
			//全选check
			allSelectCheckBox(res) {
				const values = res.detail.value;
				if (values.length > 0) {
					this.isAllSelect = true
					this.setAllSelect(true)
				} else {
					this.isAllSelect = false
					this.setAllSelect(false)
				}
			},
			//全选和反选
			setAllSelect(isSelect) {
				console.log('全选触发')
				for (let i = 0; i < this.dataSource.length; i++) {
					const item = this.dataSource[i]
					this.$set(item, 'fsel', isSelect ? '1' : '0')
				}
				this.calculateTotal()
			},
			//计算合计数
			calculateTotal() {
				let factmoveqty = 0;
				for (let i = 0; i < this.dataSource.length; i++) {
					const item = this.dataSource[i];
					if (item.fsel === '1') {
						factmoveqty = calc.accAdd(factmoveqty,item.factmoveqty)
					}
				}
				this.totalMoney = factmoveqty;
			},
			//首次获取到数据的时候计算全选按钮和合计数
			initCalculateTotal() {
				let factmoveqty = 0;
				let isAllSelect = true
				for (let i = 0; i < this.dataSource.length; i++) {
					const item = this.dataSource[i];
					if (item.fsel === '1') {
						factmoveqty = calc.accAdd(factmoveqty,item.factmoveqty)
					} else {
						isAllSelect = false
					}
				}
				this.totalMoney = factmoveqty;
				this.isAllSelect = isAllSelect;
			},

			inputChange(res) {
				let itemValue = this.dataSource[res.target.id]
				const valueTager = calc.clearNoNum(res.target.value,itemValue.fdecimal)
				if (calc.comAGreaterB(valueTager,itemValue.fplanmoveqty)) {
					//这里需要特别注意，不用延迟修改会没有效果
					setTimeout(() => {
						this.$set(itemValue, 'factmoveqty', calc.floorFloat(itemValue.fplanmoveqty,itemValue.fdecimal))
						this.calculateTotal()
					}, 0)
				} else {
					setTimeout(() => {
						this.$set(itemValue, 'factmoveqty', valueTager)
						this.calculateTotal()
					}, 0)
				}
			},

			GoToSelectCondition(type, id, expand) {
				uni.navigateTo({
					url: '/pages/public/condition_select?type=' + type + '&id=' + id + '&expand=' +
						encodeURIComponent(JSON.stringify(expand))
				});
			},
			//暂存
			clickCacheBtn() {
				requestHepler({
						url: StkMoveNoSaveTemp_PDA,
						addStkcode: true,
						data: {
							'fmoveno':this.mst.fmoveno,
							'data': this.dataSource
						}
					})
					.then(res => {
						uni.showToast({
							title: '暂存成功',
							icon: 'none',
							mask: true
						});
						setTimeout(() => {
							this.requestUnLock();
						}, 1500);
					})
			},
			//保存完成方法
			clickFinshBtn() {
				let dataArrays = [];
				let isNoCheckDate = 0;
				for (let i = 0; i < this.dataSource.length; i++) {
					const item = this.dataSource[i];
					if (Number(item.fsel) == 0) {
						isNoCheckDate = isNoCheckDate + 1
						continue
					}
					dataArrays.push(item)
				}
				if (dataArrays.length == 0) {
					uni.showToast({
						title: '请先选择需要提交的单据'
					})
					return
				}
				
				if (isNoCheckDate > 0) {
					uni.showModal({ //提醒用户更新
						title: '提示',
						content: '还有未选择的数据，是否继续提交？',
						success: (res) => {
							if (res.confirm) {
								this.sumbitFinshData(dataArrays)
							}
						}
					})
				} else {
					this.sumbitFinshData(dataArrays)
				}
			},
			//退出的时候需要解锁单据
			requestUnLock() {
				if (!this.mst.fmoveno) return
				requestHepler({
					url: StkMoveNoCancel_PDA,
					addStkcode: true,
					data: {
						'fmoveno':this.mst.fmoveno
					}
				}).then(res => {
                   uni.navigateBack({})
				})
			},
			//搜索算法
			searchResponse(res) {
				this.searchText = res.value
				this.dataSource = this.originDataSource.filter((element) => {
					//通过品名品号模糊搜索
					return (element.fgoodsname.indexOf(this.searchText) != -1 ||
						element.fgoodscode.indexOf(this.searchText) != -1)
				})
			},
			sumbitFinshData(dataArrays){
				requestHepler({
						url: StkMoveNoSave_PDA,
						addStkcode: true,
						data: {
							'fmoveno':this.mst.fmoveno,
							'data': dataArrays
						}
					})
					.then(res => {
						uni.$emit(NOFI_SAVEFINSH_BILL,this.orderNo.orderNo)
						uni.showToast({
							title: '操作成功',
							icon: 'none',
							mask: true
						});
						setTimeout(() => {
							this.requestUnLock();
						}, 1500);
					})
			}
		},
		onLoad(option) {
			this.orderNo = option
			this.getDetail(this.orderNo.orderNo)
		},
		onUnload() {
			
		},
		onBackPress(e) {
			console.log('返回' + e.from);
			if (e.from === 'backbutton') {
				//点击物理按钮和左上角按钮才调用
				if (!this.mst.fmoveno) return false;
				//如果单据被锁了就直接返回
				else {
					this.requestUnLock();
					return true; //返回true禁止默认返回事件
				}
			} else {
				return false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nofi_view {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 2px 12px 0px 12px;
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
