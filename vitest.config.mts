import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    // tsconfig の paths（@/* エイリアス）をネイティブ解決
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    // localStorage を正しく使えるよう実オリジンを与える（opaque origin 回避）
    environmentOptions: { jsdom: { url: 'http://localhost/' } },
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    // ビルド成果物や node_modules は対象外
    exclude: ['node_modules', '.next', 'public'],
  },
})
