/** 专家智库接口 */
import {
    GET,
    POST,
    PUT,
    PATCH,
    DELETE
  } from '../axios';
  import apiConfig from './apiConfig';
  
  /** 话题 */
  export const themeManage = {
    getList: (data) => GET(data, apiConfig.theme),
    getDetail: (data, restful) => GET(data, `${apiConfig.theme}/${restful}`),
    add: (data) => POST(data, apiConfig.theme),
    /** 分页加载评论 */
    getComments: (data, restful) => GET(data, `${apiConfig.theme}/${restful}/comments`),
    /** 新增专家智库贴下的评论和回复 */
    addComment: (data, restful) => POST(data, `${apiConfig.theme}/${restful}/comments/`),
    // getOne: (data, restful) => GET(data, apiConfig.maintenanceManage + '/' + restful),
    // remove: (data) => DELETE(data, apiConfig.maintenanceManage),
    // edit: (data) => PUT(data, apiConfig.maintenanceManage),
    // exportRecord:(data)=>GET(data,apiConfig.maintenanceManage+'/export')
  }
    
  /** 主题类型 */
  export const themeTypeManage = {
    getList: (data) => GET(data, apiConfig.themeType),
    getDetail: (data, restful) => GET(data, `${apiConfig.themeType}/${restful}`),
    add: (data) => POST(data, apiConfig.themeType),
    edit: (data, restful) => PATCH(data, `${apiConfig.themeType}/${restful}`),
    remove: (data, restful) => DELETE(data, `${apiConfig.themeType}/${restful}`),
  }
    
  /** 专家类型 */
  export const expertTypeManage = {
    getList: (data) => GET(data, apiConfig.expertType),
    getDetail: (data, restful) => GET(data, `${apiConfig.expertType}/${restful}`),
    add: (data) => POST(data, apiConfig.expertType),
    edit: (data, restful) => PATCH(data, `${apiConfig.expertType}/${restful}`),
    remove: (data, restful) => DELETE(data,`${apiConfig.expertType}/${restful}`),
  }

  /** 文件管理 */
  export const fileManage = {
      /** 文件上传地址 */
      uploadUrl: `${apiConfig.uploadAccessory}/16`,
      upload: (data) => POST(data, `${apiConfig.uploadAccessory}/16`),
  }