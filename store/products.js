import * as types from './mutation-types';
import { request } from 'graphql-request'

const INITIAL_STATE = {
  product: '',
  products: { data: [] },
  productsLatest: { data: [] },
};

const getters = {
  getProduct: state => state.product || '',
  getProducts: state => state.products || [],
  getProductsLatest: state => state.productsLatest || [],
};

const mutations = {
  [types.CLEAR_PRODUCTS](state) {
    return { ...INITIAL_STATE };
  },
  [types.SET_PRODUCT](state, product = '') {
    state.product =  product
    return {
      ...state
    };
  },
  [types.SET_PRODUCTS](state, products = []) {
    state.products =  products
    return {
      ...state,
      products
    };
  },
  [types.SET_PRODUCTS_LATEST](state, productsLatest = []) {
    state.productsLatest =  productsLatest
    return {
      ...state
    };
  }
};

const actions = {
  fetchtProduct ({ commit }, { id = ''}) {
    return new Promise((resolve, reject) => {
      if (id) {
        const query = `{
          product {
            _id
            _user
            _city
            _province
            _category
            _type
            poster
            title
            description
            city
            currency
            price
            province
            user
            category
            type
          }
        }`
        request('graphql', query)
        .then((res) => {
          const data = res.data || ''
          if (data.success) {
            resolve(true);
          } else {
            reject(false)
          }
        })
        .catch(({ response = '' } = {}) => {
          if (response.status === 401) {

          }
          reject(false);
        })
      } else {
        reject(false);
      }
    })
  },
  submitProduct ({ commit }, { id = ''}) {
    return new Promise((resolve, reject) => {
      if (id) {
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
        .then((res) => {
          const data = res.data || ''
          if (data.success) {
            resolve(true);
          } else {
            reject(false)
          }
        })
        .catch(({ response = '' } = {}) => {
          if (response.status === 401) {

          }
          reject(false);
        })
      } else {
        reject(false);
      }
    })
  },
  fetchProducts: ({ commit }) => {
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
        .then((res) => {
          const data = res.data || ''
          if (data.success) {
            if (data.data) {
              commit(types.SET_PRODUCTS, data.data);
            }
            resolve(true);
          } else {
            reject(false);
          }
        })
        .catch(({ response = '' } = {}) => {
          if (response.status === 401) {

          }
          reject(false);
        })
    })
  },
  fetchProductsLatest: ({ commit }) => {
    return new Promise((resolve, reject) => {
      const query = `{
        products {
          page pages total
          data {
            _id poster title description price currency
            city { _id name }
          }
        }
      }`
      request('graphql', query)
      .then(({ products }) => {
        commit(types.SET_PRODUCTS_LATEST, products);
        resolve(true);
      })
      .catch((error) => {
        console.log('errr', error)
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
