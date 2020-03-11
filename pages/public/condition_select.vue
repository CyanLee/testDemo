<template>
	<view style="width: 100%;">
		<view class="searchView"><uniSearchBar radius="5" :placeholder="searchPlaceholder" clearButton="auto" cancelText="" @confirm="searchResponse" /></view>
		<scroll-view class="monthDescTab" scroll-x="true" scroll-left="0">
			<view style="height: 100%;">
				<view style="display: flex;">
					<view v-for="(value, key) in title" :key="key" style="display: flex;background: #CCCCCC;">
						<view style="width: 40px;height: 30px;color: #333333;font-size: 14px;text-align: center;line-height: 30px;">选择</view>
						<div v-for="(con, conKey) in value" :key="conKey" class="header_class" :style="{ width: itemWidth }">{{ con || '' }}</div>
					</view>
				</view>
				<view style="display: flex;">
					<checkbox-group @change="checkboxOnchange">
						<view v-for="(value, key1) in item" :key="key1" style="display: flex;flex-direction: row;">
							<checkbox
								:value="key1 + ''"
								style="width: 40px;height: 30px;text-align: center;line-height: 30px;"
								:checked="key1 + '' === currentselectIndex"
							></checkbox>
							<view v-for="(con1, conKey1) in value" :key="conKey1" class="item_class" :style="{ width: itemWidth }">{{ con1 || '' }}</view>
						</view>
					</checkbox-group>
				</view>
			</view>
		</scroll-view>
		<uniLoadMore :status="loadState" style="margin-bottom: 40px;"></uniLoadMore>
		<button type="warn" size="mini" class="okBtn" @click="confirmClick">确定</button>
	</view>
</template>

