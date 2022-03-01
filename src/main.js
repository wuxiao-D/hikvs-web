import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import hikComp from 'hikvs-web'
Vue.use(hikComp)

new Vue({
  render: h => h(App),
}).$mount('#app')
