<template>
  <div class="birthday-container">
    <div class="birthday-content">
      <h1 class="birthday-title">🎉 xxx生日快乐！🎂</h1>
      <p class="birthday-message">祝你生日快乐，生活甜蜜如蜜！</p>

      <div class="birthday-song">
        <h2>播放生日快乐歌</h2>
        <audio controls autoplay>
          <source src="/birthdaysong.mp3" type="audio/mpeg">
          您的浏览器不支持音频播放。
        </audio>
      </div>

      <div class="birthday-gift">
        <p>🎁 愿你所有的梦想都能成真！</p>
        <p>🌟 愿你的人生充满欢笑和幸福！</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// 组件逻辑（如果需要）
</script>

<style scoped>
.birthday-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
  font-family: 'Arial', sans-serif;
}

.birthday-content {
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 90%;
}

.birthday-title {
  font-size: 3rem;
  color: #ff6b6b;
  margin-bottom: 1rem;
  animation: bounce 2s infinite;
}

.birthday-message {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 2rem;
}

.birthday-song {
  margin: 2rem 0;
}

.birthday-song h2 {
  color: #4ecdc4;
  margin-bottom: 1rem;
}

.birthday-gift {
  margin-top: 2rem;
  font-size: 1.2rem;
  color: #333;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}
</style>