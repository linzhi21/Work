import Cookies from "js-cookie";

const state = {
  userInfo: JSON.parse(localStorage.getItem('user_info')) || {},
  access_token: '',
  token_type: '',
  refresh_token: '',
  workshopName: '',
  uploadLoading:false,
  loadingText:'加载中...',
  menus: JSON.parse(localStorage.getItem('menus')) ||[],
};

const mutations = {
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
    localStorage.setItem('user_info', JSON.stringify(userInfo));
  },
  SET_ACCESS_TOKEN: (state, access_token) => {
    state.access_token = access_token
    localStorage.setItem('access_token', access_token);
  },
  SET_TOKEN_TYPE: (state, token_type) => {
    state.token_type = token_type
  },
  SET_REFRESH_TOKEN: (state, refresh_token) => {
    state.refresh_token = refresh_token
    localStorage.setItem('refresh_token', refresh_token);
  },
  SET_WORKSHOPNAME: (state, workshopName)=> {
    state.workshopName = workshopName;
    localStorage.setItem('workshopName', workshopName);
  },
  SET_UPLOADING(state,option){
    state.uploadLoading=option
  },
  SET_MENUS(state,menus){
    state.menus = menus;
    localStorage.setItem('menus', JSON.stringify(menus));
  }
};

const actions = {
  /** 清空用户信息，一般退出登陆时会用到 */
  clear({
    commit
  }) {
    for (let each in mutations) {
      commit(each, '');
    }
    Cookies.remove('iv-user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

export default {
  state,
  mutations,
  actions
};
