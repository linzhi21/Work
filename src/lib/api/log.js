/** 日志接口 */
import { GET, POST, PUT, PATCH, DELETE } from '../axios';
import apiConfig from './apiConfig';


/** 查询设备列表
 * @param {Object} data
 * @param {String} data.method - 方法: Login
 * @param {String} data.operation - 设备简称代号
 * @param {String} data.page - 第几页
 * @param {String} data.size - 每页多少条数据
 */
export const getLog = (data) => GET(data, apiConfig.log);