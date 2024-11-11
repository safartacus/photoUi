import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/index.vue'
import Tag from '../views/profile/tag.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "profile" */ '../views/home'),
    meta: {requiresAuth: true}

  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "profile" */ '../views/home'),
    meta: {requiresAuth: true}
  },
  {
    path: '/direct',
    name: 'Direct',
    component: () => 
      import(/* webpackChunkName: "profile" */ '../views/direct'),
    children: [
      {
        path: ':id',
        name: 'DirectMessageList',
        component: () =>
          import(/* webpackChunkName: "profile" */ '../views/direct/list')
      }
    ],
    meta: {requiresAuth: true}
  },
  {
    path: '/explore',
    name: 'Explore',
    component: () => import(/* webpackChunkName: "profile" */ '../views/explore'),
    meta: {requiresAuth: true}
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () =>
      import(/* webpackChunkName: "profile" */ '../views/profile'),
    children: [
      {
        path: '',
        name: 'ProfilePost',
        component: () =>
          import(/* webpackChunkName: "profile" */ '../views/profile/post')
      },
      {
        path: 'igtv',
        name: 'ProfileIGTV',
        component: () =>
          import(/* webpackChunkName: "profile" */ '../views/profile/igtv')
      },
      {
        path: 'save',
        name: 'ProfileSave',
        component: () =>
          import(/* webpackChunkName: "profile" */ '../views/profile/save')
      },
      {
        path: 'tag/:id',
        name: 'ProfileTag',
        component: Tag,
        props: true
      }
    ],
    meta: {requiresAuth: true}
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next) => {
  const loggedIn = localStorage.getItem('user');
  if (to.matched.some((record) => record.meta.requiresAuth) && !loggedIn) {
    sessionStorage.setItem('redirectPath', to.path);
    next('/login');
  } else if (to.matched.some((record) => record.meta.requiresVisiter) && loggedIn) {
    next('/home');
  } else {
    next();
  }
})

export default router
