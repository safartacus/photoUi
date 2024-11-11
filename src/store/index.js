import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios'; // Axios doğru şekilde import edildi

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    token: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    clearUser(state) {
      state.user = null;
      localStorage.removeItem('user');
    },
    clearToken(state) {
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  actions: {
    async login({ commit }, { userName, passWord }) {
      try {
        const response = await axios.post('http://localhost:3000/login/authentication', {
          userName,
          passWord,
        }, {
          withCredentials: true,
        });
        commit('setToken', response.data.token);
        commit('setUser', response.data.user);
      } catch (error) {
        console.error('Login failed:', error);
        throw new Error('Login failed. Please check your credentials.');
      }
    },
    logout({ commit }) {
      commit('clearUser');
      commit('clearToken');
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!(state.token || localStorage.getItem('token'));
    },
    getUser(state) {
      return state.user || JSON.parse(localStorage.getItem('user'));
    },
  },
});
