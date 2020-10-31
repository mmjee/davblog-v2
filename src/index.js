import Vue from 'vue'
import VueDisqus from 'vue-disqus'
import 'bulma/css/bulma.min.css'

import App from './App.vue'

// TODO configurable?
Vue.use(VueDisqus, {
  shortname: 'mblogs-1'
})

export default new Vue({
  el: '#root',
  render: (h) => h(App)
})
