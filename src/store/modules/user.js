const state = {
  userInfo: {},
  access_token: '',
  token_type: '',
  refresh_token: '',
  workshopName: ''
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
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

export default {
  state,
  mutations,
  actions
};
