import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '@/router'
// import * as actions from './actions'
// import * as getters from './getters'
// import createLogger from './logger'

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'
// export default new Vuex.Store({
//   actions,
//   getters,
//   strict: debug,
//   plugins: debug ? [createLogger()] : []
// })

const LOGIN = 'LOGIN'
const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const LOGOUT = 'LOGOUT'

const store = new Vuex.Store({
  state: {
    isLoggedIn: localStorage.token
  },
  mutations: {
    [LOGIN] (state) {
      state.pending = true
    },
    [LOGIN_SUCCESS] (state) {
      state.isLoggedIn = true
      state.pending = false
      router.push('/dashboard')
    },
    [LOGOUT] (state) {
      state.isLoggedIn = false
    }
  },
  actions: {
    login ({state, commit, rootState}, credentials) {
      commit(LOGIN)

      return new Promise((resolve, reject) => {
        if (localStorage.token) {
          router.push('/dashboard')
          commit(LOGIN_SUCCESS)
          resolve()
        }

        axios({
          url: '/api/account/authenticate/',
          method: 'POST',
          data: {
            username: credentials.email,
            password: credentials.password
          }
        }).then((response) => {
          localStorage.token = response.data.token
          commit(LOGIN_SUCCESS)
          router.push('/dashboard')
          resolve()
        }).catch((error) => {
          let response = error.response

          if (response.status === 400) {
            reject(response.data)
          } else if (response.status === 500) {
            reject(Error('Unable to login. Please try again later.'))
          }
        })
      })
    },
    logout ({commit}) {
      delete localStorage.token
      commit(LOGOUT)
      router.push('/signin')
    }
  },
  getters: {
    isLoggedIn (state) {
      return state.isLoggedIn
    }
  }
})

export default store
