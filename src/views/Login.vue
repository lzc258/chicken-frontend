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
          <el-button link type="primary" class="text-link" @click="openResetDialog">忘记密码？</el-button>
          <router-link to="/register">还没有账号？去注册</router-link>
        </div>
      </el-form>
    </el-card>

    <el-dialog
      v-model="resetDialogVisible"
      title="重置密码"
      width="420px"
      destroy-on-close
      class="reset-dialog"
    >
      <el-form :model="resetForm" class="form">
        <el-form-item>
          <el-input v-model="resetForm.identifier" placeholder="输入邮箱" />
        </el-form-item>
        <el-form-item>
          <div class="code-row">
            <el-input v-model="resetForm.code" placeholder="邮箱验证码" />
            <el-button
              :disabled="sendingResetCode || resetCountdown > 0"
              @click="sendResetCode"
            >
              {{ resetCountdown > 0 ? `${resetCountdown}s后重发` : '发送验证码' }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="resetForm.password"
            type="password"
            show-password
            placeholder="新密码"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="resetForm.confirmPassword"
            type="password"
            show-password
            placeholder="确认新密码"
            @keyup.enter="resetPassword"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resetDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="resetPassword">确认修改</el-button>
        </div>
      </template>
    </el-dialog>
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
const resetDialogVisible = ref(false)
const sendingResetCode = ref(false)
const resetCountdown = ref(0)
let resetCountdownTimer = null

const resetForm = reactive({
  identifier: '',
  code: '',
  password: '',
  confirmPassword: ''
})

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

const startResetCountdown = () => {
  resetCountdown.value = 60
  resetCountdownTimer = window.setInterval(() => {
    if (resetCountdown.value <= 1) {
      resetCountdown.value = 0
      window.clearInterval(resetCountdownTimer)
      resetCountdownTimer = null
      return
    }
    resetCountdown.value -= 1
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

const openResetDialog = () => {
  resetForm.identifier = form.identifier
  resetForm.code = ''
  resetForm.password = ''
  resetForm.confirmPassword = ''
  resetDialogVisible.value = true
}

const sendResetCode = async () => {
  if (!resetForm.identifier) {
    ElMessage.error('请输入邮箱')
    return
  }
  if (!isValidIdentifier(resetForm.identifier)) {
    ElMessage.error('请输入有效的邮箱')
    return
  }

  sendingResetCode.value = true
  try {
    const res = await fetch('/chicken-api/password/send-reset-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: resetForm.identifier })
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(data.error || data.message || '发送验证码失败')
    }

    ElMessage.success(data.message || '验证码已发送')
    startResetCountdown()
  } catch (err) {
    ElMessage.error(err.message || '发送验证码失败')
  } finally {
    sendingResetCode.value = false
  }
}

const resetPassword = async () => {
  if (!resetForm.identifier || !resetForm.code || !resetForm.password || !resetForm.confirmPassword) {
    ElMessage.error('请完整填写重置信息')
    return
  }
  if (!isValidIdentifier(resetForm.identifier)) {
    ElMessage.error('请输入有效的邮箱')
    return
  }
  if (resetForm.password !== resetForm.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }

  try {
    const res = await fetch('/chicken-api/password/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: resetForm.identifier,
        code: resetForm.code,
        password: resetForm.password
      })
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(data.error || data.message || '重置密码失败')
    }

    form.identifier = resetForm.identifier
    form.password = ''
    form.code = ''
    resetDialogVisible.value = false
    ElMessage.success(data.message || '密码重置成功，请重新登录')
  } catch (err) {
    ElMessage.error(err.message || '重置密码失败')
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
  if (resetCountdownTimer) {
    window.clearInterval(resetCountdownTimer)
  }
})
</script>

<style scoped>
.login-container {
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

.login-card {
  width: 360px;
  max-width: 100%;
  padding: 24px;
  text-align: center;
  border-radius: 18px;
  background: rgba(12, 22, 42, 0.88);
  border: 1px solid rgba(154, 181, 255, 0.22);
  box-shadow: 0 24px 60px rgba(3, 8, 20, 0.42);
}

.login-card :deep(.el-card__body) {
  padding: 0;
  background: transparent;
}

.reset-dialog :deep(.el-dialog) {
  border-radius: 22px;
  overflow: hidden;
  background:
    radial-gradient(circle at top, rgba(93, 132, 214, 0.22), transparent 42%),
    linear-gradient(180deg, rgba(18, 33, 60, 0.98) 0%, rgba(10, 20, 37, 0.98) 100%);
  border: 1px solid rgba(154, 181, 255, 0.22);
  box-shadow: 0 24px 60px rgba(3, 8, 20, 0.46);
  backdrop-filter: blur(14px);
}

.reset-dialog :deep(.el-overlay-dialog) {
  backdrop-filter: blur(8px);
}

.reset-dialog :deep(.el-dialog__header) {
  margin: 0;
  padding: 22px 24px 12px;
  border-bottom: 1px solid rgba(154, 181, 255, 0.14);
}

.reset-dialog :deep(.el-dialog__title) {
  color: #eef4ff;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.reset-dialog :deep(.el-dialog__headerbtn) {
  top: 18px;
  right: 18px;
}

.reset-dialog :deep(.el-dialog__close) {
  color: #9fb7e8;
}

.reset-dialog :deep(.el-dialog__headerbtn:hover .el-dialog__close) {
  color: #eef4ff;
}

.reset-dialog :deep(.el-dialog__body) {
  padding: 20px 24px 12px;
}

.reset-dialog :deep(.el-dialog__footer) {
  padding: 8px 24px 24px;
  border-top: 1px solid rgba(154, 181, 255, 0.12);
}

.title {
  margin-bottom: 20px;
  color: #eef4ff;
}

.form {
  text-align: left;
}

.mode-switch {
  width: 100%;
  display: flex;
}

.mode-switch :deep(.el-radio-button) {
  flex: 1;
}

.mode-switch :deep(.el-radio-button),
.mode-switch :deep(.el-radio-button__inner) {
  width: 100%;
}

.mode-switch :deep(.el-radio-button__inner) {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(154, 181, 255, 0.2);
  color: #c9dbff;
  box-shadow: none !important;
  outline: none !important;
}

.mode-switch :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: #3f67c4;
  border-color: #3f67c4;
  box-shadow: none !important;
  color: #fff;
}

.mode-switch :deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-left-color: rgba(154, 181, 255, 0.2);
}

.mode-switch :deep(.el-radio-button__inner:hover) {
  color: #eef4ff;
  border-color: #5f86de;
}

.mode-switch :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner:hover) {
  border-color: #5f86de;
}

