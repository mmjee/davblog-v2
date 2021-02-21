import Vue from 'vue'
import VueRouter from 'vue-router'
import VueDisqus from 'vue-disqus'
import 'bulma/css/bulma.min.css'

import App from './App'
import Main from './Main'

// TODO configurable?
Vue.use(VueDisqus, {
  shortname: 'mblogs-1'
})
Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '*',
      component: Main
    }
  ]
})

export default new Vue({
  el: '#root',
  router,
  render: (h) => h(App)
})
