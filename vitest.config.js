import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: './src/setupTests.js',
    coverage: {
      exclude: [
        '*.cjs',
        '*.config.js',
        'src/App.jsx',
        'src/main.jsx',
        'src/__tests__',
        'src/**/__tests__',
      ],
    },
  },
});
