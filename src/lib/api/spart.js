/** 通用备件接口 */
import {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE
} from '../axios';
import apiConfig from './apiConfig';
import {
  data
} from 'autoprefixer';

/** 
 * 获取通用备件列表
 * @param {Object} data
 * @param {String} data.name - 备件名称
 * @param {String} data.no - 备件编号
 * @param {Boolean} data.enable - 状态,是否启用
 */
export const queryUniversalSpare = (data) => GET(data, apiConfig.universalSpare);

/** 
 * 获取通用备件详情
 * @param {String} restful - 通用备件唯一标志 ID
 */
export const getUniversalSpare = (data, restful) => GET(data, apiConfig.universalSpare, restful);

/** 
 * 获取BOM开关状态
 * @param {String} restful - 数据字典表的id
 */
export const getEnableBom = (data) => GET(data, apiConfig.getEnableBom);

/** 
 * BOM开关
 * @param {Object} data
 * @param {Boolean} data.enable - 开/关
 * @param {String} restful - 数据字典表的id
 */
export const enableBom = (data, restful = 1) => PATCH(data, apiConfig.enableBom, restful);

/** 
 * BOM开关历史记录
 * @param {Object} data
 */
export const bomHistory = (data) => GET(data, apiConfig.bomHistory);

/** 
 * 获取备件列表
 * @param {Object} data
 * @param {String} data.name - 备件名称
 * @param {String} data.no - 备件编号
 * @param {Boolean} data.common - 状态,是否常用
 */
export const querySpare = (data) => GET(data, apiConfig.spare);

/** 
 * 获取备件详情
 * @param {String} restful - 备件唯一标志 ID
 */
export const getSpare = (data, restful) => GET(data, apiConfig.spare, restful);

/** 查询返修上限列表 */
export const getRepairLimitList = (data) => GET(data, apiConfig.repairLimit);

/** 修改返修上限列表 */
export const changeRepairLimit = (data) => PATCH(data, apiConfig.repairLimit);

/** 单个备件损坏登记
 * @param {String} restful - 通用备件唯一标志 ID
 */
export const breakDownRegister = (data, restful) => PUT(data, apiConfig.breakDownRegister, restful);

/** 
 * 批量备件损坏登记
 */
export const breakDownRegisterBatch = (data) => POST(data, apiConfig.breakDownRegisterBatch);

/** 获取常用备件频次 */
export const getCommonSpare = (data, restful) => GET(data, apiConfig.commonSpare, restful);

/** 修改常用备件频次 */
export const changeCommonSpare = (data) => PATCH(data, apiConfig.commonSpare);

/**获取单个BOM备件详情(提供给设备微服务调用)**/
export const bomSpare = (data, id) => GET(data, apiConfig.spare, id)

/**
 * 手动同步备件库存
 * @param {*} data 
 */
export const syncSpareInventory = (data) => GET(data, `${apiConfig.spare}/sync-spare-inventory`);

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
  getList: (data) => GET(data, apiConfig.spareConsuming),
  getDetail: (data, restful) => GET(data, apiConfig.spareConsuming, restful),
  approval: (data, restful) => PATCH(data, apiConfig.approval, restful),
  add: (data) => POST(data, apiConfig.spareConsuming),
  update: (data) => PUT(data, apiConfig.spareConsuming),
}

/** 损坏备件 */
export const breakdown = {
  getList: (data) => GET(data, apiConfig.spareBreakdown),
  getDetail: (data, restful) => GET(data, apiConfig.spareBreakdown, restful),
}

/** 损坏备件处理 */
export const spareBreakdown = {
  getList: (data) => GET(data, apiConfig.spareBreakdown),
  getOne: (data, id) => GET(data, apiConfig.spareBreakdown, id),
  /** 获取工业垃圾详情 */
  rubbish: (data, restful) => GET(data, apiConfig.rubbish, restful),
  /** 获取单个报废备件详情 */
  scrap: (data, restful) => GET(data, apiConfig.scrap, restful),
  /** 工业垃圾审批 */
  rubbishApproval: (data, restful) => PATCH(data, apiConfig.rubbishApproval, restful),
  /** 备件报废审批 */
  scrapApproval: (data, restful) => PATCH(data, apiConfig.scrapApproval, restful),
  /** 委内维修审批 */
  inRepairApproval: (data, restful) => PATCH(data, apiConfig.inRepairApproval, restful),
  /** 备件报废转移 */
  scrapTransfer: (data, restful) => POST(data, apiConfig.scrapTransfer, restful),
}

// 备件修理管理
export const spairRrepair = {
  getList: (data) => GET(data, apiConfig.spairRrepair),
  getOne: (data, id) => GET(data, apiConfig.spairRrepair, id),
  inner: (data, id) => POST(data, `${apiConfig.spairRrepair}/inner`),
  outer: (data, id) => POST(data, `${apiConfig.spairRrepair}/outer`),
}

/**
 * sap库存
 */
export const sap = {
  inventory: (data) => GET(data, `${apiConfig.sapUrl}spare/inventory`),
}
