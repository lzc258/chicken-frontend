import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver({ importStyle: 'css' })],
      dts: false, // 关闭生成类型文件，减少构建时间（可选）
    }),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: {
    host: true,  // ⭐ 监听所有网卡
    port: 5173,       // 可以改成你想要的端口
    logLevel: 'info',
    proxy: {
    '/chicken-api': {
      target: 'http://localhost:8081',
      changeOrigin: true,
      rewrite: path => path.replace(/^\/chicken-api/, ''), // 去掉 /chicken-api 前缀
      configure: (proxy, options) => {
      proxy.on('proxyReq', (proxyReq, req, res) => {
      console.log('[VITE PROXY] req.url:', req.url)
      })
      }
    }
  },
  },
})