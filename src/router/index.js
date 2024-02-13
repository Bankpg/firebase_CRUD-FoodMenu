import { createRouter, createWebHistory } from 'vue-router'
import AddMenuView from '../views/AddMenuView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/',
      name: 'addmenu',
      component: AddMenuView
    },
  ]
})

export default router
