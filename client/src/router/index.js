import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

import Dashboard from '@/components/Dashboard'
import SignIn from '@/components/SignIn'
import SignUp from '@/components/SignUp'
import ConfirmEmail from '@/components/ConfirmEmail'
import Activation from '@/components/Activation'
import GettingStarted from '@/components/GettingStarted'

Vue.use(Router)

let requireAuth = (to, from, next) => {
  if (!localStorage.token) {
    next({
      path: '/signin',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

let requireSignedUp = (to, from, next) => {
  if (!store.getters.isSignedUp) {
    next({
      path: '/signup',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

let requireAnonymous = (to, from, next) => {
  if (store.getters.isLoggedIn) {
    next({path: '/dashboard'})
  } else {
    next()
  }
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/confirm-email',
      name: 'ConfirmEmail',
      component: ConfirmEmail,
      beforeEnter: requireSignedUp
    },
    {
      path: '/activation',
      name: 'Activation',
      component: Activation,
      beforeEnter: requireAnonymous
    },
    {
      path: '/getting-started',
      name: 'GettingStarted',
      component: GettingStarted,
      beforeEnter: requireAuth
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      beforeEnter: requireAuth
    }
  ]
})
