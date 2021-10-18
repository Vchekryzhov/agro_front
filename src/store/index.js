import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        field: [],
        guidanceLine: [],
    },
    mutations: {
        setField(state, field) {
            state.field = field;
        },
        setGuidanceLine(state, guidanceLine) {
            state.guidanceLine = guidanceLine;
        }
    },
    actions: {},
    modules: {}
});