<script>
import { requestHepler } from '@/api/http';
import handleTool from './condition_select.js'
import { getPlaceCodeList, PurPickRc_GetRecDepts, GetLvlCodeList_PDA, GetLotNoList_PDA } from '@/api/api.js';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue';
export default {
	components: {
		uniLoadMore,
		uniSearchBar
	},
	data() {
		return {
			title: [],
			item: [],
			itemOrgin:[],//原始数据
			currentselectIndex: '',
			baseMessage: {},
			option: {},
			itemWidth: '80px',
			loadState: 'more',
			pageIndex: 1, //当前页码
			isOnceSelect: false, //是否选择过，因为存在分页，需要判断如果没有选择过直接确定就返回原来的值
			searchText: '', // 检索条件，默认为空
			searchPlaceholder: '请输入' // 检索框占位文字
		};
	},
	onLoad(option) {
		//使用这个选择类必须传两个值 type 选择类型 id 需要选择的条件唯一健(id或者code什么的)
		//type = 1为部门选择 2为等级选择 3为储位选择 4为选择批号
		const jsonResult = JSON.parse(decodeURIComponent(option.expand));
		option.expand = jsonResult;
		this.option = option;
		uni.setNavigationBarTitle({
			title: handleTool.getNaviTitle(this.option.type)
		});
		this.getDatas({
			type: option.type
		});
		this.searchPlaceholder = handleTool.getSearchPlaceholder(option.type)
	},
	onReachBottom() {
		console.log('到底');
		if (this.loadState !== 'loading' && this.loadState !== 'noMore') {
			//避免重复加载
			this.loadState = 'loading';
			this.getDatas({
				type: this.option.type
			});
		}
	},
	filters: {
		filterSearch: function(val,searchText,type){
			let ordType = Number(type)
			if(ordType == 1){//部门
				return val.filter((element)=>{
					return (element.fdeptcode.indexOf(searchText) != -1 ||
							element.fdeptname.indexOf(searchText) != -1)
				})
			}else if(ordType == 2){//等级
				return val.filter((element)=>{
					return (element.flvlcode.indexOf(searchText) != -1 ||
							element.flvlname.indexOf(searchText) != -1)
				})
			}else if(ordType == 3){//储位
				return val
			}else if(ordType == 4){//批号
				return val.filter((element)=>{
					return (element.flotno.indexOf(searchText) != -1)
				})
			}
		}
	},
	methods: {
		getDatas({ type }) {
			let orType = Number(type);
			if (orType == 1) {
				requestHepler({
					url: PurPickRc_GetRecDepts,
					addStkcode: true
				}).then(res => {
					this.calculateItemWith(res);
					this.endRefresh(res); //此方法要放在initCurrentSelectIndex方法之前
					this.initCurrentSelectIndex();
				});
			} else if (orType == 2) {
				//等级
				requestHepler({
					url: GetLvlCodeList_PDA,
					data: { ...this.option.expand }
				}).then(res => {
					this.calculateItemWith(res);
					this.endRefresh(res); //此方法要放在initCurrentSelectIndex方法之前
					this.initCurrentSelectIndex();
				});
			} else if (orType == 3) {
				//储位
				requestHepler({
					url: getPlaceCodeList,
					addStkcode: true,
					data: {
						spage: this.pageIndex,
						placecode: this.searchText
					}
				}).then(res => {
					this.calculateItemWith(res);
					this.endRefresh(res); //此方法要放在initCurrentSelectIndex方法之前
					this.initCurrentSelectIndex();
				});
			} else if (orType == 4) {
				requestHepler({
					url: GetLotNoList_PDA,
					data: { ...this.option.expand }
				}).then(res => {
					this.calculateItemWith(res);
					this.endRefresh(res); //此方法要放在initCurrentSelectIndex方法之前
					this.initCurrentSelectIndex();
				});
			}
		},
		//初始化当前选择的下标
		initCurrentSelectIndex() {
			let fiterId = handleTool.matchingField(this.option.type)
			for (let i = 0; i < this.item.length; i++) {
				const selectItem = this.item[i];
				if (this.option.id == selectItem[fiterId]) {
					this.currentselectIndex = i + '';
					break;
				}
			}
		},

		checkboxOnchange: function(e) {
			//保证是单选
			let values = e.detail.value;
			this.isOnceSelect = true; //已经选择过了
			if (values.length > 0) {
				if (values.length == 1) {
					this.currentselectIndex = values[0];
				} else {
					if (values[0] != this.currentselectIndex) {
						this.currentselectIndex = values[0];
					} else {
						this.currentselectIndex = values[1];
					}
				}
			} else {
				this.currentselectIndex = '';
			}
		},
		//搜索算法
		searchResponse(res) {
			console.log('搜索值====' + res.value);
			this.searchText = res.value;
			this.pageIndex = 1;
			//搜索的时候处理成未选择过
		    this.currentselectIndex = '';
			this.isOnceSelect = false;
			if(Number(this.option.type) == 3){
				this.getDatas({
					type: this.option.type
				});
			}else{
				let filter = this.$options.filters['filterSearch']
				this.item = filter(this.itemOrgin,this.searchText,this.option.type);
				this.initCurrentSelectIndex()
			}
		},
		confirmClick() {
			console.log('选择确定');
			if (this.isOnceSelect) {
				//没有修改过值就不需要通知更新
				uni.$emit(this.option.type, { ...this.item[this.currentselectIndex], ...this.option.expand });
			}
			uni.navigateBack({});
		},

		//计算table每个item项的宽度
		calculateItemWith(res) {
			let _that = this;
			let datas = res.title;
			if (res.item && res.item.length > 0) {
				datas = res.item;
			}
			uni.getSystemInfo({
				success(res) {
					if (datas.length > 0) {
						let countitem = Object.keys(datas[0]).length;
						let width = (res.screenWidth - 40 - countitem * 14) / countitem;
						width = width < 80 ? 80 : width;
						_that.itemWidth = width + 'px';
					}
				}
			});
		},
		//终止刷新并计算页数
		endRefresh(res) {
			if (res.page && res.page.length > 0) {
				if (Number(res.page[0].fcurrentpage | 0) == 1) {
					this.title = res.title;
					this.itemOrgin = res.item
					let filter = this.$options.filters['filterSearch']
					this.item = filter(this.itemOrgin,this.searchText,this.option.type);
				} else {
					this.itemOrgin = this.itemOrgin.concat(res.item);
					let filter = this.$options.filters['filterSearch']
					this.item = filter(this.itemOrgin,this.searchText,this.option.type);
				}
				this.pageIndex = Number(res.page[0].fcurrentpage | 0) + 1;
				if (Number(res.page[0].fcurrentpage | 0) >= Number(res.page[0].fpagetotal | 0)) {
					this.loadState = 'noMore';
				} else {
					this.loadState = 'more';
				}
			} else {
				this.itemOrgin = res.item;
				let filter = this.$options.filters['filterSearch']
				this.item = filter(this.itemOrgin,this.searchText,this.option.type);
				this.title = res.title;
				this.pageIndex = 1;
				this.loadState = 'noMore';
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.searchView {
	width: 100%;
	height: 50px;
	position: fixed;
	background: #ffffff;
	z-index: 1000;
}

.monthDescTab {
	margin-top: 50px;
	width: 100%;
	height: 100%;
	overflow: auto;
	/* 
	    * 只有加入这句话white-space: nowrap; scroll-view组件才能够滑动（此处为横向滑动）
	    */
	white-space: nowrap;
}

.header_class {
	color: $color-theme;
	font-size: $font-size-md;
	padding: 4px 5px;
	overflow: hidden;
	width: 80px;
	margin: 0px 2px;
	text-align: center;
	border-left: 1px solid #eaeaea;
	display: inline-block;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.item_class {
	color: $color-subtitle;
	font-size: $font-size-md;
	padding: 4px 5px;
	width: 80px;
	margin: 0px 2px;
	text-align: center;
	border-left: 1px solid #eaeaea;
	display: inline-block;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.okBtn {
	width: 100%;
	height: 40px;
	line-height: 40px;
	font-size: 16px;
	position: fixed;
	bottom: 0px;
	left: 0px;
}

.topTitle {
	position: fixed;
	top: 0px;
	left: 0px;
	z-index: 999;
}
</style>
