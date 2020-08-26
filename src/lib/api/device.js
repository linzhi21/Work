/** 设备接口 */
import { GET, POST, PUT, PATCH, DELETE } from '../axios';
import apiConfig from './apiConfig';

/** 查询设备列表
 * @param {Object} data
 * @param {String} data.name - 设备名称
 * @param {String} data.no - 设备简称代号
 * @param {String} data.page - 第几页
 * @param {String} data.size - 每页多少条数据
 * @param {String} data.workshopAreaId - 区域ID
 * @param {String} data.workshopSectionId - 工段ID
 * @param {String} data.workshopTeamId - 班组ID
 */
export const device = (data) => GET(data, apiConfig.device);

/** 查询单个设备
 * @param {Null} data
 * @param {String} restful - 设备唯一标志 ID
 */
export const queryDevice = (data, restful) => GET(data, apiConfig.device, restful);

/** 添加设备详情
 * @description - 添加设备只有通过导入添加，此接口暂时没用
 */
export const addFactory = (data) => POST(data, apiConfig.device);

/** 修改设备信息
 * @param {Object} data
 * @param {String} data.comment - 设备备注
 * @param {String} data.deviceStatusId - 设备状态ID
 * @param {String} data.deviceType - 设备类型
 * @param {Boolean|String|Number} data.enable - 是否启用，1：是；0：否
 * @param {String} data.functionGroupCode - 所属功能组编号
 * @param {String} data.functionGroupName - 所属功能组
 * @param {String} data.manufacturer - 生产厂商
 * @param {String} data.name - 设备名称
 * @param {String} data.no - 设备编号
 * @param {Boolean|String|Number} data.normal - 是否正常，1：是；0：否
 * @param {String} data.plc - 设备所属PLC
 * @param {String} data.qrPicId - 设备二维码图片，附件ID
 * @param {String} data.repairTimes - 设备维修次数
 * @param {Boolean|String|Number} data.start - 是否开启，1：是；0：否
 * @param {String} data.workStationId - 设备工位ID
 * @param {String} data.workshopAreaId - 所属区域ID
 * @param {String} data.workshopId - 所属车间ID
 * @param {String} data.workshopSectionId - 所属工段ID
 * @param {String} data.workshopTeamId - 所属班组ID
 * @param {String} restful - 设备唯一标志
 */
export const putDevice = (data, restful) => PUT(data, apiConfig.device, restful);


/** 查询异常领用列表
 * @param {Object} data
 * @param {Boolean} data.abnormalConsuming - 是否异常领用
 * @param {String} data.consumerId - 领用人ID
 * @param {String} data.deviceId - 设备ID
 * @param {String} data.deviceName - 设备名称
 * @param {String} data.deviceNo - 设备编号
 * @param {String} data.startTime - 领用时间起
 * @param {String} data.endTime - 领用时间止
 * @param {String} data.maintenanceNo - 维修单编号
 * @param {String} data.page - 第几页
 * @param {String} data.size - 每页多少条数据
 * @param {String} data.spareName - 备件名称
 * @param {String} data.spareNo - 备件编号
 */
export const queryAbnormalConsuming = (data) => GET(data, apiConfig.getAbnormalConsuming);

/** 获取单条异常领用详情
 * @param {String} restful - 异常领用标识
 */
export const getAbnormalConsumingDetail = (data, restful) => GET(data, apiConfig.getAbnormalConsumingDetail, restful);

/** 查询BOM备件列表
 * @param {Object} data
 * @param {String} data.deviceId - 设备id
 * @param {String} data.page - 第几页
 * @param {String} data.size - 每页多少条数据
 */
export const queryBom = (data, restful) => GET(data, apiConfig.getBom, restful);

/** 获取单个备件详情
 * @param {String} restful - 备件标识
 */
export const getBomDetail = (data, restful) => GET(data,apiConfig.getBomDetail, restful);

/** 获取设备状态列表
 * @param {Object} data
 * @param {String} data.page - 第几页
 * @param {String} data.size - 每页多少条数据
 * @param {String} data.key - 状态名称
 * @param {Boolean} data.enable - 使用状态
 */
export const queryDeviceStatus = (data) => GET(data,apiConfig.deviceStatus);

/** 获取单个设备状态详情
 * @param {String} restful - 备件标识
 */
export const getDeviceStatusDetail = (data, restful) => GET(data,apiConfig.deviceStatus, restful);

/** 修改设备状态
 * @param {Object} data
 * @param {String} data.enable - 第几页
 * @param {String} data.key - 设备状态名称
 * @param {String} data.value - 状态描述
 * @param {String} restful - 设备状态标识
 */
export const addDeviceStatus = (data) => POST(data,apiConfig.deviceStatus);

/** 修改设备状态
 * @param {Object} data
 * @param {String} data.enable - 第几页
 * @param {String} data.key - 设备状态名称
 * @param {String} data.value - 状态描述
 * @param {String} restful - 设备状态标识
 */
export const changeDeviceStatus = (data,restful) => PUT(data,apiConfig.deviceStatus,restful);

/** 获取设备生产线列表
 * @param {Object} data
 */
export const getDeviceName = (data) => GET(data,apiConfig.getDeviceName);


// 设备管理
export const deviceManage = {
  add: (data) => POST(data, apiConfig.device),
  getLists: (data) => GET(data, apiConfig.device),
  getOne: (data, restful) => GET(data, apiConfig.device + '/' + restful),
  remove: (data) => DELETE(data, apiConfig.device),
  edit: (data, restful) => PATCH(data, apiConfig.device + '/' + restful),
  getNames: (data) => GET(data, apiConfig.device + '/names'),
}

export const bomManage = {
  add: (data) => POST(data, apiConfig.bom),
  getLists: (data) => GET(data, apiConfig.bom),
  getOne: (data, restful) => GET(data, apiConfig.bom + '/' + restful),
  remove: (data) => DELETE(data, apiConfig.bom),
  edit: (data, restful) => PATCH(data, apiConfig.bom + '/' + restful),
  getNames: (data) => GET(data, apiConfig.bom + '/names'),
}
// 设备状态管理
export const deviceStatusManage = {
  add: (data) => POST(data, apiConfig.deviceStatus),
  getLists: (data) => GET(data, apiConfig.deviceStatus),
  getOne: (data, restful) => GET(data, apiConfig.deviceStatus + '/' + restful),
  remove: (data) => DELETE(data, apiConfig.deviceStatus),
  edit: (data, restful) => PATCH(data, apiConfig.deviceStatus + '/' + restful),
  getNames: (data) => GET(data, apiConfig.deviceStatus + '/names'),
}
