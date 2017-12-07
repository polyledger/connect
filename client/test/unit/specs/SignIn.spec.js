import Vue from 'vue'
import SignIn from '@/components/SignIn'
import router from '@/router'

describe('SignIn.vue', () => {
  it('should do something', () => {
    const Constructor = Vue.extend(SignIn)
    const vm = new Constructor({router}).$mount()
    expect(vm.$el.textContent).to.contain('Sign in')
  })
})
