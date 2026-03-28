<template>
  <div class="tab-card">
    <h3>我的应用</h3>
    <p>以下应用由你账号控制，可直接进入小鸡游戏模块：</p>

    <div class="apps-grid">
      <el-card class="app-card">
        <h4>跳舞小鸡</h4>
        <p>休闲娱乐模式，适合放松</p>
        <el-button type="primary" @click="goDancing">进入</el-button>
      </el-card>
      <el-card class="app-card">
        <h4>愤怒小鸡</h4>
        <p>挑战模式，暴力释放</p>
        <el-button type="danger" @click="goAngry">进入</el-button>
      </el-card>
    </div>

    <h4 style="margin-top: 20px;">后端应用列表</h4>
    <el-table :data="appList" style="width: 100%" v-if="appList.length">
      <el-table-column prop="name" label="应用名称" width="180" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="操作" width="130">
        <template #default="{ row }">
          <el-button type="text" @click="runApp(row)">运行</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="!appList.length" class="empty-state">暂无应用数据，正在从后端加载...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useProfile } from '@/composables/useProfile'

useProfile()

const router = useRouter()
const appList = ref([])

const goDancing = () => router.push('/chicken/dancing')
const goAngry = () => router.push('/chicken/angry')

const runApp = (row) => {
  if (row.path) {
    router.push(row.path)
  } else {
    ElMessage.info('应用未配置路由')
  }
}

const loadApps = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('/chicken-api/user/apps', {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    if (!res.ok) throw new Error('加载应用失败')
    const data = await res.json()
    appList.value = Array.isArray(data) ? data : []
    if (!appList.value.length) {
      appList.value = [
        { name: '跳舞小鸡', description: '休闲娱乐', path: '/chicken/dancing' },
        { name: '愤怒小鸡', description: '挑战模式', path: '/chicken/angry' },
      ]
    }
  } catch (error) {
    ElMessage.warning('应用列表加载失败，使用默认示例')
    appList.value = [
      { name: '跳舞小鸡', description: '休闲娱乐', path: '/chicken/dancing' },
      { name: '愤怒小鸡', description: '挑战模式', path: '/chicken/angry' },
    ]
  }
}

onMounted(loadApps)
</script>

<style scoped>
.tab-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 20px;
}

.tab-card h3 {
  margin-top: 0;
  color: #e5edff;
}

.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.app-card {
  padding: 16px;
  border-radius: 12px;
  background: rgba(74, 105, 170, 0.26);
  border: 1px solid rgba(120, 165, 220, 0.35);
  color: white;   /* ⭐ 加这一行 */
}

.empty-state {
  color: #abc8ff;
  text-align: center;
  margin-top: 10px;
}

/* 手机端适配 */
@media (max-width: 600px) {
  .tab-card {
    padding: 10px;
  }
  .apps-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .app-card {
    padding: 10px;
    font-size: 1rem;
  }
  .el-table {
    font-size: 0.95rem;
  }
  .el-button {
    width: 100%;
    margin-top: 6px;
  }
}
</style>