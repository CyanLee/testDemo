<template>
	<view class="boder_view">
		<view :class="{'sf_card_disable_class':disable===true,'sf_card_class':disable===false}">
			<text v-if="cardType=='0'" class="title_text">{{title}}</text>
			<img v-if="cardType=='0'" src="/static/img/pull_down_icon.png" style="width: 12px;height: 8px;"/>
			<slot v-if="cardType!='0'"></slot>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			cardType:{
				type:String,
				default:'0'  //选择类型,1自定义类型
			},
			title:{
				type:String,
				default:''
			},
			disable:{
				type:Boolean,
				default:false //1不可编辑 0可编辑
			}
		},
	}
</script>

<style lang="scss" scoped>
	.boder_view{
		box-shadow: 0 0 0 rgba(0, 0, 0, 0);
		flex: 1;
		background-color: #ffffff;
		position: relative;
		flex-direction: column;
		border-color: #eaeaea;
		border-style: solid;
		border-width: 1px;
		border-radius: 3px;
		overflow: hidden;
	}
	
	.sf_card_class{
		display: flex;
		height: 100%;
		justify-content: space-between;
		align-items: center;
		min-width: 50px;
		padding: 2px 5px;
	}
	
	.sf_card_disable_class{
		display: flex;
		height: 100%;
		justify-content: space-between;
		align-items: center;
		padding: 2px 5px;
		min-width: 50px;
		background: #eaeaea;
	}
	
	.title_text {
		min-height: 22px;
		color: $color-theme;
		font-size: $font-size-md;
	}
	
	.des_text {
		color: $color-subtitle;
		font-size: $font-size-md;
	}
</style>
