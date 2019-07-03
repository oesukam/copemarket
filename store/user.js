import * as types from './mutation-types';
import { map } from 'lodash';
import { some } from 'lodash'

const INITIAL_STATE = {
  login: false,
  user: {
    firstName: '',
    middleName: '',
    lastName: '',
    avatar: ''
  },
  products: [],
  token: '',
  myMessages: [],
  appLanguage: 'fr',
};

const getters = {
  getUser: state => state.user || {},
  isAuth: state => state.login,
  isAdmin: state => {
    return some(state.user.roles, val => val.name === 'admin')
  },
  getAppLang: (state) => {
    if (state.appLanguage === 'en' || state.appLanguage === 'fr') {
      return state.appLanguage;
    }
    return 'fr';
  },
  getMyPublications: state => state.publications || [],
};

const mutations = {
  [types.CHANGE_LANGUAGE](state, lang = 'fr') {
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang
    i18n.locale = lang;
    state.appLanguage = lang
  },
  [types.SET_LOGIN](state, login = false) {
    state.login = login
  },
  [types.SET_TOKEN](state, token = '') {
    localStorage.setItem('token', token);
    state.token = token
  },
  [types.SET_USER](state, user = '') {
    state.user = user || {}
    state.login = user != ''
  },
  [types.SET_USER_FIELD](state, { field = '', value = '' }) {
    if (field) {
      state.user[field] = value
      return {
        ...state
      };
    }
  },
  [types.SET_LOGOUT](state) {
    localStorage.removeItem('token');
    state.login = false;
    state.user = {};
  },
  [types.SET_APP_LANGUAGE](state, lang = 'fr') {
    if (lang === 'zh_CN' || lang === 'cn') {
      lang = 'zh_CN';
    } else if (lang === 'en' || lang === 'en-GB') {
      lang = 'en';
    } else {
      lang = 'fr';
    }
    state.appLanguage = lang
  },
  [types.SET_USER_PRODUCTS](state, products = []) {
    state.products = products;
  },
  [types.ADD_USER_PRODUCT](state, product = '') {
    if (product) {
      state.products = [...state.products, product];
    }
  },
};

const actions = {
  changeLang: ({ commit }, lang = 'fr') => {
    commit(types.CHANGE_LANGUAGE, lang);
  },
  logout: ({ commit }) => {
    return new Promise((resolve, reject) => {
      axios.post('/api/users/logout')
        .then((res) => {
          commit(types.SET_LOGOUT);
          resolve(true);
        })
        .catch(({ response }) => {
          if (response.status === 401) {
            commit(types.SET_LOGOUT);
            resolve(true);
          } else {
            reject(false);
          }
        })
    })
  },
  getUserProfile: ({ state, commit }, user = '') => {
    return new Promise((resolve, reject) => {
      let user = state.user
      if (state.token) {
        axios.get(`/api/users/${user.id}/profile`)
        .then((res) => {
          const data = res.data || ''
          if (data.user) {
            commit(types.SET_USER, data.user);
          }
          if (data.applications) {
            commit(types.SET_USER_PRODUCTS, data.applications);
          }
          resolve(true);
        })
        .catch(({ response = '' } = {}) => {
          if (response.status === 401) {
            commit(types.SET_LOGOUT);
          }
          reject(false);
        })
      } else {
        reject(false);
      }
    })
  },
};


export default {
  state: INITIAL_STATE,
  getters,
  actions,
  mutations,
};
