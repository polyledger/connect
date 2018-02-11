import axios from 'axios'
import router from '@/router'

const SUBMIT = 'SUBMIT'
const VERIFY = 'VERIFY'

let state = {
  portfolio: {},
  submitted: false,
  verified: false
}

let mutations = {
  [SUBMIT] (state, portfolio) {
    state.submitted = true
    state.portfolio = portfolio
  },
  [VERIFY] (state, portfolio) {
    state.verified = true
    state.portfolio = portfolio
  }
}

let actions = {
  submit ({state, commit, rootState}, portfolio) {
    return new Promise((resolve, reject) => {
      axios({
        url: `/api/portfolios/${portfolio.id}/`,
        method: 'PUT',
        data: portfolio,
        headers: {
          'Authorization': `Token ${localStorage.token}`
        }
      }).then((response) => {
        commit(SUBMIT, portfolio)
        router.push('/verification')
        resolve()
      }).catch((error) => {
        let response = error.response

        if (response.status === 400) {
          reject(response.data)
        } else if (response.status === 500) {
          reject(Error('Unable to submit questionnaire. Please try again later.'))
        }
      })
    })
  },
  verify ({state, commit, rootState}, portfolio) {
    return new Promise((resolve, reject) => {
      axios({
        url: `/api/portfolios/${portfolio.id}/`,
        method: 'PUT',
        data: portfolio,
        headers: {
          'Authorization': `Token ${localStorage.token}`
        }
      }).then((response) => {
        commit(VERIFY, portfolio)
        router.push('/portfolio')
        resolve()
      }).catch((error) => {
        let response = error.response

        if (response.status === 400) {
          reject(response.data)
        } else if (response.status === 500) {
          reject(Error('Unable to verify your score. Please try again later.'))
        }
      })
    })
  }
}

let getters = {
  isSubmitted (state) {
    return state.submitted
  },
  isVerified (state) {
    return state.verified
  },
  portfolio (state) {
    return state.portfolio
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
