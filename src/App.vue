<template>
  <div id="app">
    <main>
      <router-view />
    </main>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuth } from './composables/useAuth'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { isLoggedIn, logout } = useAuth()

const showLogout = computed(() => {
  return isLoggedIn.value && route.meta.requiresAuth
})

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
}

.navbar {
  height: 60px;
  background: #333;
  color: white;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
  z-index: 10;
}

.nav-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: #555;
}

.logout-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background: #c82333;
}

main {
  min-height: 100vh;
  overflow-y: auto;
  position: relative;
}

.global-logout-btn {
  position: fixed;
  left: 16px;
  bottom: 16px;
  border: none;
  background: #dc3545;
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 4px 10px rgba(0,0,0,0.25);
}

.global-logout-btn:hover {
  background: #c82333;
}
</style>
