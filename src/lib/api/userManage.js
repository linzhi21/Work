/** 用户管理接口 */
import {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE
} from '../axios';
import apiConfig from './apiConfig';
import $store from '../../store';


/** 查询用户列表 */
export const getUserLists = (data) => GET(data, apiConfig.userManage);

/** 查询用户下拉列表 */
export const getUserDropList = (data) => GET(data, apiConfig.userManage, 'drop-down-list');

/** 获取单个用户 */
export const getOneUser = (data, restful) => GET(data, apiConfig.userManage + '/' + restful);

/** 添加用户 */
export const addUser = (data) => POST(data, apiConfig.userManage);

/** 修改用户 */
export const editUser = (data) => PATCH(data, apiConfig.userManage + '/' + data.id);

/** 删除用户 */
export const removeUser = (data) => DELETE(data, apiConfig.userManage);

/** 修改密码 */
export const editUserPassword = (data) => PATCH(data, `${apiConfig.userManage}/update-password`);

/** 获取用户菜单列表 */
export const getUserMenus = async (data) => {
  const res = await GET(data, apiConfig.userMenus);
  $store.commit('SET_MENUS', res.data);
  return res;
};

/** 导入用户数据**/
export const importData = (data) => POST(data, `${apiConfig.userManage}/import`);

export const spareAppraiser = (data) => GET(data, `${apiConfig.userManage}/spare-appraiser`);
