import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    field: [],
    params: {},
  },
  mutations: {
    setField(state, field) {
      state.field = field;
    },
    setParams(state, params){
      state.params = params;
    }
  },
  actions: {},
  modules: {},
});
