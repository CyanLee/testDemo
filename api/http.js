/**
 * @param {String} url 请求地址
 * @param {String} method 请求类型，大写
 * @param {String} params 请求输入参数
 */
const request = (url, method, params) => new Promise((resolve, reject) => {
	uni.request({
		url: url,
		method: method,
		data: params,
		dataType: 'json',
		header: {
			'content-type': 'application/x-www-form-urlencoded' //会将数据转换为 query string
			//'custom-header': 'hello' //自定义请求头信息
			// 'content-type': 'application/json' //会将数据进行 JSON 序列化
			//'Authorization': 'Bearer ' + token
		},
		success(data) {
			resolve(data.data);
		},
		fail(mes) {
			reject(new Error(mes));
		}
	})
});

const defualtTrueOrFalse = (value, defualt) => {
	if (value === undefined) {
		return defualt
	} else {
		return value
	}
}

const addStkcodeParam = (data,appData,addStkcode) => {
	if(addStkcode){
		data.stkcode = appData.store.fStkCode
	}
}

const addUseInfoParam = (data,appData)=>{
	data.usercode = appData.user.usercode
	data.username = appData.user.username
}

const getErrorMessage = (bodyData)=>{
	if(bodyData.errormsg){
		return bodyData.errormsg
	}else{
		if(bodyData.data){
			if(bodyData.data instanceof Object){
				if(bodyData.data.error && (bodyData.data.error instanceof Array) && bodyData.data.error.length>0){
					return bodyData.data.error[0].fErrorMsg
				}else{
					return JSON.stringify(bodyData.data)
				}
			}else if(bodyData.data instanceof String){
				return bodyData.data
			}
		}else{
			return "异常"
		}
	}
}

/*
用集合方式方便以后维护随时增减参数
uni.stopPullDownRefresh()停止刷新方法内实现,调用此方法不需要添加多余的uni.stopPullDownRefresh()
method 请求方式,默认POST,传值的时候需全部大写,uni-app规定
showLoading 显示加载中遮罩层 默认true
toask 错误的时候是否需要提示toask 默认true 如需自行处理可以传false
addStkcode 接口传参是否需要增加仓库字段,默认false
data 请求参数
*/
//用集合方式方便以后维护随时增减参数
const requestHepler = ({
	url,
	method,
	showLoading,
	toask,
	addStkcode,
	data
}) => new Promise((resolve, reject) => {
	if (defualtTrueOrFalse(showLoading, true)) {
		uni.showLoading({mask:true})
	}
	let appData = uni.getStorageSync('Key_User')
	if(!data) data = {};
	addStkcodeParam(data,appData,addStkcode)
	addUseInfoParam(data,appData)
	uni.request({
		url: appData.serverAddress + url,
		method:method?method:'POST',
		data: data,
	    dataType: 'json',
		header: {
			  'content-type': 'application/x-www-form-urlencoded',//;浏览器调试
			    // 'content-type': 'application/json'//手机调试或正式打包
		},
		success(data) {
			if (defualtTrueOrFalse(showLoading, true)) {
				uni.hideLoading()
			}
			uni.stopPullDownRefresh()
			console.log('接口数据响应' + JSON.stringify(data.data))
			if (data.statusCode == 200 && data.data.Status == 200) {
				const bodyData = data.data.Data;
				if(bodyData.success==true){
					resolve(bodyData.data);
				}else{
					if (defualtTrueOrFalse(toask, true)) {
						uni.showToast({
							title: getErrorMessage(bodyData),
							icon:'none'
						})
					}
					reject(new Error(getErrorMessage(bodyData)));
				}
			} else {
				if (defualtTrueOrFalse(toask, true)) {
					uni.showToast({
						title: data.data.ErrorMessage?data.data.ErrorMessage:data.data,
						icon:'none'
					})
				}
				reject(new Error(data.data.ErrorMessage?data.data.ErrorMessage:data.data));
			}
		},
		fail(mes) {
			if (defualtTrueOrFalse(showLoading, true)) {
				uni.hideLoading()
			}
			uni.stopPullDownRefresh()
			if (defualtTrueOrFalse(toask, true)) {
				uni.showToast({
					title: mes,
					icon:'none'
				})
			}
			reject(new Error(mes));
		}
	})
});

export {
	request,
	requestHepler
}
