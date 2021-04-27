/** 附件接口 */
import { GET, POST, DELETE } from '../axios';
import apiConfig from './apiConfig';




// 文件服务器地址

export const accessoryFile=apiConfig.accessoryFile

/** 查询附件列表
 * @param {Object} data
 * @param {String} data.name - 名称
 * @param {String} data.page - 第几页
 * @param {String} data.size - 每页多少条数据
 */
export const accessoryList = (data) => GET(data, apiConfig.accessory);

/** 删除附件
 * @param {Null} data 
 * @param {String} restful - 附件ID 
 */
export const delAccessory = (data, restful) => DELETE(data, apiConfig.accessory, restful);

/** 下载附件
* @param {Object} data
 * @param {String} restful - 附件ID 
*/
export const downloadAccessory = (data, restful) => GET(data, apiConfig.downloadAccessory, restful);

/** 上传单个附件
* @param {Object} data
 * @param {String} module - 所属模块，1：用户基础数据模块；2：设备模块；4：备件模块；8：资料库；16：专家智库；32：统计；64：其他 
*/
export const uploadAccessory = (data,ids) => POST(data, apiConfig.uploadAccessory,ids);

/** 上传多个附件
* @param {Object} data
 * @param {String} module - 所属模块，1：用户基础数据模块；2：设备模块；4：备件模块；8：资料库；16：专家智库；32：统计；64：其他 
*/
export const uploadAccessoryBatch = (data) => POST(data, apiConfig.uploadAccessoryBatch);