import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import Vant from 'vant'
import http from './utils/http.js'
import SongList from './components/SongList.vue'
import 'vant/lib/index.css'
Vue.comment('song-list', SongList)
Vue.use(Vant)

// var audio = new Audio()
Vue.prototype.$http = http

new Vue({
    router,
    render: (h) => h(App)
}).$mount('#app')