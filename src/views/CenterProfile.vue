<template>
  <div class="tab-card">
    <h3>个人信息</h3>

    <el-form :model="localProfile" label-width="100px" class="profile-form">

      <!-- 用户名 -->
      <el-form-item label="用户名">
        <div class="input-with-btn">

          <el-input
            v-model="localProfile.username"
            :disabled="!editState.username"
          />

          <el-button
            v-if="!editState.username"
            size="small"
            type="primary"
            @click="enterEdit('username')"
          >
            修改
          </el-button>

          <template v-else>
            <el-button
              size="small"
              type="success"
              @click="updateField('username')"
            >
              保存
            </el-button>

            <el-button
              size="small"
              @click="cancelEdit('username')"
            >
              取消
            </el-button>
          </template>

        </div>
      </el-form-item>

      <!-- 邮箱 -->
      <el-form-item label="邮箱">
        <div class="input-with-btn">
          <div class="email-edit-group">
            <el-input
              v-model="localProfile.email"
              :disabled="!editState.email"
            />

            <div v-if="editState.email" class="email-code-row">
              <el-input
                v-model="emailVerification.code"
                placeholder="输入邮箱验证码"
              />
              <el-button
                :disabled="sendingEmailCode || emailCountdown > 0"
                @click="sendEmailCode"
              >
                {{ emailCountdown > 0 ? `${emailCountdown}s后重发` : '发送验证码' }}
              </el-button>
            </div>
          </div>

          <el-button
            v-if="!editState.email"
            size="small"
            type="primary"
            @click="enterEdit('email')"
          >
            修改
          </el-button>

          <template v-else>
            <el-button
              size="small"
              type="success"
              @click="updateField('email')"
            >
              保存
            </el-button>

            <el-button
              size="small"
              @click="cancelEdit('email')"
            >
              取消
            </el-button>
          </template>

        </div>
      </el-form-item>

      <!-- 手机号 -->
      <el-form-item label="手机号">
        <div class="input-with-btn">

          <el-input
            v-model="localProfile.phone"
            :disabled="!editState.phone"
          />

          <el-button
            v-if="!editState.phone"
            size="small"
            type="primary"
            @click="enterEdit('phone')"
          >
            修改
          </el-button>

          <template v-else>
            <el-button
              size="small"
              type="success"
              @click="updateField('phone')"
            >
              保存
            </el-button>

            <el-button
              size="small"
              @click="cancelEdit('phone')"
            >
              取消
            </el-button>
          </template>

        </div>
      </el-form-item>

      <!-- 简介 -->
      <el-form-item label="简介">
        <div class="input-with-btn">

          <el-input
            type="textarea"
            rows="5"
            v-model="localProfile.bio"
            :disabled="!editState.bio"
          />

          <el-button
            v-if="!editState.bio"
            size="small"
            type="primary"
            @click="enterEdit('bio')"
          >
            修改
          </el-button>

          <template v-else>
            <el-button
              size="small"
              type="success"
              @click="updateField('bio')"
            >
              保存
            </el-button>

            <el-button
              size="small"
              @click="cancelEdit('bio')"
            >
              取消
            </el-button>
          </template>

        </div>
      </el-form-item>

    </el-form>
    <div class="logout-row">
      <el-button type="danger" @click="handleLogout" class="logout-btn">退出登录</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useProfile } from '@/composables/useProfile'
import { useAuth } from '@/composables/useAuth'
const { profile } = useProfile()

// 本地副本，编辑时不影响全局 profile
const localProfile = reactive({
  username: '',
  email: '',
  phone: '',
  bio: ''
})

// 是否进入编辑状态
const editState = reactive({
  username: false,
  email: false,
  phone: false,
  bio: false,
})

const emailVerification = reactive({
  code: '',
})

const sendingEmailCode = ref(false)
const emailCountdown = ref(0)
let emailCountdownTimer = null

Object.assign(localProfile, profile)
// 备份数据（用于取消恢复）
const backupProfile = reactive({})

const isValidEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

const startEmailCountdown = () => {
  emailCountdown.value = 60
  emailCountdownTimer = window.setInterval(() => {
    if (emailCountdown.value <= 1) {
      emailCountdown.value = 0
      window.clearInterval(emailCountdownTimer)
      emailCountdownTimer = null
      return
    }
    emailCountdown.value -= 1
  }, 1000)
}

