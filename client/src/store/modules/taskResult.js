import axios from 'axios'

const ADD_TASK_RESULT = 'ADD_TASK_RESULT'
const UPDATE_TASK_RESULT = 'UPDATE_TASK_RESULT'
const DELETE_TASK_RESULT = 'DELETE_TASK_RESULT'

let state = {
  id: null,
  status: null,
  percent: null,
  message: null
}

let mutations = {
  [ADD_TASK_RESULT] (state, taskResult) {
    state.id = taskResult.id
    state.status = taskResult.status
  },
  [UPDATE_TASK_RESULT] (state, taskResult) {
    let meta = JSON.parse(taskResult.meta)

    state.status = taskResult.status
    state.percent = Math.round((meta['current'] / meta['total']) * 100)
    state.message = meta.message
  },
  [DELETE_TASK_RESULT] (state) {
    state.id = null
    state.status = null
    state.percent = null
    state.message = null
  }
}

let actions = {
  addTaskResult ({state, commit, rootState}, taskResult) {
    commit(ADD_TASK_RESULT, taskResult)
  },
  pollTaskResult ({state, commit, rootState}) {
    return new Promise((resolve, reject) => {
      axios({
        url: `/api/task_results/${state.id}/`,
        method: 'GET',
        headers: {
          'Authorization': `Token ${localStorage.token}`
        }
      }).then((response) => {
        let taskResult = response.data

        if (taskResult.status === 'SUCCESS') {
          commit(DELETE_TASK_RESULT)
        } else {
          commit(UPDATE_TASK_RESULT, taskResult)
        }

        resolve(taskResult)
      }).catch((error) => {
        let response = error.response

        if (response.status === 400) {
          reject(response.data)
        } else if (response.status === 500) {
          reject(Error('Unable to fetch task result status. Please try again later.'))
        }
      })
    })
  }
}

let getters = {
  getTaskResult (state) {
    return state
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
