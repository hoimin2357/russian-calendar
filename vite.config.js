import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,    // 外部アクセスを許可
    port: 5173     // ポート番号（変更しなくてOK）
  },
})
