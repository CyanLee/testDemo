//全局域名
const baseURL = 'http://192.168.10.115:8765' //'http://125.93.252.232:10001'
//登录接口
const login = "/Web/common/API/MobileOrderHandler.ashx"
//登录状态
const isLogin = false
const token = ''
const fwbcode=''
const account=''

const Key_User = 'Key_User'//保存原生项目传过来的信息

const KEY_BASEURL = 'BASEURL'
const KEY_ISLOGIN = 'ISLOGIN'
const KEY_TOKEN = 'USERTOKEN'

export default {
	isLogin,
	baseURL,
	KEY_BASEURL,
	login,
	KEY_ISLOGIN,
	KEY_TOKEN,
	token,
	fwbcode,
	account,
	Key_User
}
