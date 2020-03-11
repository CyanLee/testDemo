import {
	request
} from '@/api/http';

const globalRequest = (url, method, data) => {
	let token = '';
	let baseUrl = '';
	uni.getStorage({
		key: 'baseUrl',
		success: function(ress) {
			baseUrl = ress.data;
		}
	});
	uni.getStorage({
		key: 'userInfo',
		success: function(ress) {
			token = ress.data.token;
		}
	});
	return request(baseUrl + url, method, data, token)
		.then(res => {
			uni.hideNavigationBarLoading();
			uni.stopPullDownRefresh(); //得到数据后停止下拉刷新
			console.log(JSON.stringify(res));
			if (!res) {
				uni.showModal({
					content: '请求参数错误',
					showCancel: false
				});
				return;
			}
			if (res.success) {
				return res.data;
			} else {
				var msg = res.data;
				if (res.data == null) {
					msg = res.msg;
				}
				uni.showModal({
					content: msg,
					showCancel: false
				});
				//令牌过期或失效
				if (res.msgcode == 401) {
					uni.removeStorage({
						key: 'userInfo'
					});
					uni.removeStorage({
						key: 'fwbCode'
					});
					uni.redirectTo({
						url: '../login/login'
					});
				}
			}
		}).catch(parmas => {
			uni.hideNavigationBarLoading();
			uni.stopPullDownRefresh(); //得到数据后停止下拉刷新
			uni.showToast({
				icon: 'none',
				title: '请求异常'
			});
		})

}

export default globalRequest
