import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import questionnaire from './modules/questionnaire'
import createLogger from './logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    auth,
    questionnaire
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
