import Router from 'vue-router'
import axios from 'axios'

const router = new Router({ mode: 'history' })

const auth = {
  login (email, password) {
    return new Promise((resolve, reject) => {
      if (localStorage.token) {
        router.go('/dashboard/')
        resolve()
      }

      axios({
        url: '/api/account/authenticate/',
        method: 'POST',
        data: {
          username: email,
          password: password
        }
      }).then((response) => {
        localStorage.token = response.data.token
        router.go('/dashboard/')
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

  logout () {
    delete localStorage.token
    router.go('/signin')
  },

  loggedIn () {
    return !!localStorage.token
  },

  requireAuth (to, from, next) {
    if (!this.loggedIn()) {
      next({
        path: '/signin',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  }
}

export default auth
