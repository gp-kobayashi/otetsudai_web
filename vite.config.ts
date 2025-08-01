/// <reference types="vitest" />
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' }) 

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    test:{
        globals: true,
        environment: "happy-dom",
        setupFiles: ["./vitest.setup.ts", "./test/setup/setup.ts"],
        coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'html'],
      all: true,
      exclude: ['node_modules/', 'test/'],
    }
    }
})