const getDescribe = function(_this, key) {
	var data = _this.languageData;
	data.forEach(item => {
		if (item.fExpID == key) {
			return item.fPRC;
		}
	})
}

export default {
	getDescribe
}
