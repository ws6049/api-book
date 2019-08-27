import Vue from 'vue'
import App from './App.vue'
import IviewUI from "iview"
import 'iview/dist/styles/iview.css';
Vue.use(IviewUI)

const VueHighlightJS = require('vue-highlightjs')
import 'highlight.js/styles/github.css';
// Tell Vue.js to use vue-highlightjs
Vue.use(VueHighlightJS)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
