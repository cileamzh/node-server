import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import DeviceList from '../views/DeviceList.vue'
import DeviceDetails from '../views/DeviceDetails.vue'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', component: Home },
    { path: '/register', component: Register },
    { path: '/login', component: Login },
    { path: '/devices', component: DeviceList },
    { path: '/device/:id', component: DeviceDetails }
  ]
})
