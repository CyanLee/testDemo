<template>
	<view style="width: 100%;">
		<view class="nofi_view">
			<view>
				<text class="title_text">领料单：</text>
				<text class="des_text" :style="{ marginLeft: '8px', color: orderNoStyle(mst.fifcolorred) }">{{ mst.fpickno }}</text>
			</view>
			<!-- <img src="/static/img/scan.png" style="width: 26px; height: 26px;" @tap="SVScanCode" /> -->
		</view>
		<view class="nofi_view">
			<view>
				<text class="title_text">部 门：</text>
				<text class="des_text">{{ mst.fdeptname || '' }}</text>
			</view>
		</view>
		<view style="width: 100%; height: auto;"><uniSearchBar radius="5" placeholder="品号/品名/规格描述" clearButton="auto" cancelText="" @confirm="searchResponse" /></view>

		<view style="margin-bottom: 110px;">
			<checkbox-group @change="checkboxListChange">
				<view v-for="(value, key) in dataSource" :key="key">
					<uniCard :is-shadow="true" :show-arrow="false" note="true">
						<view style="display:flex;flex-direction:column;"></view>
						<view style="display: flex;">
							<checkbox :value="key + ''" :checked="value.fsel === '1'"></checkbox>
							<text class="des_text" style="margin-top: 5px;">{{ `${value.fsubgoodscode}` }}</text>
							<text class="title_text inline_text" style="margin-top: 5px;margin-left: 8px;">{{ value.fsubgoodsname }}</text>
						</view>
						<view style="display: flex;margin-top: 8px;">
							<text class="des_text">订单：</text>
							<text class="title_text">{{ value.fordno }}</text>
						</view>
						<view style="display: flex;margin-top: 8px;">
							<text class="des_text">项目：</text>
							<text class="title_text">{{ value.fprjno || '' }}</text>
							<text class="title_text inline_text">{{ value.fprjname || '' }}</text>
						</view>

						<view v-if="fIfUsePlace == 1" v-for="(value1, key1) in value.placeinfo" :key="key1">
							<view style="display: flex;align-items: center;margin-top: 8px;width: 100%;">
								<text class="des_text">储位：</text>
								<text class="title_text width25 inline_text">{{ value1.fplacecode }}</text>
								<text class="des_text">余：</text>
								<text class="title_text width10 inline_text">{{ value1.fcanpickstkqty }}</text>
								<text class="des_text">发：</text>
								<sfCard cardType="1">
									<input :id="key + '-' + key1" class="uni-input" @input="inputChangePlace" placeholder="请输入" v-model="value1.fthisstkoutqty" type="digit" />
									<text class="title_text">{{ value.funitname }}</text>
								</sfCard>
							</view>
						</view>

						<template v-slot:footer>
							<view style="display: flex;align-items: center;">
								<view style="flex: 1;">
									<text class="title_text">计划数：</text>
									<text style="color: #BD2C00;font-size: 16px;margin-right: 10px;">{{ value.fplanpickqty_all }}</text>
									<text class="title_text">{{ value.funitname }}</text>
								</view>
								<view style="flex: 1;display: flex;align-items: center;">
									<text class="title_text" style="margin-left: 10px;">实际数：</text>
									<sfCard cardType="1">
										<input
											:id="key"
											class="uni-input"
											@input="inputChange"
											placeholder="请输入"
											v-model="value.fthisstkoutqty_all"
											type="digit"
											:disabled="value.placeinfo && value.placeinfo.length > 0"
										/>
										<text class="title_text">{{ value.funitname }}</text>
									</sfCard>
								</view>
							</view>
						</template>
					</uniCard>
				</view>
			</checkbox-group>
		</view>

		<view style="position: fixed;bottom: 0px;left: 0px;right: 0px;background: #ffffff;">
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
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
	import uniCard from '@/components/uni-card/uni-card.vue'
	import sfCard from '@/components/sf-card/sf-card.vue'
	import dateUtils from '@/common/util.js'
	import calc from '@/common/calc.js'
	import {
		Pick_GetPickItem,
		Pick_GenStkLogNo,
		Pick_PostStkLogNo,
		Pick_UnLockPickBill
	} from '@/api/api.js'
	import {requestHepler} from '@/api/http.js'
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
				originDataSource: [],
				orderNo: '',
				isAllSelect: false, //是否全选
				totalMoney: 0, //总金额
				searchText: '', //搜索字符
				fIfUsePlace: 0, //是否启用储位
			}
		},
		methods: {
			getDetail(orderNo) {
				requestHepler({
						url: Pick_GetPickItem,
						data: {
							pickno: orderNo,
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
					if (values.includes(i.toString())) {
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
				let fthisstkoutqty_all = 0;
				for (let i = 0; i < this.dataSource.length; i++) {
					const item = this.dataSource[i];
					if (item.fsel === '1') {
						fthisstkoutqty_all = Number(fthisstkoutqty_all | 0) + Number(item.fthisstkoutqty_all | 0)
					}
				}
				this.totalMoney = fthisstkoutqty_all;
			},
			//计算储位合计数
			calculatePlaceTotal(dataItem) {
				let fthisstkoutqty_all = 0;
				for (let i = 0; i < dataItem.placeinfo.length; i++) {
					const item = dataItem.placeinfo[i];
					fthisstkoutqty_all = Number(fthisstkoutqty_all | 0) + Number(item.fthisstkoutqty | 0)
				}
				this.$set(dataItem,'fthisstkoutqty_all',fthisstkoutqty_all)
			},
			//首次获取到数据的时候计算全选按钮和合计数
			initCalculateTotal() {
				let fthisstkoutqty_all = 0;
				let isAllSelect = true
				for (let i = 0; i < this.dataSource.length; i++) {
					const item = this.dataSource[i];
					if (item.fsel === '1') {
						fthisstkoutqty_all = Number(fthisstkoutqty_all | 0) + Number(item.fthisstkoutqty_all | 0)
					} else {
						isAllSelect = false
					}
				}
				this.totalMoney = fthisstkoutqty_all;
				this.isAllSelect = isAllSelect;
			},

			inputChange(res) {
				const valueTager = calc.clearNoNum(res.target.value, itemValue.fdecimal);
				let itemValue = this.dataSource[res.target.id]
				if (calc.comAGreaterB(valueTager, itemValue.fplanpickqty_all)) {
					//这里需要特别注意，不用延迟修改会没有效果
					setTimeout(() => {
						this.$set(itemValue, 'fthisstkoutqty_all', calc.floorFloat(itemValue.fplanpickqty_all, itemValue.fdecimal))
						this.calculateTotal()
					}, 0)
				} else {
					setTimeout(() => {
						this.$set(itemValue, 'fthisstkoutqty_all', valueTager);
						this.calculateTotal();
					}, 0)
				}
			},
			//储位列表的实数输入
			inputChangePlace(res) {
				const valueTager = calc.clearNoNum(res.target.value, itemValue.fdecimal);
				let sectAndRowArray = res.target.id.split('-')
				let dataItem = this.dataSource[sectAndRowArray[0]];
				let placeItem = dataItem.placeinfo[sectAndRowArray[1]];
				if (calc.comAGreaterB(valueTager,placeItem.fcanpickstkqty)) {
					//这里需要特别注意，不用延迟修改会没有效果
					setTimeout(() => {
						this.$set(placeItem, 'fthisstkoutqty', calc.floorFloat(placeItem.fcanpickstkqty,placeItem.fdecimal))
						this.calculatePlaceTotal(dataItem)
						this.calculateTotal()
					}, 0)
				} else {
					setTimeout(() => {
						this.$set(placeItem, 'fthisstkoutqty', valueTager);
						this.calculatePlaceTotal(dataItem);
						this.calculateTotal()
					}, 0)
				}
			},
			//暂存
			clickCacheBtn() {
				let dataArrays = this.getPostData(false)
				if (dataArrays.length == 0) {
					uni.showToast({
						title: '无数据'
					})
					return
				}
				requestHepler({
						url: Pick_GenStkLogNo,
						data: {
							'picktostkoutparam': dataArrays
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
				let dataArrays = this.getPostData(true)
				if (dataArrays.length == 0) {
					uni.showToast({
						title: '请先选择需要提交的单据',
						icon:'none'
					})
					return
				}
				if(isNoCheckDate>0){
					uni.showModal({ //提醒用户更新
						title: '提示',
						content: '还有未选择的数据，是否继续提交？',
						success: (res) => {
							if (res.confirm) {
								this.sumbitFinshData(dataArrays)
							}
						}
					})
				}else{
					this.sumbitFinshData(dataArrays)
				}
			},
			requestUnLock() {
				if (!this.mst.fpickno) return
				requestHepler({
					url: Pick_UnLockPickBill,
					addStkcode: true,
					data: {
						'pickno': this.mst.fpickno
					}
				}).then(res => {
                    uni.navigateBack({});
				})
			},
			orderNoStyle(val) {
				if (val) {
					return '#dd524d'
				} else
					return '#666666'
			},
			//获取上传的数据 val:是否只需要勾选的数据
			getPostData(val) {
				let arrays = [];
				for (let i = 0; i < this.dataSource.length; i++) {
					const item = this.dataSource[i];
					if (val && Number(item.fsel) == 0) continue
					if (item.placeinfo.length > 0) {
						for (let j = 0; j < item.placeinfo.length; j++) {
							const child = item.placeinfo[j];
							const result = {
								'fthisstkoutqty': child.fthisstkoutqty,
								'fpickno': item.fpickno,
								'fprjno': item.fprjno,
								'fordno': item.fordno,
								'fsubgoodsid': item.fsubgoodsid,
								'fsubcstlotno': item.fsubcstlotno,
								'fstkcode': item.fstkcode,
								'fplacecode': child.fplacecode
							}
							arrays.push(result)
						}
					}
				}
				return arrays;
			},
			//搜索算法
			searchResponse(res){
				this.searchText = res.value
				this.dataSource = this.originDataSource.filter((element)=>{
					//通过品名品号模糊搜索
					return (element.fsubgoodsname.indexOf(this.searchText)!=-1
					|| element.fsubgoodscode.indexOf(this.searchText)!=-1)
				})
			},
			//完成提交
			sumbitFinshData(dataArrays){
				requestHepler({
						url: Pick_PostStkLogNo,
						addStkcode:true,
						data: {
							'picktopostparam': dataArrays
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
			this.order = option;
			this.getDetail(option.orderNo)
			let _that = this
			uni.getStorage({
				key: _that.GLOBAL.Key_User,
				success(res) {
					_that.fIfUsePlace = res.data.store.fIfUsePlace
				}
			})
		},
		onBackPress(e) {
			console.log('返回' + e.from);
			if (e.from === 'backbutton') {
				//点击物理按钮和左上角按钮才调用
				if (!this.mst.fpickno) return false;
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

.width10 {
	width: calc((100%-44px) * 0.1);
}

.width20 {
	width: calc((100%-44px) * 0.2);
}

.width25 {
	width: calc((100%-44px) * 0.25);
}
</style>
