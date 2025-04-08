import Vue from 'vue'
import Router from 'vue-router'

// Views
import WelcomeView from '../views/WelcomeView.vue'
import LoginView from '../views/LoginView.vue'
import TestNavigationView from '../views/TestNavigationView.vue'
import AdminView from '../views/AdminView.vue'
import TestView from '../views/TestView.vue'
import ArchiveView from '../views/ArchiveView.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'welcome', component: WelcomeView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/test-selection', name: 'test-selection', component: TestNavigationView },
    { path: '/admin', name: 'admin', component: AdminView },
    { path: '/test', name: 'test', component: TestView },
    { path: '/archive', name: 'archive', component: ArchiveView }
  ]
})
