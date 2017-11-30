import axios from 'axios'
import router from '@/router'

const LOGIN = 'LOGIN'
const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const LOGOUT = 'LOGOUT'

let state = {
  isLoggedIn: localStorage.token
}

let mutations = {
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
}

let actions = {
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
          password: credentials.password,
          remember: credentials.remember
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
}

let getters = {
  isLoggedIn (state) {
    return state.isLoggedIn
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
