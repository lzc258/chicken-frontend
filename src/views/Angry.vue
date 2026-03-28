<template>
  <div class="container">
    <h1>
      Angry Chicken <span class="fire-emoji">🔥</span>
    </h1>

    <video
      ref="myVideo"
      controls
      autoplay
      loop
    >
      <source src="/chicken-static/video/angry.mp4" type="video/mp4" />
      您的浏览器不支持 video 标签。
    </video>

    <div class="controls">
      <button @click="playVideo">播放</button>
      <button @click="pauseVideo">暂停</button>
      <button @click="replayVideo">重播</button>
      <button @click="goHome">🏠 返回应用中心</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 绑定 video 元素
const myVideo = ref(null)

const goHome = () => {
  router.push('/center/apps')
}

const playVideo = () => {
  myVideo.value.play()
}

const pauseVideo = () => {
  myVideo.value.pause()
}

const replayVideo = () => {
  myVideo.value.currentTime = 0
  myVideo.value.play()
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: #222;
  color: #fff;
  font-family: "Microsoft YaHei", sans-serif;
  margin: 0;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

h1 {
  font-size: 3em;
  margin-bottom: 10px;
  text-shadow: 2px 2px 8px #ff4500;
}

.fire-emoji {
  font-size: 5em;
  animation: burn 1s infinite alternate;
  display: inline-block;
}

@keyframes burn {
  0%   { transform: scale(1); }
  25%  { transform: scale(1.2) rotate(-5deg); }
  50%  { transform: scale(1.4) rotate(5deg); }
  75%  { transform: scale(1.2) rotate(-3deg); }
  100% { transform: scale(1); }
}

video {
  max-width: 90%;
  width: 600px;
  border: 5px solid #ff4500;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(255,69,0,0.6);
  margin-top: 20px;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 15px;
  justify-content: center;
}

button {
  padding: 10px 20px;
  font-size: 1em;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: linear-gradient(to right, #ffcc00, #ff4500);
  color: #fff;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.4);
}

@media (max-width: 600px) {
  .container {
    padding: 10px;
  }

  .fire-emoji {
    font-size: 2rem;
  }

  video, img {
    max-width: 100vw;
    height: auto;
    display: block;
    margin: 0 auto;
  }

  h1, h2, h3, h4 {
    font-size: 1.2rem;
  }

  .controls {
    width: 100%;
    justify-content: center;
  }

  button {
    width: 100%;
    max-width: 320px;
  }
}

</style>
