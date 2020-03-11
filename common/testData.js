const getTestData = () => {
	return {
		"fDesc": "在库查询",
		"fProg": "StkAPP_PurPickRc",
		"fProgType": "StkIn",
		"fProgTypeDesc": "入库",
		"language": "zh",
		"serverAddress": "http://112.31.84.28:1203",
		"store": {
			"fIfUnQiTaoInStk": "0",
			"fIfUsePlace": 1,
			"fStkCode": "CL_BC",
			"fStkName": "板材仓",
			"fStkType": 2
		},
		"user": {
			"deptname": "",
			"empname": "",
			"isadmin": true,
			"sex": "",
			"usercode": "Admin",
			"username": "系统管理员",
			"fifsupper": "0"
		},
		"uuid": "c2Y6c2YxMjM0NTYh"
	}
}

module.exports = {
	getTestData
}
