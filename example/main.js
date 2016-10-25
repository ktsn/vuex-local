import Vue from 'vue'
import Vuex from 'vuex'
import * as VuexLocal from '../lib'

import App from './App'

Vue.use(Vuex)
Vue.use(VuexLocal)

const store = new Vuex.Store({})

new Vue({
  store,
  render: h => h(App, {
    props: { name: 'counterApp' }
  })
}).$mount('#app')
