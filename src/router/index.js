import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'

Vue.use(Router)

export default new Router({
  routes: [{
      name: "home",
      path: "/",
      component: Home,
      children: [{
        name: "users",
        path: '/users',
        component: Users
      }]

      // redirect:  {
      //   name: 'login'
      // }
    },
    {
      name: "login",
      path: '/login',
      component: Login
    }

    // 写在这里时，会出现在整个页面
    // {
    //   name: "users",
    //   path: '/users',
    //   component: Users
    // }
  ]
})
