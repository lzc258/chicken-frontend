<template>
  <div class="login-container">
    <el-card class="login-card" shadow="hover">
      <h2 class="title">登录</h2>
      <el-form :model="form" class="form">
        <el-form-item>
          <el-radio-group v-model="loginMode" class="mode-switch">
            <el-radio-button label="password">密码登录</el-radio-button>
            <el-radio-button label="code">验证码登录</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.identifier" placeholder="邮箱" />
        </el-form-item>
        <el-form-item v-if="loginMode === 'password'">
          <el-input v-model="form.password" type="password" placeholder="密码" />
        </el-form-item>
        <el-form-item v-else>
          <div class="code-row">
            <el-input v-model="form.code" placeholder="邮箱验证码" />
            <el-button
              :disabled="sendingCode || countdown > 0"
              @click="sendCode"
            >
              {{ countdown > 0 ? `${countdown}s后重发` : '发送验证码' }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loginHandler" style="width: 100%;">登录</el-button>
        </el-form-item>
        <div class="links">
          <router-link to="/register">还没有账号？去注册</router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, onMounted, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { login } = useAuth()

const form = reactive({
  identifier: '',
  password: '',
  code: ''
})

const loginMode = ref('password')
const sendingCode = ref(false)
const countdown = ref(0)
let countdownTimer = null

const isValidIdentifier = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

const startCountdown = () => {
  countdown.value = 60
  countdownTimer = window.setInterval(() => {
    if (countdown.value <= 1) {
      countdown.value = 0
      window.clearInterval(countdownTimer)
      countdownTimer = null
      return
    }
    countdown.value -= 1
  }, 1000)
}

onMounted(() => {
  if (route.query.registered === '1') {
    ElMessage.success('注册成功，请登录')
    router.replace({ path: '/login', query: {} })
  }
})

const sendCode = async () => {
  if (!form.identifier) {
    ElMessage.error('请输入邮箱')
    return
  }
  if (!isValidIdentifier(form.identifier)) {
    ElMessage.error('请输入有效的邮箱')
    return
  }

  sendingCode.value = true
  try {
    const res = await fetch('/chicken-api/login/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: form.identifier })
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(data.error || data.message || '发送验证码失败')
    }

    ElMessage.success(data.message || '验证码已发送')
    startCountdown()
  } catch (err) {
    ElMessage.error(err.message || '发送验证码失败')
  } finally {
    sendingCode.value = false
  }
}

const loginHandler = async () => {
  if (!form.identifier) {
    ElMessage.error('邮箱不能为空')
    return
  }
  if (!isValidIdentifier(form.identifier)) {
    ElMessage.error('请输入有效的邮箱')
    return
  }
  if (loginMode.value === 'password' && !form.password) {
    ElMessage.error('请输入密码')
    return
  }
  if (loginMode.value === 'code' && !form.code) {
    ElMessage.error('请输入验证码')
    return
  }

  try {
    const res = await fetch('/chicken-api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: form.identifier,
        password: loginMode.value === 'password' ? form.password : '',
        code: loginMode.value === 'code' ? form.code : ''
      })
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      ElMessage.error('登录失败: ' + (data.error || data.message || res.statusText))
      return
    }

    if (data.token) {
      login(data.token)
      ElMessage.success('登录成功')
      router.push('/center')
    } else {
      ElMessage.error('登录失败：未收到 token')
    }
  } catch (err) {
    ElMessage.error('登录失败: ' + err)
  }
}

onBeforeUnmount(() => {
  if (countdownTimer) {
    window.clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #f5f5f5;
}
.login-card {
  width: 360px;
  padding: 20px;
  text-align: center;
}
.title {
  margin-bottom: 20px;
}
.form {
  text-align: left;
}
.mode-switch {
  width: 100%;
  display: flex;
}
.mode-switch :deep(.el-radio-button),
.mode-switch :deep(.el-radio-button__inner) {
  width: 100%;
}
.code-row {
  display: flex;
  gap: 10px;
  width: 100%;
}
.code-row .el-input {
  flex: 1;
}
.links {
  margin-top: 10px;
  text-align: right;
}
</style>
