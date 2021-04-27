/**  */
import { GET, POST, PUT, PATCH, DELETE } from '../axios';
import apiConfig from './apiConfig';

export const messageManage = {
    getList: (data) => GET(data, apiConfig.message),
    getDetail: (data, restful) => GET(data, `${apiConfig.message}/${restful}`),
    delete: (data) => DELETE(data, apiConfig.message),
    /** 清空消息 */
    cleanAll: (data) => DELETE(data, `${apiConfig.message}/clean-all`),
    /** 标记单个消息为已读 */
    readOne: (data, restful) => PATCH(data, `${apiConfig.message}/read/${restful}`),
    /** 标记多个消息为已读 */
    readSome: (data, restful) => PATCH(data, `${apiConfig.message}/multi-read/${restful}`),
    /** 标记所有消息为已读 */
    readAll: (data, restful) => PATCH(data, `${apiConfig.message}/read-all`),
    /** 获取未读消息数量 */
    getUnreadCount: () => GET(null, `${apiConfig.message}/unread-num`),
    /** 发送消息到前端 */
    send: (data) => POST(data, apiConfig.message),
};

/**
 * 时限管理
 */
export const timeLimitApi = {
    /**
     * 获取时限管理列表
     */
    getTimeLimit: (data) => GET(data, apiConfig.timeLimit),
    /**
     * 添加时限管理
     */
    postTimeLimit: (data) => POST(data, apiConfig.timeLimit),
    /**
     * 修改时限管理
     */
    putTimeLimit: (data) => PUT(data, apiConfig.timeLimit),
    /**
     * 删除时限管理
     */
    deleteTimeLimit: (data) => DELETE(data, apiConfig.timeLimit),

    timeLimitOrder: (data) => GET(data, `${apiConfig.checkWorkOrder}/overtimelist`),
}

window.messageManage = messageManage;