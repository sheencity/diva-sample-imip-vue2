import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';
import './styles/style.scss';

Vue.use(VueAxios, axios);
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
