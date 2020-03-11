<template>
	<view style="width: 100%;">
		<!-- <view style="display: flex;">
			<view v-for="(item,key) in datas" :key="key">
				{{item}}
			</view>
		</view> -->
	
		<view class="content_css" @tap="clickView" style="overflow: scroll;">
			<view class="width60">1</view>
			<view class="width60" :style="{height:viewHeight+'px'}">2</view>
			<view class="width60">3</view>
			<view class="width60">4</view>
			<button @tap.stop="addLine">高一点</button>
		</view>
	
	</view>
</template>

<script>
	export default{
		data(){
			return {
				datas:["1","2","3","4"],
				viewHeight:80
			}
		},
		methods:{
			addLine(){
				//this.datas.push("5");
				this.viewHeight = this.viewHeight + 20;
				console.log('--------'+this.viewHeight)
				console.log('按钮点击了')
			},
			clickView(){
				console.log('点击view了')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content_css{
		height: 200px;
		display: flex;
		background-color: #0FAEFF;
	}
	.width60{
		width: 60px;
		height: 80px;
		margin: 5px 5px;
		background-color: #4CD964;
	}

</style>
