import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import 'common/stylus/index.styl'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import lazyImg from 'common/images/default.png'

Vue.use(VueLazyload, {
  loading: lazyImg,
  attempt: 1
})

Vue.config.productionTip = false

fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
