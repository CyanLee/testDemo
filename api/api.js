import {request} from '@/api/http'
import {constant} from '@/api/constant'


//全局域名
const baseURL = 'http://125.93.252.232:10001'
//登录接口
const login = "/Web/common/API/MobileOrderHandler.ashx"

/*
*杂项入库
*/
//其它入库列表
export const GetStkInNoList_PDA = "/sfapi/StkInfo/GetStkInNoList_PDA"
//其它入库凭单明细
export const StkIn_Other_StkInLogNo = "/sfapi/StkIn_Other/StkIn_Other_StkInLogNo"
//其它入库扫描完成确认
export const StkIn_Other_SaveDatao = "/sfapi/StkIn_Other/StkIn_Other_SaveData"
//其它入库扫描暂存
export const StkIn_Other_TmpSave = "/sfapi/StkIn_Other/StkIn_Other_TmpSave"
//解锁其它入库单
export const StkIn_Other_UnLock = "/sfapi/StkIn_Other/StkIn_Other_UnLock"

/*
*杂项出库
*/
//出库列表
export const GetStkOutNoList_PDA = "/sfapi/StkInfo//GetStkOutNoList_PDA"
//出库明细
export const StkOut_Other_StkOutLogNo = "/sfapi/StkOut_Other/StkOut_Other_StkOutLogNo"
//明细暂存
export const StkOut_Other_TmpSave = "/sfapi/StkOut_Other/StkOut_Other_TmpSave"
//明细确认完成
export const StkOut_Other_SaveData = "/sfapi/StkOut_Other/StkOut_Other_SaveData"
//解锁出库明细单据
export const StkOut_Other_UnLock = "/sfapi/StkOut_Other/StkOut_Other_UnLock"

/*
*采购接收
*/
//采购列表
export const PurPickRc_GetfPGNos = "/sfapi/PurPickRc/PurPickRc_GetfPGNos"
//采购明细
export const PurPickRc_GetPGItem = "/sfapi/PurPickRc/PurPickRc_GetPGItem"
//明细暂存
export const PurPickRc_SaveTemp = "/sfapi/PurPickRc/PurPickRc_SaveTemp"
//明细确认完成
export const PurPickRc_Save = "/sfapi/PurPickRc/PurPickRc_Save"
//解锁采购明细单据
export const PurPickRc_Unlock = "/sfapi/PurPickRc/PurPickRc_Unlock"

/*
*采购退货
*/
//采购列表
export const PurRtn_GetfRtnNos = "/sfapi/PurRtn/PurRtn_GetfRtnNos"
//采购明细
export const PurRtn_GetRtnItem = "/sfapi/PurRtn/PurRtn_GetRtnItem"
//明细暂存
export const PurRtn_SaveTemp = "/sfapi/PurRtn/PurRtn_SaveTemp"
//明细确认完成
export const PurRtn_Save = "/sfapi/PurRtn/PurRtn_Save"
//解锁采购明细单据
export const PurRtn_Unlock = "/sfapi/PurRtn/PurRtn_Unlock"

/*
 * 公共条件选择
 */
//获取储位列表
export const getPlaceCodeList = "/sfapi/StkInfo/GetPlaceCodeList_PDA"
//获取收货部门
export const PurPickRc_GetRecDepts = "/sfapi/PurPickRc/PurPickRc_GetRecDepts"
//获取货品批号
export const GetLotNoList_PDA = "/sfapi/StkInfo/GetLotNoList_PDA"
//获取货品等级
export const GetLvlCodeList_PDA = "/sfapi/StkInfo/GetLvlCodeList_PDA"

/*
 * 领料
 */
//获取领料列表
export const Pick_GetPickNoList = "/sfapi/PickNoToStkOut/GetPickNoList"
//获取领料明细
export const Pick_GetPickItem = "/sfapi/PickNoToStkOut/GetPickItem"
//领料暂存
export const Pick_GenStkLogNo = "/sfapi/PickNoToStkOut/PickGenStkLogNo"
//领料确认
export const Pick_PostStkLogNo = "/sfapi/PickNoToStkOut/PickPostStkLogNo"
//领料单解锁
export const Pick_UnLockPickBill = "/sfapi/PickNoToStkOut/UnLockPickBill"

/*
 * 调拨-移库
 */
//调拨明细
export const ValStkMoveNo_PDA = "/sfapi/StkTran/ValStkMoveNo_PDA"
//调拨暂存
export const StkMoveNoSaveTemp_PDA = "/sfapi/StkTran/StkMoveNoSaveTemp_PDA"
//调拨完成
export const StkMoveNoSave_PDA = "/sfapi/StkTran/StkMoveNoSave_PDA"
//解锁单据
export const StkMoveNoCancel_PDA = "/sfapi/StkTran/StkMoveNoCancel_PDA"

/*
 * 在库查询
 */
export const StkQuery_InvSummary = "/sfapi/InvReport/StkQuery_InvSummary"

export const onLogin = (params) => {
	return request(baseURL + login, 'GET', params).then(v => v)
}
