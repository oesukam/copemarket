import * as types from './mutation-types';

const registrationState = {
  // avatar: '',
  firstName: '',
  middleName: '',
  lastName: '',
  gender: 'male',
  city: '',
  email: '',
  from: '',
  to: '',
  university: '',
  password: '',
  confirmPassword: '',
};


const itemState = {
  posters: [],
  type: '',
  name: '',
  titleEN: '',
  descriptionEN: '',
  descriptionFR: '',
  contactNames: '',
  contactEmail: '',
  contactPhone: '',
};


const INITIAL_STATE = {
  registration: registrationState,
  item: itemState
};

const getters = {
  getFormRegistration: state => state.registration || registrationState,
  getFormItem: state => state.item || itemState,
};

const mutations = {
  [types.CLEAR_FORM_ALL](state) {
    return { ...INITIAL_STATE };
  },
  [types.CLEAR_FORM_REGISTRATION](state) {
    state.registration = { ...registrationState }
    return {
      ...state
    };
  },
  [types.CLEAR_FORM_PRODUCT](state) {
    state.item = { ...itemState }
    return {
      ...state
    };
  },
  [types.SET_FORM_REGISTRATION](state, { field = '', value = '' }) {
    if (field) {
      state.registration[field] = value
      return {
        ...state
      };
    }
  },
  [types.SET_FORM_PRODUCT](state, { field = '', value = '' }) {
    if (field) {
      state.publication[field] = value
      return {
        ...state
      };
    }
  },
  [types.SET_FORM_PRODUCT_ALL](state, publication = '' ) {
    if (publication) {
      state.publication = publication
      return {
        ...state
      };
    }
  }
};

const actions = {

};


export default {
  state: INITIAL_STATE,
  getters,
  actions,
  mutations,
};
