//选中项条件匹配字段
function matchingField(type) {
	switch (Number(type)) {
		case 1: //部门
			return 'fdeptcode';
		case 2: //等级
			return 'flvlcode';
		case 3: //储位
			return 'fplacecode';
		case 4: //批号
			return 'flotno';
		default:
			return '';
	}
}
//设置标题
function getNaviTitle(type) {
	switch (Number(type)) {
		case 1:
			return '选择部门';
		case 2:
			return '选择等级';
		case 3:
			return '选择储位';
		case 4:
			return '选择批号';
		default:
			return '';
	}
}

//检索框占位字符
function getSearchPlaceholder(type) {
	switch (Number(type)) {
		case 1:
			return '部门代号/部门名称';
		case 2:
			return '等级代号/等级名称';
		case 3:
			return '储位代号';
		case 4:
			return '批号';
		default:
			return '请输入';
	}
}

module.exports = {
	matchingField: matchingField,
	getNaviTitle: getNaviTitle,
	getSearchPlaceholder: getSearchPlaceholder
}
