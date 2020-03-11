<template>
	<view style="width: 100%;">
		<view class="goodSearchView">
			<text class="des_text" style="margin-left: 8px;">货品:</text>
			<uniSearchBar radius="5" placeholder="品号或品名" clearButton="auto" cancelText="" @input="goodscodeChange" 
			style="flex: 1;"/>
			<button @tap="searchBtnClick" type="warn" size="mini" style="margin-right: 8px;">搜索</button>
		</view>
		
		<view class="goodSearchView">
			<text class="des_text" style="margin-left: 8px;">储位:</text>
			<uniSearchBar radius="5" placeholder="储位代号" clearButton="auto" cancelText="" @input="placecodeChange" 
			style="flex: 1;"/>
			<button type="warn" size="mini" style="margin-right: 8px;visibility: hidden;">搜索</button>
		</view>
		
		<view style="height: 10px;background-color: #F5F5F5;margin-top: 4px;margin-bottom: 8px;"></view>
		
		<uniCard v-for="(value,key) in item" :key="key">
			<view style="display: flex;">
				<text class="des_text" style="margin-top: 5px;">{{`${key+1}.  ${value.fgoodscode}`}}</text>
				<text class="title_text inline_text" style="margin-top: 5px;margin-left: 8px;"
				@tap="showAllText(value.fgoodsname)">{{value.fgoodsname}}</text>
			</view>
			
			<view class="item_view" v-if="fIfUsePlace == 1">
				<text class="des_text">储位：</text>
				<text class="title_text">{{value.fplacecode||''}}</text>
			</view>
			
			<view class="item_view" v-if="value.fiflvlmng!=='0'">
				<text class="des_text">等级：</text>
				<text class="title_text">{{value.flvlcode||''}}</text>
			</view>
			
			<view class="item_view" v-if="value.fiflotmng!=='0'">
				<text class="des_text">批号：</text>
				<text class="title_text">{{value.flotno||''}}</text>
			</view>
			
			<view class="item_view" v-if="value.fordno !== '****'">
				<text class="des_text">订单：</text>
				<text class="title_text">{{value.fordno||''}}</text>
			</view>
			
			<view class="item_view" v-if="value.fmono !== '****'">
				<text class="des_text">制令：</text>
				<text class="title_text">{{value.fmono||''}}</text>
			</view>
			
			<view class="item_view">
				<text class="title_text">可用数/在库数：</text>
				<text class="title_text" style="color:#E4393E;">{{value.favaqty}}</text>
				<text class="title_text" style="color:#E4393E;margin-left: 4px;margin-right: 4px;">/</text>
				<text class="title_text" style="color:#E4393E;margin-right: 8px;">{{value.fstockqty}}</text>
				<text class="title_text">{{value.funitname}}</text>
			</view>
		</uniCard>
		
	</view>
</template>

<script>
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
	import uniCard from '@/components/uni-card/uni-card.vue'
	import {StkQuery_InvSummary} from '@/api/api.js'
	import {
		requestHepler
	} from '@/api/http.js'
	import { stringUtils } from '@/common/util.js'
	export default{
		components:{
			uniSearchBar,
			uniCard
		},
		data(){
			return {
				item:[],
				fIfUsePlace:0,
				placecode:'',
				goodscode:''
			}
		},
		methods:{
			getData(){
				requestHepler({
					url:StkQuery_InvSummary,
					addStkcode:true,
					data:{
						placecode:this.placecode,
						goodscode:this.goodscode
					}
				}).then(res=>{
					this.item = res.item;
				})
			},
			//搜索
			searchBtnClick(){
				console.log("搜索结果" +  this.goodscode + "储位:" + this.placecode)
				if(this.fIfUsePlace == 1){//启用储位的情况下货品或者储位需输一个
					if(stringUtils.isEmpty(this.placecode) && stringUtils.isEmpty(this.goodscode)){
						uni.showToast({
							title:'货品和储位需有一项不为空！',
							icon:'none'
						})
						return
					}
				}else{
					if(stringUtils.isEmpty(this.goodscode)){
						uni.showToast({
							title:'货品不能为空，请输入！',
							icon:'none'
						})
						return
					}
				}
				this.getData()
			},
			goodscodeChange(e){
				this.goodscode = e.value;
			},
			placecodeChange(e){
				this.placecode = e.value;
			},
			showAllText(res){
				uni.showToast({
					title:res,
					icon:'none',
					duration:2000
				})
			}
		}
		,
		onLoad() {
			let _that = this;
			uni.getStorage({
				key: _that.GLOBAL.Key_User,
				success(res) {
					_that.fIfUsePlace = Number(res.data.store.fIfUsePlace|0);
				}
			});
			//this.getData()
		},
		onBackPress(options) {
			if (options.from === 'backbutton') {
				plus.runtime.quit()
				return false;
			}
			this.back();
			return true;
		},
	}
</script>

<style lang="scss" scoped>
	.goodSearchView{
		width: 100%;
		// height: 50px;
		display: flex;
		align-items: center;
	}
	
	.item_view{
		display: flex;
		margin-top: 0px;
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
	
	/deep/ .uni-searchbar__box{
		height: auto;
	}
	/deep/ .uni-searchbar{
		padding: 4px;
	}
</style>
