/** 工厂基础管理接口 */
import {
    GET,
    POST,
    PUT,
    PATCH,
    DELETE
  } from '../axios';
  import apiConfig from './apiConfig';


export const showDetail = (data, restful) => GET(data, apiConfig.maintenanceManage, restful); 

export const edit=(data)=>PUT(data, apiConfig.maintenanceManage);

export const add=(data)=>POST(data, apiConfig.maintenanceManage);

export const del=(data)=>DELETE(data,apiConfig.maintenanceManage)