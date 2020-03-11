<template>
	<view style="width: 100%;">
		<view class="nofi_view">
			<view>
				<text class="title_text">出库凭单：</text>
				<text class="des_text">{{mst.fcreator}}</text>
				<text class="des_text" :style="{marginLeft:'8px',color:orderNoStyle(mst.fifcolorred)}">{{mst.forino}}</text>
			</view>
			<!-- <img src="/static/img/scan.png" style="width: 26px; height: 26px;" @tap="SVScanCode" /> -->
		</view>
		<view class="nofi_view">
			<view>
				<text class="title_text">出库原因：</text>
				<text class="des_text">{{mst.freasondesc||''}}</text>
			</view>
		</view>
		<view class="nofi_view">
			<view>
				<text class="title_text">单据日期：</text>
				<text class="des_text">{{mst.fcdate|formatFDate}}</text>
			</view>
			<!-- <img src="/static/img/gonext.png" /> -->
		</view>
		<view style="width: 100%; height: auto;">
			<uniSearchBar radius="5" placeholder="品名/品号" clearButton="auto" cancelText="" @confirm="searchResponse" />
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
							<text class="des_text">项目：</text>
							<text class="title_text">{{value.fprjno||''}}</text>
							<text class="title_text inline_text">{{value.fprjname||''}}</text>
						</view>

						<view v-if="value.fiflvlmng!=='0'" style="display: flex;align-items: center;margin-top: 8px;width: 60%;" 
						@tap="value.fiflvlmng==='2'?'':conditionsSelect(key,0)">
							<text class="des_text">等级：</text>
							<sfCard :title="value.flvlname" :disable="value.fiflvlmng==='2'"></sfCard>
						</view>

						<view v-if="fIfUsePlace==1" style="display: flex;align-items: center;margin-top: 8px;width: 100%;" 
						@tap="fifsupper==0?'':conditionsSelect(key,1)">
							<text class="des_text">储位：</text>
							<sfCard style="width: 100%;" :title="value.fplacecode" :disable="fifsupper==0"></sfCard>
						</view>
						
						<view v-if="value.fiflotmng!=='0'" style="display: flex;align-items: center;margin-top: 8px;width: 60%;"
						 @tap="value.fiflotmng==='2'?'':conditionsSelect(key,2)"
						 >
							<text class="des_text">批号：</text>
							<sfCard :title="value.flotno" :disable="value.fiflotmng==='2'"></sfCard>
						</view>

						<template v-slot:footer>
							<view style="display: flex;align-items: center;">
								<view style="flex: 1;">
									<text class="title_text">计划数：</text>
									<text style="color: #BD2C00;font-size: 16px;margin-right: 10px;">{{value.fplanoutqty}}</text>
									<text class="title_text">{{value.funitname}}</text>
								</view>
								<view style="flex: 1;display: flex;align-items: center;">
									<text class="title_text" style="margin-left: 10px;">实际数：</text>
									<sfCard cardType='1'>
										<input :id="key" class="uni-input" @input="inputChange" placeholder="请输入" v-model="value.factoutqty" type="digit" />
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
		StkOut_Other_StkOutLogNo,
		StkOut_Other_SaveData,
		StkOut_Other_TmpSave,
		StkOut_Other_UnLock
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
				dataSource: [],//搜索结果数据
				originDataSource:[],//源头数据
				orderNo: '', //接收上一个界面传来的参数
				isAllSelect: false, //是否全选
				totalMoney: 0, //总金额
				searchText:'', //搜索字符
				fIfUsePlace:0,//是否启用储位
				fifsupper:0,//储位是否可以编辑
			}
		},
		methods: {
			getDetail(orderNo) {
				requestHepler({
						url: StkOut_Other_StkOutLogNo,
						addStkcode: true,
						data: {
							sorino: orderNo,
						},
					})
					.then(res => {
						if (res.stkinfo && res.stkinfo.length > 0) {
							this.mst = res.stkinfo[0]
						}
						this.dataSource = res.stkoutitem;
						this.originDataSource = res.stkoutitem;
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
				let factoutqty = 0;
				for (let i = 0; i < this.dataSource.length; i++) {
					const item = this.dataSource[i];
					if (item.fsel === '1') {
						factoutqty = calc.accAdd(factoutqty,item.factoutqty)
					}
				}
				this.totalMoney = factoutqty;
			},
			//首次获取到数据的时候计算全选按钮和合计数
			initCalculateTotal() {
				let factoutqty = 0;
				let isAllSelect = true
				for (let i = 0; i < this.dataSource.length; i++) {
					const item = this.dataSource[i];
					if (item.fsel === '1') {
						factoutqty = calc.accAdd(factoutqty,item.factoutqty)
					} else {
						isAllSelect = false
					}
				}
				this.totalMoney = factoutqty;
				this.isAllSelect = isAllSelect;
			},

			inputChange(res) {
				let itemValue = this.dataSource[res.target.id]
				const valueTager = calc.clearNoNum(res.target.value,itemValue.fdecimal)
				if (calc.comAGreaterB(valueTager,itemValue.fplanoutqty)) {
					//这里需要特别注意，不用延迟修改会没有效果
					setTimeout(() => {
						this.$set(itemValue, 'factoutqty', calc.floorFloat(itemValue.fplanoutqty,itemValue.fdecimal))
						this.calculateTotal()
					}, 0)
				} else {
					setTimeout(() => {
						this.$set(itemValue, 'factoutqty', valueTager)
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
			//index 行 type 类型 0是等级选择 1是储位 2是批号
			conditionsSelect(index, type) {
				let item = this.dataSource[index]
				if (Number(type) == 0) {
					this.GoToSelectCondition(2, item.flvlcode, {
						'fgoodsid': item.fgoodsid,
						'index': index
					})
				} else if(Number(type) == 1){
					this.GoToSelectCondition(3, item.fplacecode, {
						'index': index
					})
				}else {
					this.GoToSelectCondition(4, item.flotno, {
						'fgoodsid': item.fgoodsid,
						'index': index
					})
				}
			},
			//暂存
			clickCacheBtn() {
				requestHepler({
						url: StkOut_Other_TmpSave,
						addStkcode:true,
						data: {
							'sorino': this.mst.forino,
							'receiptcode': this.mst.forireceiptcode,
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
				let isNoCheckDate = 0;
				let dataArrays = [];
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
			//退出的时候需要解锁单据
			requestUnLock() {
				 // this.mst.forino = 'W1120200115001'
				if (!this.mst.forino) return
				requestHepler({
					url: StkOut_Other_UnLock,
					addStkcode: true,
					data: {
						'sorino': this.mst.forino
					}
				}).then(res => {
                    uni.navigateBack({
                    	
                    })
				})
			},
			orderNoStyle(val) {
				if (val) {
					return '#dd524d'
				} else
					return '#666666'
			},
			//搜索算法
			searchResponse(res){
				this.searchText = res.value
				this.dataSource = this.originDataSource.filter((element)=>{
					//通过品名品号模糊搜索
					return (element.fgoodsname.indexOf(this.searchText)!=-1 
					|| element.fgoodscode.indexOf(this.searchText)!=-1)
				})
			},
			//完成提交
			sumbitFinshData(dataArrays){
				requestHepler({
						url: StkOut_Other_SaveData,
						addStkcode:true,
						data: {
							'sorino': this.mst.forino,
							'receiptcode': this.mst.forireceiptcode,
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
			let _that = this
			uni.getStorage({
				key: _that.GLOBAL.Key_User,
				success(res) {
					_that.fIfUsePlace = res.data.store.fIfUsePlace,
					_that.fifsupper = Number(res.data.user.fifsupper|0)
				}
			})
			//等级选择
			uni.$on('2', (data) => {
				if (data) {
					let item = this.dataSource[data.index]
					item.flvlcode = data.flvlcode
					item.flvlname = data.flvlname
				}
			})
			//储位选择
			uni.$on('3', (data) => {
				if (data) {
					let item = this.dataSource[data.index]
					item.fplacename = data.fplacename
					item.fplacecode = data.fplacecode
				}
			})
			//批号选择
			uni.$on('4', (data) => {
				if (data) {
					let item = this.dataSource[data.index]
					item.flotno = data.flotno
				}
			})
		},
		onUnload() {
			uni.$off(['2', '3', '4'])
		},
		onBackPress(e) {
			console.log('返回' + e.from);
			if (e.from === 'backbutton') {
				//点击物理按钮和左上角按钮才调用
				if (!this.mst.forino) return false;
				//如果单据被锁了就直接返回
				else {
					this.requestUnLock();
					return true; //返回true禁止默认返回事件
				}
			} else {
				return false;
			}
		},
		filters:{
			formatFDate:function(val){
				if(val){
					return dateUtils.formatDateYMD(dateUtils.parse(val))
				}else{
					return ''
				}
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
