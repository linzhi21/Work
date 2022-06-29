/** 工厂基础管理接口 */
import {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE
} from '../axios';
import apiConfig from './apiConfig';




// 区域管理
export const workshopAreaManage = {
  add: (data) => POST(data, apiConfig.workshopAreaManage),
  getLists: (data) => GET(data, apiConfig.workshopAreaManage),
  getOne: (data, restful) => GET(data, apiConfig.workshopAreaManage + '/' + restful),
  remove: (ids) => DELETE(ids, `${apiConfig.workshopAreaManage}?ids=${ids}`),
  edit: (data, restful) => PATCH(data, apiConfig.workshopAreaManage + '/' + restful),
  getNames: (data) => GET(data, apiConfig.workshopAreaManage + '/names')
}


// 字典表管理
export const sysConfigManage = {
  add: (data) => POST(data, apiConfig.sysConfigManage),
  getLists: (data) => GET(data, apiConfig.sysConfigManage),
  getOne: (data, restful) => GET(data, apiConfig.sysConfigManage + '/' + restful),
  remove: (data) => DELETE(data, apiConfig.sysConfigManage),
  edit: (data, restful) => PATCH(data, apiConfig.sysConfigManage + '/' + restful),
}


// 岗位管理
export const sysPositionManage = {
  add: (data) => POST(data, apiConfig.sysPositionManage),
  getLists: (data) => GET(data, apiConfig.sysPositionManage),
  getOne: (data, restful) => GET(data, apiConfig.sysPositionManage + '/' + restful),
  remove: (ids) => DELETE(ids, `${apiConfig.sysPositionManage}?ids=${ids}`),
  edit: (data, restful) => PATCH(data, apiConfig.sysPositionManage + '/' + restful),
  getNames: (data) => GET(data, apiConfig.sysPositionManage + '/names')
}

// 工位管理
export const workStationManage = {
  add: (data) => POST(data, apiConfig.workStationManage),
  getLists: (data) => GET(data, apiConfig.workStationManage),
  getOne: (data, restful) => GET(data, apiConfig.workStationManage + '/' + restful),
  remove: (ids) => DELETE(ids, `${apiConfig.workStationManage}?ids=${ids}`),
  edit: (data, restful) => PATCH(data, apiConfig.workStationManage + '/' + restful),
  getNames: (data) => GET(data, apiConfig.workStationManage + '/names')
}

// 工厂管理
export const factoryManage = {
  add: (data) => POST(data, apiConfig.factoryManage),
  getLists: (data) => GET(data, apiConfig.factoryManage),
  getOne: (data, restful) => GET(data, apiConfig.factoryManage + '/' + restful),
  remove: (data,ids) => DELETE(data, `${apiConfig.factoryManage}`+ '/' + ids),
  edit: (data, restful) => PATCH(data, apiConfig.factoryManage + '/' + restful),
  getNames: (data) => GET(data, apiConfig.factoryManage + '/names')
}

// 工段管理
export const workshopSectionManage = {
  add: (data) => POST(data, apiConfig.workshopSectionManage),
  getLists: (data) => GET(data, apiConfig.workshopSectionManage),
  getOne: (data, restful) => GET(data, apiConfig.workshopSectionManage + '/' + restful),
  remove: (ids) => DELETE(ids, `${apiConfig.workshopSectionManage}?ids=${ids}`),
  edit: (data, restful) => PATCH(data, apiConfig.workshopSectionManage + '/' + restful),
  getNames: (data) => GET(data, apiConfig.workshopSectionManage + '/names')
}

// 班次管理
export const workshopShiftManage = {
  add: (data) => POST(data, apiConfig.workshopShiftManage),
  getLists: (data) => GET(data, apiConfig.workshopShiftManage),
  getOne: (data, restful) => GET(data, apiConfig.workshopShiftManage + '/' + restful),
  remove: (ids) => DELETE(ids, `${apiConfig.workshopShiftManage}?ids=${ids}`),
  edit: (data, restful) => PATCH(data, apiConfig.workshopShiftManage + '/' + restful),
  getNames: (data) => GET(data, apiConfig.workshopShiftManage + '/names')
}

