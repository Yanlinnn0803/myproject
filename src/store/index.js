import { createStore } from 'vuex';

const store = createStore({
  state: {
    userInfo: {}, // 用户信息存储在 state 中
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo; // 设置用户信息
    },
  },
  actions: {
    // 可以在这里添加其他 actions
  },
  getters: {
    getUserInfo(state) {
      return state.userInfo;
    },
    getUserPhone(state) {
      return state.userInfo.phone;
    },
    // 可以添加其他 getter
  },
});

export default store;