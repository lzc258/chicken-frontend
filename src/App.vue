<template>
  <div id="app">
    <main>
      <router-view />
    </main>
    <footer v-if="showIcpRecord" class="site-footer">
      <div class="footer-records">
        <a
          href="https://beian.mps.gov.cn/#/query/webSearch"
          target="_blank"
          rel="noopener noreferrer"
          class="record-link record-link-ga"
        >
          <span class="inline-block w-16px flex-shrink-0 mr-1">
            <img
              src="/chicken-static/image/logo_ga.png"
              class="block w-full"
              style="width: 16px;"
            >
          </span>
          <span>{{ gaRecord }}</span>
        </a>
        <a
          v-if="showIcpRecord"
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
          class="record-link"
        >
          <span>{{ icpRecord }}</span>
        </a>
      </div>
      <div class="copyright-text">
        <p>{{ copyrightText }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuth } from './composables/useAuth'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { isLoggedIn, logout } = useAuth()
const gaRecord = '浙公网安备33112702000152号'
const icpRecord = '浙ICP备2026018189号-1'
const copyrightText = '© 2026 chicken666nb.tech网站．版权所有'
const routesWithIcpRecord = ['Login', 'Register', 'CenterApps', 'CenterProfile']

const showLogout = computed(() => {
  return isLoggedIn.value && route.meta.requiresAuth
})

const showIcpRecord = computed(() => {
  return routesWithIcpRecord.includes(route.name)
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
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  position: relative;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.site-footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 14px 20px 2px;
  background: linear-gradient(180deg, #12213c 0%, #0b1426 100%);
  border-top: 1px solid rgba(154, 181, 255, 0.18);
  box-shadow: 0 -10px 24px rgba(3, 8, 20, 0.22);
  box-sizing: border-box;
}

.footer-records {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
}

.footer-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.copyright-text {
  margin: 0;
  color: #d7e4ff;
  font-size: 13px;
  line-height: 1.5;
}

.record-link {
  color: #d7e4ff;
  font-size: 14px;
  text-decoration: none;
  line-height: 1.4;
}

.record-link:hover {
  color: #eef4ff;
  text-decoration: none;
}

.record-link:visited {
  color: #d7e4ff;
}

.record-link-ga {
  display: inline-flex;
  align-items: center;
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
