// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import Http from '@/plugins/http'
import moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/index.css'
import router from './router'

Vue.config.productionTip = false

Vue.use(Http)
// Vue.user(VueRouter)
Vue.use(ElementUI);

// 处理日期的全局过滤器
Vue.filter('formDate', (v) => {
  return moment(v).format('YYYY-MM-DD hh:mm:ss')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
