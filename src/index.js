import Vue from 'vue'
import VueDisqus from 'vue-disqus'

import App from './App.vue'

// TODO configurable?
Vue.use(VueDisqus, {
  shortname: 'mblogs-1'
})

export default new Vue({
  el: '#root',
  render: (h) => h(App)
})
