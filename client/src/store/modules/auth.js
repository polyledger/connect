import axios from 'axios'
import router from '@/router'

const ACTIVATE = 'ACTIVATE'
const SIGNUP = 'SIGNUP'
const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS'
const LOGIN = 'LOGIN'
const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const LOGOUT = 'LOGOUT'

let state = {
  pending: false,
  isSignedUp: false,
  isLoggedIn: localStorage.token
}

let mutations = {
  [ACTIVATE] (state) {
    state.isLoggedIn = true
  },
  [SIGNUP] (state) {
    state.pending = true
  },
  [SIGNUP_SUCCESS] (state) {
    state.pending = false
    state.isSignedUp = true
  },
  [LOGIN] (state) {
    state.pending = true
  },
  [LOGIN_SUCCESS] (state) {
    state.isLoggedIn = true
    state.pending = false
  },
  [LOGOUT] (state) {
    state.isLoggedIn = false
  }
}

let actions = {
  activate ({state, commit, rootState}, token) {
    return new Promise((resolve, reject) => {
      if (token) {
        localStorage.token = token
        commit(ACTIVATE)
        router.push('/portfolio')
        resolve()
      } else {
        reject(Error('There was an issue activating your account.'))
      }
    })
  },
  signup ({state, commit, rootState}, credentials) {
    commit(SIGNUP)

    return new Promise((resolve, reject) => {
      axios({
        url: '/api/users/',
        method: 'POST',
        data: credentials
      }).then((response) => {
        commit(SIGNUP_SUCCESS)
        router.push('/confirm-email')
        resolve()
      }).catch((error) => {
        let response = error.response

        if (response.status === 400) {
          reject(response.data)
        } else if (response.status === 500) {
          reject(Error('Unable to signup. Please try again later.'))
        }
      })
    })
  },
  login ({state, commit, rootState}, credentials) {
    commit(LOGIN)

    return new Promise((resolve, reject) => {
      if (localStorage.token) {
        commit(LOGIN_SUCCESS)
        router.push('/portfolio')
        resolve()
      }

      axios({
        url: '/api/authenticate/',
        method: 'POST',
        data: {
          username: credentials.email,
          password: credentials.password,
          remember: credentials.remember
        }
      }).then((response) => {
        localStorage.token = response.data.token
        commit(LOGIN_SUCCESS)
        router.push('/portfolio')
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
}

let getters = {
  isLoggedIn (state) {
    return state.isLoggedIn
  },
  isSignedUp (state) {
    return state.isSignedUp
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
