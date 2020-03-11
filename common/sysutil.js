//判断当前打开系统 官方文档：https://ask.dcloud.net.cn/article/88
function judgePlatform() {
	switch (plus.os.name) {
		case "Android":
			// Android平台: plus.android.*  
			uni.showToast({
				icon: 'none',
				title: '欢迎使用app'
			});
			break;
		case "iOS":
			// iOS平台: plus.ios.*  
			uni.showToast({
				icon: 'none',
				title: '欢迎使用app'
			});
			break;
		default:
			uni.showToast({
				icon: 'none',
				title: '请在app中进行浏览'
			});
			// 其它平台  
			break;
	}
}
//热更新方案
// #ifdef APP-PLUS  
function updateWgt() {
	plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
		uni.request({
			url: 'http://www.example.com/update/',
			data: {
				version: widgetInfo.version,
				name: widgetInfo.name
			},
			success: (result) => {
				var data = result.data;
				if (data.update && data.wgtUrl) {
					uni.downloadFile({
						url: data.wgtUrl,
						success: (downloadResult) => {
							if (downloadResult.statusCode === 200) {
								plus.runtime.install(downloadResult.tempFilePath, {
									force: false
								}, function() {
									console.log('install success...');
									plus.runtime.restart();
								}, function(e) {
									console.error('install fail...');
								});
							}
						}
					});
				}
			}
		});
	});
}
// #endif  

//整包升级
//#ifdef APP-PLUS  
function updateApk() {
	var server = "https://www.example.com/update"; //检查更新地址  
	var req = { //升级检测数据  
		"appid": plus.runtime.appid,
		"version": plus.runtime.version
	};
	uni.request({
		url: server,
		data: req,
		success: (res) => {
			if (res.statusCode == 200 && res.data.status === 1) {
				uni.showModal({ //提醒用户更新  
					title: "更新提示",
					content: res.data.note,
					success: (res) => {
						if (res.confirm) {
							plus.runtime.openURL(res.data.url);
						}
					}
				})
			}
		}
	})
}
//#endif