// 班组管理
export const workshopTeamManage = {
  add: (data) => POST(data, apiConfig.workshopTeamManage),
  getLists: (data) => GET(data, apiConfig.workshopTeamManage),
  getOne: (data, restful) => GET(data, apiConfig.workshopTeamManage + '/' + restful),
  remove: (ids) => DELETE(ids, `${apiConfig.workshopTeamManage}?ids=${ids}`),
  edit: (data, restful) => PATCH(data, apiConfig.workshopTeamManage, restful),
  getNames: (data) => GET(data, apiConfig.workshopTeamManage + '/names')
}

// 角色管理
export const roleManage = {
  add: (data) => POST(data, apiConfig.roleManage),
  getLists: (data) => GET(data, apiConfig.roleManage),
  getOne: (data, restful) => GET(data, apiConfig.roleManage + '/' + restful),
  remove: (data) => DELETE(data, apiConfig.roleManage),
  edit: (data, restful) => PATCH(data, apiConfig.roleManage + '/' + restful),
  getNames: (data) => GET(data, apiConfig.roleManage + '/drop-down-list'),
  epxort: (data) => GET(data, `${apiConfig.roleManage}/export`),
}

// 车间管理
export const workshopManage = {
  add: (data) => POST(data, apiConfig.workshopManage),
  getLists: (data) => GET(data, apiConfig.workshopManage),
  getNames: (data) => GET(data, apiConfig.workshopManage + '/names'),
  getOne: (data, restful) => GET(data, apiConfig.workshopManage + '/' + restful),
  remove: (data,ids) => DELETE(data, `${apiConfig.workshopManage}?ids=${ids}`),
  edit: (data, restful) => PATCH(data, apiConfig.workshopManage + '/' + restful),
  getBom:(data, restful) => GET(data, apiConfig.workshopManage + '/' + restful+'/switch'),
  getBomHistory:(data, restful) => GET(data, apiConfig.workshopManage + '/' + restful+'/switch/history'),
}

// 权限管理
export const authManage = {
  add: (data) => POST(data, apiConfig.authManage),
  getLists: (data) => GET(data, apiConfig.authManage),
  getOne: (data, restful) => GET(data, apiConfig.authManage + '/' + restful),
  remove: (data) => DELETE(data, apiConfig.authManage),
  edit: (data) => PUT(data, apiConfig.authManage),

  getParentChild: (data, restful) => GET(data, apiConfig.authManage + '/' + restful + '/children'),
  getRoot: (data) => GET(data, apiConfig.authManage + '/root'),
  getTree: (data) => GET(data, apiConfig.authManage + '/tree'),
}

// 周期管理
export const cycleManage = {
  add: (data) => POST(data, apiConfig.cycleManage),
  getLists: (data) => GET(data, apiConfig.cycleManage),
  getOne: (data, restful) => GET(data, apiConfig.cycleManage + '/' + restful),
  remove: (data,ids) => DELETE(data,`${apiConfig.cycleManage}?ids=${ids}`),
  edit: (data, restful) => PATCH(data, apiConfig.cycleManage+ '/' + restful),
  getWorkShopNames:(data,restful) => GET(data, apiConfig.cycleManage+ '/' + restful+'/cycle/names'),
}

// 周期管理
export const handoverManage = {
  add: (data) => POST(data, apiConfig.handoverManage),
  getLists: (data) => GET(data, apiConfig.handoverManage),
  getOne: (data, restful) => GET(data, apiConfig.handoverManage + '/' + restful),
  remove: (data) => DELETE(data, apiConfig.handoverManage),
  edit: (data) => PATCH(data, apiConfig.handoverManage),
  getWorkShopNames:(data,restful) => GET(data, apiConfig.handoverManage+ '/' + restful+'/cycle/names'),
}

/** 查询权限列表 */
export const getAuthLists = (data) => GET(data, apiConfig.authManage);


/**
 * 导入基础信息
 * @param {*} data 
 */
export const baseImport = (data) => POST(data, apiConfig.baseImport);
