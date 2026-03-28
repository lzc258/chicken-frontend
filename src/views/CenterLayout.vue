<template>
  <div class="center-layout">
    <aside class="sidebar">
      <div class="user-summary">
        <div class="avatar">👤</div>
        <h2 class="sidebar-username" :title="profile.username">{{ profile.username }}</h2>
        <p>{{ profile.email }}</p>
      </div>
      <nav class="menu">
        <router-link to="apps" class="menu-link" active-class="active">我的应用</router-link>
        <router-link to="profile" class="menu-link" active-class="active">个人中心</router-link>
      </nav>
    </aside>

    <section class="content">
      <router-view />
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProfile } from '@/composables/useProfile'
const { profile, loadProfile } = useProfile()
onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.center-layout {
  min-height: 100vh;
  display: flex;
  background: #101a2e;
  color: #eef2ff;
}

/* =========================
   SIDEBAR
========================= */
.sidebar {
  width: 260px;
  background: #142748;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  box-sizing: border-box;

  /* ⭐关键：防止内容撑破布局 */
  overflow: hidden;
}

/* =========================
   USER INFO
========================= */
.user-summary {
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 16px;

  /* 分割线更清晰 */
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  /* 防止内部撑开 */
  overflow: hidden;
}

.avatar {
  font-size: 3rem;
  margin-bottom: 10px;
}

.user-summary h2 {
  margin: 0;
  font-size: 1.6rem;
}

/* ⭐用户名防溢出 */
.sidebar-username {
  max-width: 100%;
  display: block;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ⭐邮箱防溢出 */
.user-summary p {
  margin: 6px 0 0;
  color: #9ab5ff;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* =========================
   MENU
========================= */
.menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-link {
  display: block;
  padding: 10px 12px;
  color: #f4f9ff;
  border-radius: 8px;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.05);

  /* ⭐防止文字撑开 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  /* 动效 */
  transition: all 0.2s ease;
}

.menu-link:hover {
  background: #3f67c4;
  transform: translateX(2px);
}

.menu-link.active {
  background: #3f67c4;
  box-shadow: 0 0 10px rgba(63, 103, 196, 0.4);
}

/* =========================
   CONTENT AREA
========================= */
.content {
  flex: 1 1 0;
  padding: 24px;
  overflow-y: auto;
  min-height: 0;
}

/* 手机端适配 */
@media (max-width: 600px) {
  .center-layout {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding: 10px;
  }
  .content {
    padding: 10px;
  }
  .profile-form {
    max-width: 100%;
  }
  .user-summary h2,
  .user-summary p {
    font-size: 1.1rem;
    word-break: break-all;
  }
  .menu-link {
    padding: 8px 6px;
    font-size: 1rem;
  }
}

</style>