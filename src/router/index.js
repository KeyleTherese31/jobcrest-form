import Vue from 'vue'
import Router from 'vue-router'

// Views
import WelcomeView from '../views/WelcomeView.vue'
import LoginView from '../views/LoginView.vue'
import JobseekerCVForm from '../views/JobseekerCVForm.vue'
import TestNavigationView from '../views/TestNavigationView.vue'
import TestPage from '@/views/TestPage.vue'
import AdminView from '../views/AdminView.vue'
import CreateEditQuestionView from '../views/CreateEditQuestionView.vue'
import AdminPanel from '../views/AdminPanel.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    // Welcome and Login Routes
    { path: '/', name: 'welcome', component: WelcomeView },
    { path: '/login', name: 'login', component: LoginView },

    // Jobseeker Routes
    { path: '/jobseeker/cv', name: 'jobseeker-cv', component: JobseekerCVForm },
    { path: '/test-selection', name: 'test-selection', component: TestNavigationView },
    { path: '/test/:testType', name: 'take-test', component: TestPage, props: true },

    // Admin Routes
    { path: '/admin', name: 'admin', component: AdminView },
    { path: '/admin/manage-questions', name: 'manage-questions', component: AdminPanel },
    { path: '/admin/create-question', name: 'create-question', component: CreateEditQuestionView },
    { path: '/admin/edit-questions', name: 'edit-questions', component: AdminPanel },
    {
      path: '/admin/edit-question/:testType/:index',
      name: 'edit-question',
      component: CreateEditQuestionView,
      props: true
    }
  ]
})

