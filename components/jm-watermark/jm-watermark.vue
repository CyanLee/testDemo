<template>
	<view>
		<view class="copyRightBox">
			<view class="font" ref='sy' v-for="(item,index) in 1" :key='index'>
				{{sytext}}
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {};
		},
		props: {
			//载入的标签数据
			sytext: String
		},
		mounted() {}
	}
</script>
<style>
	.copyRightBox {
		//overflow: hidden;
		width: 100%;
		//height: 90px;
		pointer-events: none;
		position: absolute;
		//top: 20px;
		z-index: 9;
	}
	.font {
		float: left;
		//transform: rotate(-30deg);
		//margin-top: 110upx;
		margin-left: -350upx;
		font-size: 34upx;
		color: rgba(100, 0, 0, 0.9);
	}
</style>
