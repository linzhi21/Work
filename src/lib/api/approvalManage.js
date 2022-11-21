/** 审批流管理接口 */
import { GET, POST, PUT, PATCH, DELETE } from '../axios';
import apiConfig from './apiConfig';

// 审批流管理
export const workflowManage={
    add:(data) => POST(data, apiConfig.workflowManage),
    getLists:(data) => GET(data, apiConfig.workflowManage),
    getOne:(data, restful) => GET(data, apiConfig.workflowManage+'/'+restful),
    remove:(data, restful) => DELETE(data, apiConfig.workflowManage+'/'+restful),
    edit:(data) => PUT(data, apiConfig.workflowManage)
}


// 审批流节点管理
export const workflowNodeManage={
    add:(data) => POST(data, apiConfig.workflowNodeManage),
    getLists:(data) => GET(data, apiConfig.workflowNodeManage),
    getOne:(data, restful) => GET(data, apiConfig.workflowNodeManage+'/'+restful),
    remove:(data, restful) => DELETE(data, apiConfig.workflowNodeManage+'/'+restful),
    edit:(data) => PUT(data, apiConfig.workflowNodeManage),
}


// 进行中的审批流管理
export const workflowRuningManage={
    add:(data) => POST(data, apiConfig.workflowRuningManage),
    getLists:(data) => GET(data, apiConfig.workflowRuningManage),
    getOne:(data, restful) => GET(data, apiConfig.workflowRuningManage+'/'+restful),
    getId:(data, restful) => GET(data, apiConfig.workflowRuningManage+'/workflow-id'+'/'+restful),
    remove:(data, restful) => DELETE(data, apiConfig.workflowRuningManage+'/'+restful),
    edit:(data) => PUT(data, apiConfig.workflowRuningManage),
}
