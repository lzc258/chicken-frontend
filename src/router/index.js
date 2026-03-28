import { createRouter, createWebHistory } from 'vue-router'
import { checkAuthStatus } from '../composables/useAuth' // 导入静态认证检查函数

const router = createRouter({
  history: createWebHistory('/'), // 也可 base: '/chicken/' 视部署决定
  routes: [
    {
      path: '/',
      redirect: () => {
        return checkAuthStatus() ? '/center' : '/login'
      }
    },
    {
      path: '/login',
      component: () => import('../views/Login.vue'),
      name: 'Login'
    },
    {
      path: '/register',
      component: () => import('../views/Register.vue'),
      name: 'Register'
    },
    /*{
      path: '/birthday',
      component: () => import('../views/Birthday.vue'),
      name: 'Birthday'
    },*/
    {
      path: '/center',
      component: () => import('../views/CenterLayout.vue'),
      name: 'Center',
      meta: { requiresAuth: true },
      redirect: '/center/apps',
      children: [
        {
          path: 'profile',
          component: () => import('../views/CenterProfile.vue'),
          name: 'CenterProfile'
        },
        {
          path: 'apps',
          component: () => import('../views/CenterApps.vue'),
          name: 'CenterApps'
        }
      ]
    },
    {
      path: '/chicken/angry',
      component: () => import('../views/Angry.vue'),
      name: 'Angry',
      meta: { requiresAuth: true }
    },
    {
      path: '/chicken/dancing',
      component: () => import('../views/Dancing.vue'),
      name: 'Dancing',
      meta: { requiresAuth: true }
    },
  ]
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 如果访问需要认证的页面
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      // 未登录，跳转到登录页
      next('/login')
      return
    }
    try {
      const res = await fetch('/chicken-api/auth/check', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (res.ok) {
        // 已登录，继续访问
        next()
      } else {
        // token 无效，清除并跳转到登录页
        localStorage.removeItem('token')
        localStorage.removeItem('isLoggedIn')
        next('/login')
      }
    } catch (error) {
      // 请求失败，清除并跳转到登录页
      localStorage.removeItem('token')
      localStorage.removeItem('isLoggedIn')
      next('/login')
    }
  } else {
    // 不需要认证的页面，直接访问
    next()
  }
})

export default router