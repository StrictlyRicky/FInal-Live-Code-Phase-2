import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '/About.vue')
    },
    {
      path: '/favorite',
      name: 'favorite',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "favorite" */ '/Favorite.vue')
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: ':name',
          component: () => import(/* webpackChunkName: "detail" */ '/Detail.vue')
        }
      ]
    }
  ]
})
