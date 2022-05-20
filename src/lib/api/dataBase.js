/** 工厂基础管理接口 */
import {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE
} from '../axios';
import apiConfig from './apiConfig';

export const dataBaseApi = {
  add: (data) => POST(data, apiConfig.dataBase), // 新增 某个设备下的资料 
  del: (data) => DELETE(data, apiConfig.dataBase), // 删除 某个设备下的资料
  select: (data) => GET(data, apiConfig.dataBase), // 查看 某个设备下的资料
  updateById: (id, data) => PATCH(data, apiConfig.dataBase + '/' + id), // 修改 某个资料
  selectById: (id, data) => GET(data, apiConfig.dataBase + '/' + id), // 查看 某个资料
  preview: () => GET(data, apiConfig.dataBasePreview), // 预览
}

export const dataBaseTypeApi = {
  add: (data) => POST(data, apiConfig.dataBaseType), // 新增 资料类型
  del: (data ,ids) => DELETE(data, `${apiConfig.dataBaseType}?ids=${ids}`), // 删除 资料类型
  select: (data) => GET(data, apiConfig.dataBaseType),// 查看 资料类型
  updateById: (id, data) => PATCH(data, apiConfig.dataBaseType + '/' + id), // 修改 资料类型
  selectById: (data) => GET(data, apiConfig.dataBaseType + '/' + data), // 查看 资料类型
  selectList: (data) => GET(data, apiConfig.dataBaseTypeName), // 资料类型下拉
}