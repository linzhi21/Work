/** 用户接口 */
import {
  GET,
  POST,
  GET_WITHOUTTOKEN
} from '../axios';
import $store from '../../store';
import apiConfig from './apiConfig';

/** 用户登陆
 * @param {Object} data
 * @param {String} data.username
 * @param {String} data.password
 */
export const login = async (data) => {
  const res = await GET(data, apiConfig.userLogin);

    $store.commit("SET_ACCESS_TOKEN", res.access_token);
    $store.commit("SET_TOKEN_TYPE", res.token_type);
    $store.commit("SET_REFRESH_TOKEN", res.refresh_token);

  return res;
};

export const ivLogin = async (data) => {
  const res = await GET(data, apiConfig.ivLogin);

   $store.commit("SET_ACCESS_TOKEN", res.access_token);
   $store.commit("SET_TOKEN_TYPE", res.token_type);
   $store.commit("SET_REFRESH_TOKEN", res.refresh_token);

  return res;
};


/** 获取用户信息 */
export const principal = async () => {
  const res = await GET(null, apiConfig.principal);
  $store.commit("SET_USER_INFO", res);
  return res;
};

/** 刷新token */
export const refreshToken = async () => {
  const refresh_token = localStorage.getItem('refresh_token');
  const res = await GET(null, apiConfig.refreshToken, refresh_token);

    $store.commit("SET_ACCESS_TOKEN", res.access_token);
    $store.commit("SET_TOKEN_TYPE", res.token_type);
    $store.commit("SET_REFRESH_TOKEN", res.refresh_token);

  // 每隔一段时间刷新token
  setTimeout(refreshToken, res.expires_in * 900);
  return res;
};

/** 用户登出 */
export const logout = (data) => POST(data, apiConfig.userLogOut);

/** 修改密码 */
export const changPassword = (data) => POST(data, apiConfig.changPassword);

/** 获取用户信息 */
export const geiUserInfo = (data) => POST(data, apiConfig.userLogin);

/** 用户当前所在车间工厂管理 */
export const userWorkshopManage = {
  getList: () => GET(null,apiConfig.userWorkshops),
  setWorkshop: (data, restful) => GET(data,`${apiConfig.userWorkshop}/${restful}`)
}
