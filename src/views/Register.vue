<template>
  <div class="register-container">
    <el-card class="register-card" shadow="hover">
      <h2 class="title">注册</h2>
      <el-form :model="form" class="form">
        <el-form-item>
          <el-input v-model="form.identifier" placeholder="输入邮箱" />
        </el-form-item>
        <el-form-item>
          <div class="code-row">
            <el-input v-model="form.code" placeholder="验证码" />
            <el-button
              class="code-button"
              :disabled="sendingCode || countdown > 0"
              @click="sendCode"
            >
              {{ countdown > 0 ? `${countdown}s后重发` : '发送验证码' }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" type="password" show-password placeholder="设置密码" />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form.confirmPassword"
            type="password"
            show-password
            placeholder="确认密码"
            @keyup.enter="register"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="register" style="width: 100%;">注册</el-button>
        </el-form-item>
        <div class="links">
          <router-link to="/login">我有账号？返回登录</router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const form = reactive({
  identifier: '',
  code: '',
  password: '',
  confirmPassword: ''
})

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
    const res = await fetch('/chicken-api/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: form.identifier })
    })

    const text = await res.text()
    let data = null
    try {
      data = JSON.parse(text)
    } catch (e) {
      data = { error: text || '非 JSON 响应' }
    }

    if (!res.ok) {
      ElMessage.error('发送验证码失败: ' + (data.error || data.message || res.statusText))
      return
    }

    ElMessage.success(data.message || '验证码已发送，请注意查收')
    startCountdown()
  } catch (err) {
    ElMessage.error('发送验证码失败: ' + err)
  } finally {
    sendingCode.value = false
  }
}

const register = async () => {
  if (!form.identifier || !form.code || !form.password || !form.confirmPassword) {
    ElMessage.error('请完整填写注册信息')
    return
  }
  if (!isValidIdentifier(form.identifier)) {
    ElMessage.error('请输入有效的邮箱')
    return
  }
  if (form.password !== form.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }

  try {
    const res = await fetch('/chicken-api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: form.identifier,
        code: form.code,
        password: form.password
      })
    })

    const text = await res.text()
    let data = null
    try {
      data = JSON.parse(text)
    } catch (e) {
      // 不是 JSON 时保留原始文本
      data = { error: text || '非 JSON 响应' }
    }

    if (!res.ok) {
      ElMessage.error('注册失败: ' + (data.error || data.message || res.statusText))
      return
    }

    //ElMessage.success('注册成功，请登录')
    router.replace({ path: '/login', query: { registered: '1' } })
  } catch (err) {
    ElMessage.error('注册失败: ' + err)
  }
}

onBeforeUnmount(() => {
  if (countdownTimer) {
    window.clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;
  padding: 32px 20px;
  box-sizing: border-box;
  background:
    radial-gradient(circle at top, rgba(93, 132, 214, 0.28), transparent 38%),
    linear-gradient(180deg, #12213c 0%, #0a1425 100%);
}

.register-card {
  width: 360px;
  max-width: 100%;
  padding: 24px;
  text-align: center;
  border-radius: 18px;
  background: rgba(12, 22, 42, 0.88);
  border: 1px solid rgba(154, 181, 255, 0.22);
  box-shadow: 0 24px 60px rgba(3, 8, 20, 0.42);
}

.register-card :deep(.el-card__body) {
  padding: 0;
  background: transparent;
}

.title {
  margin-bottom: 20px;
  color: #eef4ff;
}

.form {
  text-align: left;
}

.form :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.06);
  box-shadow: inset 0 0 0 1px rgba(154, 181, 255, 0.18);
}

.form :deep(.el-input__inner) {
  color: #eef4ff;
}

.form :deep(.el-input__inner::placeholder) {
  color: #8ea8d8;
}

.code-row {
  display: flex;
  gap: 10px;
  width: 100%;
}

.code-button {
  flex-shrink: 0;
  border-color: rgba(154, 181, 255, 0.28);
  background: rgba(63, 103, 196, 0.2);
  color: #dbe7ff;
}

.links {
  margin-top: 10px;
  text-align: center;
  font-size: 13px;
}

.links a {
  color: #abc8ff;
  text-decoration: none;
}

.links a:hover {
  color: #eef4ff;
}
</style>
