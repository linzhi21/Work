/** 统计报表接口 */
import { GET, POST, DELETE } from '../axios';
import apiConfig from './apiConfig';

/**
 * 巡检根据区域统计接单数量
 * @param {*} data 
 */
export const inspectionCountBasedOnArea = (data) => GET(data, apiConfig.inspectionCountBasedOnArea);

/**
 * 展示所有人接单数量根据接单数量排序展示(保养)
 * @param {*} data 
 */
export const statisticsForMaintain = (data) => GET(data, apiConfig.statisticsForMaintain);

/**
 * 维修时间统计
 * @param {*} data 
 */
export const statisticsForMaintenanceCost = (data) => GET(data, apiConfig.statisticsForMaintenanceCost);

/**
 * 当天维修设备清单
 * @param {*} data 
 */
export const statisticsForMaintenanceRepairList = (data) => GET(data, apiConfig.statisticsForMaintenanceRepairList);

/**
 * 当天报修设备清单
 * @param {*} data 
 */
export const statisticsForMaintenanceSubmitList = (data) => GET(data, apiConfig.statisticsForMaintenanceSubmitList);

/**
 * 展示所有人接单数量根据接单数量排序展示
 * @param {*} data 
 */
export const pointCheckCountBasedOnArea = (data) => GET(data, apiConfig.pointCheckCountBasedOnArea);

/**
 * 展示所有人接单数量根据接单时间排序展示
 * @param {*} data 
 */
export const statisticsForReceivedHour = (data) => GET(data, apiConfig.statisticsForReceivedHour);

/**
 * 查询工单数量
 * @param {*} data 
 */
export const statisticsForWorkOrder = (data) => GET(data, apiConfig.statisticsForWorkOrder);

export const maintainCountBasedOnArea = (data) => GET(data, apiConfig.maintainCountBasedOnArea);

/**
 * 维修设备影响生产时间统计
 * @param {*} data 
 * @returns 
 */
export const maintenanceTimes = (data) => GET(data, apiConfig.maintenanceTimes);