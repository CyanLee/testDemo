<template>
	<view class="mcontent">
		<view class="vlist">
			<view v-for="item in scanerrordata" style="padding: 14px 14px;border-bottom: 1px solid #E5E5E5;">
				<view style="width: 80%;">
					<view style="color: #303030;font-size: 18px;font-weight: bold;">{{ item.barcode }}</view>
					<view style="color: #888888;font-size: 14px;margin-top: 8px;">{{ item.createtime }} 扫描</view>
					<view class="input-row" style="margin-top: 4px;">
						<view><img style="width: 20px;height: 20px;margin-right: 6px;" src="/static/img/yichang_icon@2x.png" /></view>
						<view style="color: #EB433A;font-size: 16px;">{{ item.errormsg }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
	components: {},
	computed: {
		...mapState(['scanerrordata'])
	},
	data() {
		return {};
	},
	onLoad() {},
	methods: {}
};
</script>

<style>
.mcontent {
	display: flex;
	flex: 1;
	flex-direction: column;
}
.vlist {
	width: 100%;
	border-top: 16px solid #f5f5f5;
	margin-bottom: 80px;
}
</style>
