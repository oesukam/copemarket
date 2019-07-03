import * as types from './mutation-types';
import { request } from 'graphql-request'

const INITIAL_STATE = {
  members: [],
  cities: [],
  provinces: [],
  categories: []
};

const getters = {
  getCities: state => state.cities || [],
  getProvinces: state => state.provinces || [],
  getCategories: state => state.categories || [],
};

const mutations = {
  [types.CLEAR_MOCKS_ALL](state) {
    return { ...INITIAL_STATE };
  },
  [types.SET_PROVINCES](state, provinces = [] ) {
    state.provinces = provinces
    return {
      ...state,
    };
  },
  [types.SET_CITIES](state, cities = [] ) {
    state.cities = cities
    return {
      ...state,
    };
  },
  [types.SET_CATEGORIES](state, categories = [] ) {
    state.categories = categories
    return {
      ...state,
    };
  }
};

const actions = {
  fetchMocks: ({ commit }) => {
    return new Promise((resolve, reject) => {
      const query = `{
        cities {
          data {
            _id name _province province { _id name }
          }
        }
        categoriesList {
          _id name icon poster subs {
            _id _parent name icon poster
          }
        }
      }`
      request('graphql', query)
      .then(({ cities, categoriesList }) => {
        commit(types.SET_CITIES, cities.data || []);
        commit(types.SET_CATEGORIES, categoriesList || []);
        resolve(cities.data);
      })
      .catch(({ response = '' } = {}) => {
        if (response.status === 401) {
          // commit(types.SET_LOGOUT);
        }
        reject(false);
      })
    })
  },
};


export default {
  state: INITIAL_STATE,
  getters,
  actions,
  mutations,
};
