<template>
  <div class="container">
    <h1>🎵 会跳舞的鸡 🎵</h1>

    <div class="stage">
      <div class="spotlight"></div>
      <div
        class="chicken"
        :class="{ spinning: isSpinning }"
        @click="spin"
        ref="chickenRef"
      >🐓</div>
    </div>

    <div class="controls">
      <button @click="changeSpeed('fast')">快速模式 🏃</button>
      <button @click="changeSpeed('normal')">正常模式 🚶</button>
      <button @click="changeSpeed('slow')">慢速模式 🐢</button>
      <button @click="spin">旋转！ 🌀</button>
      <button @click="goHome">🏠 返回应用中心</button>
    </div>

    <audio ref="bgmRef" loop autoplay>
      <source src="/chicken-static/audio/bgm.mp3" type="audio/mpeg" />
    </audio>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const chickenRef = ref(null)
const bgmRef = ref(null)
const isSpinning = ref(false)

const router = useRouter()

const goHome = () => {
  router.push('/center/apps')
}

const speeds = { fast: '0.5s', normal: '1s', slow: '2s' }

function changeSpeed(speed) {
  if (chickenRef.value) {
    chickenRef.value.style.animationDuration = speeds[speed]
  }
  createMusicNotes()
}

function spin() {
  if (!chickenRef.value) return

  isSpinning.value = false
  void chickenRef.value.offsetWidth
  isSpinning.value = true

  createMusicNotes(true)

  setTimeout(() => {
    isSpinning.value = false
  }, 500)
}

/* =========================
   🎵 音符系统（核心）
========================= */

// ⭐ 关键：记录所有音符
const notesPool = []

function createMusicNotes(burst = false) {
  if (!chickenRef.value) return

  const rect = chickenRef.value.getBoundingClientRect()

  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  const notes = ['🎵', '🎶', '🎼', '🎤']
  const count = burst ? 12 : 5

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const note = document.createElement('div')
      note.className = 'music-note'
      note.textContent = notes[Math.floor(Math.random() * notes.length)]

      note.style.position = 'fixed'
      note.style.zIndex = 9999

      note.style.left = centerX + (Math.random() * 80 - 40) + 'px'
      note.style.top = centerY + (Math.random() * 30 - 15) + 'px'

      note.style.setProperty('--x', (Math.random() * 260 - 130) + 'px')
      note.style.setProperty('--y', -(180 + Math.random() * 220) + 'px')
      note.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px')
      note.style.setProperty('--rotate', (Math.random() * 120 - 60) + 'deg')

      note.style.animationDelay = Math.random() * 0.3 + 's'

      document.body.appendChild(note)

      // ⭐ 记录起来（关键修复）
      notesPool.push(note)

      setTimeout(() => {
        note.remove()

        // 从池子移除
        const idx = notesPool.indexOf(note)
        if (idx !== -1) notesPool.splice(idx, 1)
      }, 4000)

    }, i * 90)
  }
}

/* =========================
   🔥 生命周期控制
========================= */

let intervalId = null
let playOnceHandler = null

onMounted(() => {
  playOnceHandler = () => {
    bgmRef.value?.play().catch(() => {})
    document.removeEventListener('click', playOnceHandler)
  }

  document.addEventListener('click', playOnceHandler, { once: true })

  intervalId = setInterval(() => {
    if (Math.random() > 0.6) createMusicNotes()
  }, 2500)
})

onBeforeUnmount(() => {
  // 1️⃣ 停止生成
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }

  // 2️⃣ 清理事件
  if (playOnceHandler) {
    document.removeEventListener('click', playOnceHandler)
    playOnceHandler = null
  }

  // 3️⃣ ⭐ 清理所有残留音符（核心修复）
  notesPool.forEach(n => n.remove())
  notesPool.length = 0
})
</script>

<style scoped>
.container {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea, #764ba2);
  overflow: hidden;
  box-sizing: border-box;
  padding: 24px;
}

h1 {
  color: white;
  font-size: 3em;
  margin-bottom: 30px;
}

@media (max-width: 600px) {
  h1 {
    font-size: 2.7em;
  }
}

.stage {
  position: relative;
  z-index: 2;
}

.chicken {
  font-size: 120px;
  cursor: pointer;
  animation: dance 1s infinite;
}

.chicken.spinning {
  animation: spin 0.5s ease-in-out !important;
}

@keyframes dance {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  25% { transform: translateY(-30px) rotate(5deg); }
  50% { transform: translateY(0) rotate(-5deg); }
  75% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes spin {
  from { transform: rotate(0) scale(1.2); }
  to { transform: rotate(360deg) scale(1.2); }
}

.controls {
  margin-top: 40px;
  z-index: 2;
}

button {
  background: white;
  border: none;
  padding: 15px 30px;
  margin: 10px;
  border-radius: 50px;
  cursor: pointer;
}

button:hover {
  transform: scale(1.05);
}

.spotlight {
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255,255,255,.3), transparent);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

<style>
.music-note {
  position: fixed;
  font-size: 30px;
  pointer-events: none;
  transform: translate(-50%, -50%);
  opacity: 0;
  animation: floatUp 4s cubic-bezier(.22,.61,.36,1) forwards;
}

@keyframes floatUp {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(.4) rotate(0deg);
  }
  15% {
    opacity: 1;
    transform:
      translate(calc(-50% + var(--drift)*0.2),
      calc(-50% + var(--y)*0.15))
      scale(1.1)
      rotate(calc(var(--rotate)*0.2));
  }
  60% {
    opacity: .9;
    transform:
      translate(calc(-50% + var(--x)*0.5 + var(--drift)),
      calc(-50% + var(--y)*0.65))
      scale(1.2)
      rotate(calc(var(--rotate)*0.7));
  }
  100% {
    opacity: 0;
    transform:
      translate(calc(-50% + var(--x)),
      calc(-50% + var(--y)))
      scale(1.3)
      rotate(var(--rotate));
  }
}

</style>
