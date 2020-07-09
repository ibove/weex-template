/* global Vue */
import Router from 'vue-router'
import Home from '@/components/Home'
import Table from '@/views/table';

Vue.use(Router)

export const router = new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: Home
    }, {
      path: '/table',
      name: 'table',
      component: Table
    }
  ]
})
