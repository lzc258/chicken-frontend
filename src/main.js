import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 按需方式优化：只保留弹窗样式，其他组件按需加载（通过 unplugin 处理）
import 'element-plus/theme-chalk/el-message.css'

createApp(App)
  .use(router)
  .mount('#app')