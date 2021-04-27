/** 点检管理 */
import {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE
} from '../axios';
import apiConfig from './apiConfig';

/** 查询点检计划列表
 * @param {Object} data
 * @param {String} data.no - 点检计划编号
 * @param {String} data.type - 类型
 * @param {String} data.status - 状态
 * @param {String} data.page - 第几页
 * @param {String} data.size - 每页多少条数据
 * @param {String} data.deviceName - 设备(生产线)名称
 */
export const planList = (data) => GET(data, apiConfig.plan);

/** 点检计划详情
 * @param {Null} data
 * @param {String} restful -  点检计划ID
 */
export const queryPlan = (data, restful) => GET(data, apiConfig.plan, restful);

/** 点检计划列表查询单个点检工单
 * @param {Null} data
 * @param {String} restful - 点检计划ID  id+/workorders
 */
export const oneWorkorders = (data, restful) => GET(data, apiConfig.plan, restful);

/** 获取单个区域详情
 * @param {Null} data
 * @param {String} restful - 点检工单ID
 */
export const workshopAreaManage = (data, restful) => GET(data, apiConfig.workshopAreaManage, restful);

/** 获取单个车间详情
 * @param {Null} data
 * @param {String} restful - 点检工单ID
 */
export const workshopManage = (data, restful) => GET(data, apiConfig.workshopManage, restful);

/** 查询工段列表下拉列表
 * @param {Null} data
 */
export const workshopSectionSelect = (data) => GET(data, apiConfig.workshopSectionSelect);

/** 查询工位列表
 * @param {Null} data
 */
export const workStationSelect = (data) => GET(data, apiConfig.workStationSelect);

/** 查询状态列表
 * @param {Null} data
 */
export const planStatusSelect = (data) => GET(data, apiConfig.planStatusSelect);

/** 查询周期列表
 * @param {Null} data
 * @param {String} restful - 周期 {workshopId}/cycle/names
 */
export const cycleSelect = (data, restful) => GET(data, apiConfig.cycleSelect, restful);

/** 点检计划编号
 * @param {Null} data
 */
export const planNewNo = (data) => GET(data, apiConfig.planNewNo);

/** 删除点检计划
 * @param {Null} data
 * @param {String} restful - 点检计划ID
 */
export const delPlan = (data, restful) => DELETE(data, apiConfig.plan, restful);

/** 同步图片库
 * @param {Null} data
 */
export const updatePlanPicture = (data) => PATCH(data, apiConfig.updatePlanPicture);

/** 批量导入文件
 * @param {Null} data
 * @param {Null} file  -文件列表
 * @param {Null} worshopName - 车间名称
 */
export const importURLPlanFile = (data) => POST(data, apiConfig.importURLPlanFile);


/** 新增点检计划
 * @param {Object} data
 * @param {String} data.type - 计划类型
 * @param {String} data.no - 计划编号
 * @param {String} data.name - 计划名称
 * @param {String} data.hour - 工时
 * @param {Object} data.planDeviceList
 * @param {String} data.version - 版本
 * @param {String} data.workshopId - 所属车间ID
 * @param {String} data.stationId - 工位ID
 * @param {String} data.sectionId - 工段ID
 * @param {String} data.hour - 工时
 * @param {String} data.qrPicId - 编制人
 * @param {String} data.repairTimes - 编制日期
 * @param {Object} data.planContentList
 * @param {String} data.deviceId - 设备（生产线）ID
 * @param {String} data.executionNode - 操作部位/时间点
 * @param {String} data.content - 工作内容
 * @param {String} data.cycleId - 周期ID
 * @param {String} data.hour - 工时
 */
export const addPlan = (data) => POST(data, apiConfig.plan);

/** 编辑点检计划
 * @param {Object} data
 * @param {String} data.type - 计划类型
 * @param {String} data.status - 状态 (value = "重新发起审批传1,审批通过传2,审批驳回传3,发布计划传5,取消传6")
 * @param {String} data.no - 计划编号
 * @param {String} data.name - 计划名称
 * @param {String} data.hour - 工时
 * @param {Object} data.planDeviceList
 * @param {String} data.version - 版本
 * @param {String} data.workshopId - 所属车间ID
 * @param {String} data.stationId - 工位ID
 * @param {String} data.sectionId - 工段ID
 * @param {String} data.hour - 工时
 * @param {String} data.qrPicId - 编制人
 * @param {String} data.repairTimes - 编制日期
 * @param {Object} data.planContentList
 * @param {String} data.deviceId - 设备（生产线）ID
 * @param {String} data.executionNode - 操作部位/时间点
 * @param {String} data.content - 工作内容
 * @param {String} data.cycleId - 周期ID
 * @param {String} data.hour - 工时
 * @param {String} restful - 设备唯一标志id
 */
export const patchPlan = (data, restful) => PATCH(data, apiConfig.plan, restful);


/** 查询点检工单列表
 * @param {Object} data
 * @param {Boolean} data.no - 点检工单编号
 * @param {String} data.type - 类型
 * @param {String} data.planName - 点检计划名称
 * @param {String} data.planNo - 点检计划编号
 * @param {String} data.status - 状态
 * @param {String} data.page - 第几页
 * @param {String} data.size - 每页多少条数据
 */
export const checkWorkOrder = (data) => GET(data, apiConfig.checkWorkOrder);

/** 点检工单详情
 * @param {Null} data
 * @param {String} restful - 点检工单ID
 */
export const queryWorkorders = (data, restful) => GET(data, apiConfig.checkWorkOrder, restful);

/** 暂停点检工单
 * @param {Null} data  status = 8
 * @param {String} restful - 点检工单ID
 */
export const stopWorkorders = (data, restful) => PATCH(data, apiConfig.checkWorkOrder, restful);

/** 查询点检计划更改记录列表
 * @param {Object} data
 * @param {Boolean} data.no - 点检工单编号
 * @param {String} data.page - 第几页
 * @param {String} data.size - 每页多少条数据
 */
export const checkPlanChanges = (data) => GET(data, apiConfig.checkPlanChanges);


/**
 * @description 导出excel表
 * @param {Objec} data
 * @param {String} data.planId  
 */
export const exportExcel = (data) => GET(data, apiConfig.exportExcel)
