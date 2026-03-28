// src/composables/useAuth.js
import { ref, computed } from 'vue'

const isLoggedIn = ref(false)
const token = ref('')

// 静态认证检查函数（不依赖响应式状态）
export const checkAuthStatus = () => {
  const storedToken = localStorage.getItem('token')
  const storedLoginStatus = localStorage.getItem('isLoggedIn')
  return storedLoginStatus === 'true' && storedToken
}

// 初始化认证状态
const initAuth = () => {
  const storedToken = localStorage.getItem('token')
  const storedLoginStatus = localStorage.getItem('isLoggedIn')

  if (storedToken && storedLoginStatus === 'true') {
    token.value = storedToken
    isLoggedIn.value = true
  }
}

// 登录
const login = (userToken) => {
  token.value = userToken
  isLoggedIn.value = true
  localStorage.setItem('token', userToken)
  localStorage.setItem('isLoggedIn', 'true')
}

// 登出
const logout = () => {
  token.value = ''
  isLoggedIn.value = false
  localStorage.removeItem('token')
  localStorage.removeItem('isLoggedIn')
}

export function useAuth() {
  // 确保只初始化一次
  if (!isLoggedIn.value && !token.value) {
    initAuth()
  }

  return {
    isLoggedIn: computed(() => isLoggedIn.value),
    token: computed(() => token.value),
    login,
    logout,
    checkAuth: checkAuthStatus // 导出静态检查函数
  }
}