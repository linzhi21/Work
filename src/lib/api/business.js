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
  edit: (data) => PUT(data, apiConfig.maintenanceManage)
}
