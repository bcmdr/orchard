import Vue from 'vue'
import Router from 'vue-router'
import PageHome from '@/pages/PageHome'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'PageHome',
      component: PageHome
    }
  ]
})
