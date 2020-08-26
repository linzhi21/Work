/** 保养管理接口 */
import {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE
} from '../axios';
import apiConfig from './apiConfig';


/**
 * @description 保养计划管理列表
 * @param {Obejct} data
 * @param {String} data.deviceName  设备名称
 * @param {Number} pageNumber 页码
 * @param {Number} pageSize 每页显示的页数
 * @param {Number} status 审批状态，1：待审批；2：审批中；4：已退回；8：待发布；16：已发布
 */
export const maintainPlan=(data)=>GET(data,apiConfig.maintainPlan);

/**
 * @description 查看保养计划详情
 * @param {Number}  保养数据id
 */
export const checkPlanDetail=(data,id)=>GET(data,apiConfig.maintainPlan,id)

/**
 * @description 查看保养计划生成的工单
 * @param {Number}  保养数据id
 */
export const checkWorkorders=(data,id)=>GET(data,`${apiConfig.maintainPlan}`,`${id}/workorders`)


/**
 * @description 新增保养计划
 * @param {Object} plan
 */
export const addmaintainPlan=(data)=>POST(data,apiConfig.maintainPlan)

/**
 * @description  导入保养数据
 * @param {Obejct} data
 * @param {formData} data.file
 * @param {String} data.workshopName
 */
export const exportedFile=(data)=>POST(data,`${apiConfig.maintainPlan}/importBY`)

export const deletePlanDetail=(data,id)=>DELETE(data,apiConfig.maintainPlan,id)