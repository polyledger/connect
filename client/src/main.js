// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueStripeCheckout from 'vue-stripe-checkout'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'

import './assets/js/chart.min.js'
import './assets/js/toolkit.min.js'
import './assets/css/toolkit-inverse.min.css'

const options = {
  key: 'pk_test_YS3D7wVOqAUbt4cFCaCbGGYr',
  image: require('./assets/img/logo-square.png'),
  locale: 'auto',
  currency: 'USD',
  billingAddress: true,
  panelLabel: 'View Portfolio {{amount}}'
}

Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(VueStripeCheckout, options)

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
