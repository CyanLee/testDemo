//js 加法计算
//调用：accAdd(arg1,arg2)
//返回值：arg1加arg2的精确结果
function accAdd(arg1, arg2) {
	var r1, r2, m, n;
	try {
		r1 = arg1.toString().split(".")[1].length
	} catch (e) {
		r1 = 0
	}
	try {
		r2 = arg2.toString().split(".")[1].length
	} catch (e) {
		r2 = 0
	}
	m = Math.pow(10, Math.max(r1, r2))
	//动态控制精度长度
	n = (r1 >= r2) ? r1 : r2;
	return ((arg1 * m + arg2 * m) / m).toFixed(n);
}

//js 减法计算
//调用：Subtr(arg1,arg2)
//返回值：arg1减arg2的精确结果
function accSub(arg1, arg2) {
	var r1, r2, m, n;
	try {
		r1 = arg1.toString().split(".")[1].length
	} catch (e) {
		r1 = 0
	}
	try {
		r2 = arg2.toString().split(".")[1].length
	} catch (e) {
		r2 = 0
	}
	m = Math.pow(10, Math.max(r1, r2));
	//last modify by deeka
	//动态控制精度长度
	n = (r1 >= r2) ? r1 : r2;
	return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

//js 乘法函数
//调用：accMul(arg1,arg2)
//返回值：arg1乘以arg2的精确结果
function accMul(arg1, arg2) {
	var m = 0,
		s1 = arg1.toString(),
		s2 = arg2.toString();
	try {
		m += s1.split(".")[1].length
	} catch (e) {}
	try {
		m += s2.split(".")[1].length
	} catch (e) {}
	return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}

//js 除法函数
//调用：accDiv(arg1,arg2)
//返回值：arg1除以arg2的精确结果
function accDiv(arg1, arg2) {
	var t1 = 0,
		t2 = 0,
		r1, r2;
	try {
		t1 = arg1.toString().split(".")[1].length
	} catch (e) {}
	try {
		t2 = arg2.toString().split(".")[1].length
	} catch (e) {}
	r1 = Number(arg1.toString().replace(".", ""))
	r2 = Number(arg2.toString().replace(".", ""))
	return (r1 / r2) * Math.pow(10, t2 - t1);
}

//arg1 大于 arg2
function comAGreaterB(arg1, arg2) {
	let a, b;
	try {
		a = parseFloat(arg1)
	} catch (e) {
		a = 0
	}
	try {
		b = parseFloat(arg2)
	} catch (e) {
		b = 0
	}
	return (a - b > 0)
}

//arg1 等于 arg2
function comAEqualB(arg1, arg2) {
	let a, b;
	try {
		a = parseFloat(arg1)
	} catch (e) {
		a = 0
	}
	try {
		b = parseFloat(arg2)
	} catch (e) {
		b = 0
	}
	return (a - b == 0)
}

//arg1 小于 arg2
function comALessB(arg1, arg2) {
	let a, b;
	try {
		a = parseFloat(arg1)
	} catch (e) {
		a = 0
	}
	try {
		b = parseFloat(arg2)
	} catch (e) {
		b = 0
	}
	return (a - b < 0)
}

function clearNoNum(obj,decimal) {
    
	if(!obj) return ''
	
    obj = obj.toString()
	if(Number(decimal|0)==0){
		obj = obj.replace(/[^\d]/g, ""); //只接收数字
	}else{
		obj = obj.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
		obj = floorFloat(obj,decimal);
	}

    return obj
}

//小数位保留n位，向下取小数位
function floorFloat(obj,decimal){
	if(!obj) return ''

	let num;
	try {
		num = parseFloat(obj)
		var m = Math.pow(10,Number(decimal|0));
		return Math.floor(num*m)/m;
	} catch (e) {
		return obj
	}
} 



module.exports = {
	accAdd: accAdd,
	accSub: accSub,
	accMul: accMul,
	accDiv: accDiv,
	comAGreaterB: comAGreaterB,
	comAEqualB: comAEqualB,
	comALessB: comALessB,
	clearNoNum:clearNoNum,
	floorFloat:floorFloat
}
