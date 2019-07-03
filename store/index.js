import Vuex from 'vuex';
// import VuexPersist from 'vuex-persistedstate';
import user from './user';
import products from './products';
import mocks from './mocks';
import forms from './forms';
import { SET_AUTH_MODEL } from './mutation-types'

// const vuexLocalStorage = new VuexPersist({
//   // storage: window.localStorage, // or window.sessionStorage or localForage instance.
//   // Function that passes the state and returns the state with only the objects you want to store.
//   reducer: state => ({
//     user: state.user,
//     forms: state.forms,
//     items: state.items,
//     mocks: state.mocks,
//   }),
// })

const createStore = () => {
  return new Vuex.Store({
    state: {
      authModel: false,
    },
    mutations: {
      [SET_AUTH_MODEL](state, model = false) {
        state.authModel = model
      }
    },
    actions: {},
    getters: {
      getAuthModel: (state) => state.authModel
    },
    modules: {
      user,
      forms,
      mocks,
      products
    },
    // plugins: [vuexLocalStorage],
    // strict: true,
  })
}

export default createStore
