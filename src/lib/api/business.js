/** 工厂基础管理接口 */
import {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE
} from '../axios';
import apiConfig from './apiConfig';

// 维修管理
export const maintenanceManage = {
  add: (data) => POST(data, apiConfig.maintenanceManage),
  getLists: (data) => GET(data, apiConfig.maintenanceManage),
  getOne: (data, restful) => GET(data, apiConfig.maintenanceManage + '/' + restful),
  remove: (data) => DELETE(data, apiConfig.maintenanceManage),
  edit: (data, restful) => PUT(data, `${apiConfig.maintenanceManage}/${restful}`),
  exportRecord:(data)=>GET(data,apiConfig.maintenanceManage+'/export')
}

// 故障类型管理
export const faultTypeManage = {
  add: (data) => POST(data, apiConfig.faultType),
  getList: (data) => GET(data, apiConfig.faultType),
  edit: (data) => PUT(data, apiConfig.faultType),
  remove: (data) => DELETE(data, apiConfig.faultType),
  getNames: (data) => GET(data, apiConfig.faultType + '/names')
}

// 故障类型控制
export const faultTypeController = {
  add: (data) => POST(data, apiConfig.faultType),
  getList: (data) => GET(data, apiConfig.faultType),
  edit: (data) => PUT(data, apiConfig.faultType),
  remove: (data) => DELETE(data, apiConfig.faultType),
  getNames: (data) => GET(data, apiConfig.faultType + '/names')
}

// 问题上升设置管理
export const problemUpManage = {
  add: (data) => POST(data, apiConfig.problemUp),
  getList: (data) => GET(data, apiConfig.problemUp),
  edit: (data) => PUT(data, apiConfig.problemUp),
  remove: (data) => DELETE(data, apiConfig.problemUp),
}

// 紧急程度管理
export const emergencyDegree = {
  add: (data) => POST(data, apiConfig.emergencyDegree),
  getList: (data) => GET(data, apiConfig.emergencyDegree),
  edit: (data) => PUT(data, apiConfig.emergencyDegree),
  remove: (data) => DELETE(data, apiConfig.emergencyDegree),
  getNames: (data) => GET(data, apiConfig.emergencyDegree + '/names')
}

// 大故障时间管理
export const bigFaultTimeManage = {
  get: () => GET(null, apiConfig.bigFaultTime),
  edit: (data) => POST(data, apiConfig.bigFaultTime),
}