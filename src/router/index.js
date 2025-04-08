import Vue from 'vue'
import Router from 'vue-router'

// Views
import WelcomeView from '../views/WelcomeView.vue'
import LoginView from '../views/LoginView.vue'
import TestNavigationView from '../views/TestNavigationView.vue'
import AdminView from '../views/AdminView.vue'
import ArchiveView from '../views/ArchiveView.vue'
import CreateEditQuestionView from '../views/CreateEditQuestionView.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'welcome', component: WelcomeView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/test-selection', name: 'test-selection', component: TestNavigationView },
    
    { path: '/admin', name: 'admin', component: AdminView },
    { path: '/admin/create-question', name: 'create-question', component: CreateEditQuestionView },
    { path: '/admin/edit-questions', name: 'edit-questions', component: AdminView }, // Admin can also delete/edit questions from here
    {
      path: '/admin/edit-question/:testType/:index',
      name: 'edit-question',
      component: CreateEditQuestionView
    }, // Route to edit a question
    { path: '/archive', name: 'archive', component: ArchiveView }
  ]
})

