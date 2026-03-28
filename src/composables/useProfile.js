import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const profile = reactive({
  username: '',
  email: '',
  phone: '',
  bio: ''
})

const loadProfile = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('/chicken-api/user/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!res.ok) throw new Error('获取个人信息失败')

    const data = await res.json()

    profile.username = data.username || profile.username
    profile.email = data.email || profile.email
    profile.phone = data.phone || profile.phone
    profile.bio = data.bio || profile.bio

    // ElMessage.success('个人信息加载成功')

  } catch (error) {
    ElMessage.warning('个人信息加载失败')
  }
}

export function useProfile() {
  return {
    profile,
    loadProfile
  }
}