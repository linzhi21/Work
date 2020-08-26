/** 通用备件接口 */
import { GET, POST, PUT, PATCH, DELETE } from '../axios';
import apiConfig from './apiConfig';
import { data } from 'autoprefixer';

/** 获取通用备件列表
 * @param {Object} data
 * @param {String} data.name - 备件名称
 * @param {String} data.no - 备件编号
 * @param {Boolean} data.enable - 状态,是否启用
 */
export const queryUniversalSpare = (data) => GET(data, apiConfig.universalSpare);

/** 获取通用备件详情
 * @param {String} restful - 通用备件唯一标志 ID
 */
export const getUniversalSpare = (data, restful) => GET(data, apiConfig.universalSpare, restful);

/** 获取BOM开关状态
 * @param {String} restful - 数据字典表的id
 */
export const getEnableBom = (data) => GET(data, apiConfig.getEnableBom);

/** BOM开关
 * @param {Object} data
 * @param {Boolean} data.enable - 开/关
 * @param {String} restful - 数据字典表的id
 */
export const enableBom = (data, restful = 1) => PATCH(data, apiConfig.enableBom, restful);

/** BOM开关历史记录
 * @param {Object} data
 */
export const bomHistory = (data) => GET(data, apiConfig.bomHistory);

/** 获取备件列表
 * @param {Object} data
 * @param {String} data.name - 备件名称
 * @param {String} data.no - 备件编号
 * @param {Boolean} data.common - 状态,是否常用
 */
export const querySpare = (data) => GET(data, apiConfig.spare);

/** 获取备件详情
 * @param {String} restful - 备件唯一标志 ID
 */
export const getSpare = (data, restful) => GET(data, apiConfig.spare, restful);

/** 查询返修上限列表 */
export const getRepairLimitList = (data) => GET(data, apiConfig.repairLimit);

/** 修改返修上限列表 */
export const changeRepairLimit = (data, restful) => PATCH(data, apiConfig.repairLimit, restful);

/** 单个备件损坏登记
 * @param {String} restful - 通用备件唯一标志 ID
 */
export const breakDownRegister = (data, restful) => POST(data, apiConfig.breakDownRegister, restful);

/** 批量备件损坏登记
 * @param {String} restful - 通用备件唯一标志 ID
 */
export const breakDownRegisterBatch = (data, restful) => POST(data, apiConfig.breakDownRegisterBatch, restful);

/** 获取常用备件库设置 */
export const getCommonSpare = (data, restful) => GET(data, apiConfig.commonSpare, restful);

/** 修改返修上限列表 */
export const changeCommonSpare = (data, restful) => PATCH(data, apiConfig.commonSpare, restful);

/** 备件批准管理 */
export const spareApprove = {
    getList: (data) => GET(data, apiConfig.spareApprove),
    getDetail: (data) => GET(data, apiConfig.spareApproveDetail),
    add: (data) => POST(data, apiConfig.spareApprove),
    change: (data) => PUT(data, apiConfig.spareApprove),
    delete: (data) => DELETE(data, apiConfig.spareApprove)
}

/** 备件领用 */
export const spareConsuming = {
    getList: (data) => GET(data,apiConfig.spareConsuming),
    getDetail: (data, restful) => GET(data, apiConfig.spareConsuming, restful),
    approval: (data, restful) => PATCH(data, apiConfig.approval, restful),
}

/** 损坏备件 */
export const breakdown = {
    getList: (data) => GET(data,apiConfig.breakdown),
    getDetail: (data, restful) => GET(data, apiConfig.breakdown, restful),
}

/** 损坏备件处理 */
export const spareBreakdown = {
    getList: (data) => GET(data,apiConfig.spareBreakdown),
    /** 获取工业垃圾详情 */
    rubbish: (data, restful) => GET(data,apiConfig.rubbish, restful),
    /** 获取单个报废备件详情 */
    scrap: (data, restful) => GET(data,apiConfig.scrap, restful),
    /** 工业垃圾审批 */
    rubbishApproval: (data, restful) => PATCH(data,apiConfig.rubbishApproval, restful),
    /** 备件报废审批 */
    scrapApproval: (data, restful) => PATCH(data,apiConfig.scrapApproval, restful),
    /** 委内维修审批 */
    inRepairApproval: (data, restful) => PATCH(data,apiConfig.inRepairApproval, restful),
    /** 备件报废转移 */
    scrapTransfer: (data, restful) => PATCH(data,apiConfig.scrapTransfer, restful),
}