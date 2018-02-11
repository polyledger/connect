import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

// import CreatePortfolio from '@/components/Portfolio/CreatePortfolio'
import ViewPortfolio from '@/components/Portfolio/ViewPortfolio'
import EditPortfolio from '@/components/Portfolio/EditPortfolio'
import SignIn from '@/components/Registration/SignIn'
import SignUp from '@/components/Registration/SignUp'
import Activate from '@/components/Registration/Activate'
import ConfirmEmail from '@/components/Registration/ConfirmEmail'
import Questionnaire from '@/components/Onboarding/Questionnaire'
import Verification from '@/components/Onboarding/Verification'
// import Funding from '@/components/Onboarding/Funding'

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
      name: 'Activate',
      component: Activate,
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
    }
    // {
    //   path: '/funding',
    //   name: 'Funding',
    //   component: Funding,
    //   beforeEnter: requireAuth
    // }
  ]
})