.mode-switch :deep(.el-radio-button.is-active .el-radio-button__inner) {
  box-shadow: none !important;
}

.mode-switch :deep(.el-radio-button__original-radio:focus-visible + .el-radio-button__inner) {
  outline: none !important;
  box-shadow: none !important;
  border-left-color: rgba(154, 181, 255, 0.2);
}

.mode-switch :deep(.el-radio-button:not(:first-child) .el-radio-button__inner) {
  margin-left: -1px;
}

.mode-switch :deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-right-color: rgba(154, 181, 255, 0.2);
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

.code-row .el-button {
  border-color: rgba(154, 181, 255, 0.28);
  background: rgba(63, 103, 196, 0.2);
  color: #dbe7ff;
}

.reset-dialog .code-row .el-button {
  background: rgba(63, 103, 196, 0.26);
}

.code-row .el-input {
  flex: 1;
}

.links {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.links a,
.text-link {
  color: #abc8ff;
  text-decoration: none;
}

.links a:hover,
.text-link:hover {
  color: #eef4ff;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.dialog-footer :deep(.el-button) {
  border-radius: 12px;
  padding: 10px 18px;
}

.dialog-footer :deep(.el-button:not(.el-button--primary)) {
  border-color: rgba(154, 181, 255, 0.24);
  background: rgba(255, 255, 255, 0.04);
  color: #d7e4ff;
}

.dialog-footer :deep(.el-button:not(.el-button--primary):hover) {
  border-color: #5f86de;
  color: #eef4ff;
}

.dialog-footer :deep(.el-button--primary) {
  border-color: #3f67c4;
  background: linear-gradient(135deg, #4d78da 0%, #3158af 100%);
}

.dialog-footer :deep(.el-button--primary:hover) {
  border-color: #5f86de;
  background: linear-gradient(135deg, #5b84e2 0%, #3b63bc 100%);
}
</style>

<style>
.el-overlay:has(.el-dialog.reset-dialog) {
  background: rgba(4, 10, 24, 0.58);
  backdrop-filter: blur(8px);
}

.el-overlay-dialog:has(.el-dialog.reset-dialog) {
  background: transparent !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

.el-dialog.reset-dialog {
  --el-dialog-bg-color: #0f1c33;
  --el-bg-color-overlay: #0f1c33;
  --el-box-shadow: 0 24px 60px rgba(3, 8, 20, 0.46);
  border-radius: 22px;
  overflow: hidden;
  padding: 0 !important;
  background:
    radial-gradient(circle at top, rgba(93, 132, 214, 0.22), transparent 42%),
    linear-gradient(180deg, rgba(18, 33, 60, 0.98) 0%, rgba(10, 20, 37, 0.98) 100%) !important;
  border: none !important;
  outline: none !important;
  box-shadow: 0 24px 60px rgba(3, 8, 20, 0.46) !important;
  background-clip: padding-box;
}

.el-dialog.reset-dialog::before,
.el-dialog.reset-dialog::after,
.el-overlay-dialog:has(.el-dialog.reset-dialog)::before,
.el-overlay-dialog:has(.el-dialog.reset-dialog)::after {
  content: none !important;
  border: none !important;
  box-shadow: none !important;
}

.el-dialog.reset-dialog .el-dialog__header {
  margin: 0;
  padding: 22px 24px 12px;
  border-bottom: 1px solid rgba(154, 181, 255, 0.14);
  background: transparent !important;
}

.el-dialog.reset-dialog .el-dialog__title {
  color: #eef4ff;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.el-dialog.reset-dialog .el-dialog__headerbtn {
  top: 18px;
  right: 18px;
}

.el-dialog.reset-dialog .el-dialog__close {
  color: #9fb7e8;
}

.el-dialog.reset-dialog .el-dialog__headerbtn:hover .el-dialog__close {
  color: #eef4ff;
}

.el-dialog.reset-dialog .el-dialog__body {
  padding: 20px 24px 12px;
  background: transparent !important;
  color: #dbe7ff;
}

.el-dialog.reset-dialog .el-dialog__footer {
  padding: 8px 24px 24px;
  border-top: 1px solid rgba(154, 181, 255, 0.12);
  background: transparent !important;
}

.el-overlay-dialog:has(.el-dialog.reset-dialog),
.el-dialog.reset-dialog,
.el-dialog.reset-dialog .el-dialog__header,
.el-dialog.reset-dialog .el-dialog__body,
.el-dialog.reset-dialog .el-dialog__footer {
  background-color: #0f1c33 !important;
}
</style>
