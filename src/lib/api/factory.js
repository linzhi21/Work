/** 工厂接口 */
import { GET, POST, PUT, PATCH, DELETE } from '../axios';
import apiConfig from './apiConfig';

/** 查询工厂列表 */
export const factory = (data) => GET(data, apiConfig.factory);

/** 查询单个工厂
 * @param {String} restful - 工厂唯一标志
 */
export const queryFactory = (data, restful) => GET(data, apiConfig.factory, restful);

/** 添加工厂
 * @param {Object} data
 * @param {String} data.name - 工厂名称
 * @param {String} data.no - 工厂简称代号
 * @param {String} data.description- 工厂描述
 * @param {String} data.managerId - 工厂负责人id
 * @param {String} data.workNo  工厂负责人登陆账号
 * @param {String} data.password - 工厂负责人登陆密码
 */
export const addFactory = (data) => POST(data, apiConfig.factory);

/** 修改工厂信息
 * @param {Object} data
 * @param {String} data.description
 * @param {String} restful - 工厂唯一标志
 */
export const patchFactory = (data, restful) => PATCH(data, apiConfig.factory, restful);


/** 查询单个车间
 * @param {String} restful - 车间唯一标志
 */
export const queryWorkShop = (data, restful) => GET(data, apiConfig.workshop, restful);

/** 新增车间
 * @param {Object} data
 * @param {String} data.factoryId - 工厂id
 * @param {String} data.name - 车间名称
 * @param {String} data.no - 车间简称代号
 * @param {String} data.description - 车间描述
 * @param {Boolean} data.enabled - 是否开启
 * @param {String} data.managerId - 车间负责人id
 * @param {String} data.workNo - 车间负责人登陆账号
 * @param {String} data.password - 车间负责人登陆密码
 */
export const addWorkShop = (data, restful) => POST(data, apiConfig.workshop, restful);


/** 查询单个区域
 * @param {String} restful - 区域唯一标志
 */
export const queryWorkshopArea = (data, restful) => GET(data, apiConfig.workshopArea, restful);

/** 查询区域列表 */
export const getWorkshopArea = (data) => GET(data, apiConfig.workshopArea);

/** 查询设备履历页面区域下拉框列表 */
export const workshopAreaNames = (data) => GET(data, apiConfig.workshopAreaNames);

/** 新增区域
 * @param {Object} data
 * @param {String} data.workshopId - 车间id
 * @param {String} data.no - 岗位编号
 * @param {String} data.name - 岗位名称
 * @param {String} data.parentId - 上级岗位id
 * @param {String} data.description - 岗位描述
 */
export const addWorkshopArea = (data, restful) => POST(data, apiConfig.workshopArea, restful);


/** 查询单个岗位
 * @param {String} restful - 岗位唯一标志
 */
export const querySysPosition = (data, restful) => GET(data, apiConfig.sysPosition, restful);

/** 新增岗位
 * @param {Object} data
 * @param {String} data.workshopId - 车间id
 * @param {String} data.no - 区域名称
 * @param {String} data.name - 区域名称
 * @param {String} data.parentId - 上级区域id
 * @param {String} data.description - 区域描述
 * @param {Boolean} data.enabled - 是否开启
 */
export const addSysPosition = (data, restful) => POST(data, apiConfig.sysPosition, restful);


/** 查询单个工段
 * @param {String} restful - 工段唯一标志
 */
export const queryWorkshopSection = (data, restful) => GET(data, apiConfig.workshopSection, restful);

/** 查询工段列表
 */
export const getWorkshopSection = (data, restful) => GET(data, apiConfig.workshopSection);

/** 新增工段
 * @param {Object} data
 * @param {String} data.workshopId - 车间id
 * @param {String} data.no - 工段编号
 * @param {String} data.name - 工段名称
 * @param {String} data.description - 工段描述
 * @param {Boolean} data.enabled - 是否开启
 */
export const addWorkshopSection = (data, restful) => POST(data, apiConfig.workshopSection, restful);

/** 查询单个班组详情
 * @param {String} restful - 工段唯一标志
 */
export const queryWorkShopTeam = (data, restful) => GET(data, apiConfig.workshopTeam, restful);

/** 查询班组列表
 */
export const getWorkShopTeam = (data, restful) => GET(data, apiConfig.workshopTeam);

/** 新增班组
 * @param {Object} data
 * @param {String} data.workshopId - 车间id
 * @param {String} data.no - 工段编号
 * @param {String} data.name - 工段名称
 * @param {String} data.description - 工段描述
 * @param {Boolean} data.enabled - 是否开启
 */
export const addWorkShopTeam = (data, restful) => POST(data, apiConfig.workshopTeam);

/** 查询车间下拉列表
 */
export const workshopSelect = (data) => GET(data, apiConfig.workshopSelect);