// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import 'babel-polyfill';
import axios from 'axios';
Vue.prototype.$http=axios
// import '../node_modules/swiper/css/swiper.min.css';

import VCharts from 'v-charts'
Vue.use(VCharts);

// 引入rem.js
import './tool/rem.js'
// 引入全局样式表
import '@/assets/global.css'

import './public/element'    // 引入elementUi组件库
// import './style/theme/index.css'
Vue.config.productionTip = false

Vue.use(Viser)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