// 进入编辑
const enterEdit = (field) => {
  backupProfile[field] = localProfile[field]
  editState[field] = true
  if (field === 'email') {
    emailVerification.code = ''
  }
}

// 取消编辑
const cancelEdit = (field) => {
  localProfile[field] = backupProfile[field]
  editState[field] = false
  if (field === 'email') {
    emailVerification.code = ''
  }
}

const sendEmailCode = async () => {
  if (!localProfile.email) {
    ElMessage.error('请输入新邮箱')
    return
  }
  if (!isValidEmail(localProfile.email)) {
    ElMessage.error('请输入有效的邮箱')
    return
  }

  const token = localStorage.getItem('token')
  sendingEmailCode.value = true
  try {
    const res = await fetch('/chicken-api/user/send-update-email-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ email: localProfile.email }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(data.error || data.message || '发送验证码失败')
    }

    ElMessage.success(data.message || '验证码已发送')
    startEmailCountdown()
  } catch (error) {
    ElMessage.error(error.message || '发送验证码失败')
  } finally {
    sendingEmailCode.value = false
  }
}

// 保存
const updateField = async (field) => {
  try {
    const token = localStorage.getItem('token')
    const body = {}
    if (field === 'email') {
      if (!isValidEmail(localProfile.email)) {
        ElMessage.error('请输入有效的邮箱')
        return
      }
      if (!emailVerification.code) {
        ElMessage.error('请输入邮箱验证码')
        return
      }
      body.email = localProfile.email
      body.code = emailVerification.code
    } else {
      body[field] = localProfile[field]
    }
    const res = await fetch(`/chicken-api/user/update-${field}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || data.message || '更新失败')
    editState[field] = false
    // 保存成功后同步到全局 profile
    profile[field] = localProfile[field]
    if (field === 'email') {
      emailVerification.code = ''
    }
    const labelMap = {
      username: '用户名',
      email: '邮箱',
      phone: '手机号',
      bio: '简介',
    }
    ElMessage.success(`${labelMap[field]}已更新`)
  } catch (e) {
    ElMessage.error(e.message || '更新失败，请稍后再试')
  }
}

const router = useRouter()
const { logout } = useAuth()

const handleLogout = () => {
  logout()
  router.replace('/login')
}

// 保证刷新后localProfile和profile同步
watch(profile, (val) => {
  Object.assign(localProfile, val)
}, { immediate: true })

onBeforeUnmount(() => {
  if (emailCountdownTimer) {
    window.clearInterval(emailCountdownTimer)
  }
})

</script>

<style scoped>
.tab-card {
  padding: 20px;
}

/* 表单整体宽度控制 */
.profile-form {
  max-width: 700px;
}

/* 每一行输入 + 按钮布局 */
.input-with-btn {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
}

/* ⭐关键：让输入框撑满剩余空间 */
.input-with-btn .el-input {
  flex: 1;
  min-width: 0;
}

.email-edit-group {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.email-code-row {
  display: flex;
  gap: 10px;
  width: 100%;
}

.email-code-row .el-input {
  flex: 1;
}

/* textarea 也要撑满 */
.input-with-btn .el-textarea {
  flex: 1;
  min-width: 0;
}

/* 按钮统一视觉 */
.input-with-btn .el-button {
  white-space: nowrap;
}

/* 表单项更紧凑一点（可选优化） */
.el-form-item {
  margin-bottom: 18px;
}

/* label 对齐优化（可选） */
.el-form-item__label {
  font-weight: 500;
  color: #333;
}

/* 输入框 hover/focus 轻微增强（可选高级感） */
.el-input__wrapper {
  transition: all 0.2s ease;
}

.el-input__wrapper:hover {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

.el-input.is-focus .el-input__wrapper {
  box-shadow: 0 0 0 1px #409eff inset;
}

/* 手机端适配 */
@media (max-width: 600px) {
  .tab-card {
    padding: 10px;
  }
  .profile-form {
    max-width: 100%;
  }
  .input-with-btn {
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
  }
  .input-with-btn .el-button {
    width: 100%;
    margin-left: 0;
    height: 36px;
  }
  .el-form-item__label {
    font-size: 1rem;
  }
}

/* 登出按钮 */
.logout-row {
  margin-top: 32px;
  display: flex;
  justify-content: flex-start;
}
.logout-btn {
  width: 120px;
}
</style>
