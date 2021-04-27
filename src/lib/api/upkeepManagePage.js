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
 * @description 更新保养计划
 * @param {null} data 默认为空 
 * @param {Number} id 当前保养数据的id编号  
 */
export const updatePlanDetail=(data,id)=>PATCH(data,apiConfig.maintainPlan,id)

/**
 * @description  导入保养数据
 * @param {Obejct} data
 * @param {formData} data.file
 * @param {String} data.workshopName
 */
export const importFile=(data)=>POST(data,`${apiConfig.maintainPlan}/import`)

/**
 * @description 删除指定的保养数据
 * @param {null} data 默认为空 
 * @param {Number} id 当前保养数据的id编号  
 */
export const deletePlanDetail=(data,id)=>DELETE(data,apiConfig.maintainPlan,id)


/**
 * @description 查看工单列表
 * @param {Object} data 
 * @param {String} data.no 工单编号
 * @param {String} data.planName 计划名称 
 * @param {Number} data.status 状态
 */
export const maintainWorkOrder=(data)=>GET(data,apiConfig.maintainWorkOrder)

/**
 * 修改工单状态
 * @param {*} data : {status 状态 1 待接单| 2···}
 * @param {*} id : 工单ID
 */
export const updateMaintainWorkOrder=(data, id)=>PATCH(data,apiConfig.maintainWorkOrder, id)


/**
 * @description 查看工单详情
 * @param {Number} id 工单id 
 */
export const maintainWorkOrderDetail=(data,id)=>GET(data,apiConfig.maintainWorkOrder,id)

/**
 * @description 保养变更记录
 */
export const maintainPlanChanges=(data)=>GET(data,apiConfig.maintainPlanChanges);
