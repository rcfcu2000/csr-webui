import { createApp } from 'vue'
import App from './App.vue'
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
// 引入封装的router
import router from './router/index'
// 引用vuex
import store from './store'
// 引用粒子动效
import VueParticles from 'vue-particles'

const app = createApp(App);
// 完整引入  
app.use(ArcoVue)
    .use(ArcoVueIcon)
    .use(router)
    .use(VueParticles)
    .use(store)
    .mount('#app')
export default app
