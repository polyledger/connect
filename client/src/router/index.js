import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

import ViewPortfolio from '@/components/ViewPortfolio'
import SignIn from '@/components/SignIn'
import SignUp from '@/components/SignUp'
import ConfirmEmail from '@/components/ConfirmEmail'
import Activation from '@/components/Activation'
import EditPortfolio from '@/components/EditPortfolio'
import Questionnaire from '@/components/Questionnaire'
import Verification from '@/components/Verification'
import Funding from '@/components/Funding'

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
      path: '/activate',
      name: 'Activation',
      component: Activation,
      beforeEnter: requireAnonymous
    },
    {
      path: '/portfolio',
      name: 'ViewPortfolio',
      component: ViewPortfolio,
      beforeEnter: requireAuth
    },
    {
      path: '/portfolios/:id',
      name: 'EditPortfolio',
      component: EditPortfolio,
      beforeEnter: requireAuth
    },
    {
      path: '/questionnaire',
      name: 'Questionnaire',
      component: Questionnaire,
      beforeEnter: requireAuth
    },
    {
      path: '/verification',
      name: 'Verification',
      component: Verification,
      beforeEnter: requireAuth
    },
    {
      path: '/funding',
      name: 'Funding',
      component: Funding,
      beforeEnter: requireAuth
    }
  ]
})
