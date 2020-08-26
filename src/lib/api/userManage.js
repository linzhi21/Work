/** 用户管理接口 */
import { GET, POST, PUT, PATCH, DELETE } from '../axios';
import apiConfig from './apiConfig';


/** 查询用户列表 */
export const getUserLists = (data) => GET(data, apiConfig.userManage);

/** 获取单个用户 */
export const getOneUser =  (data, restful) => GET(data, apiConfig.userManage+'/'+restful);

/** 添加用户 */
export const addUser = (data) => POST(data, apiConfig.userManage);

/** 修改用户 */
export const editUser = (data) => PUT(data, apiConfig.userManage);

/** 删除用户 */
export const removeUser = (data) => DELETE(data, apiConfig.userManage);

/** 修改密码 */
export const editUserPassword = (data) => PATCH(data, apiConfig.userManage);

/** 获取用户菜单列表 */
export const getUserMenus = (data) => GET(data, apiConfig.userMenus);
