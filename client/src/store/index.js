import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import assessment from './modules/assessment'
import taskResult from './modules/taskResult'
import createLogger from './logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    auth,
    assessment,
    taskResult
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
