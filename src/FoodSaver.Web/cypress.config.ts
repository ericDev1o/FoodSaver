import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: 'https://foodsaver-web.onrender.com',
    supportFile: 'cypress/support/e2e.ts'
  },
  "defaultCommandTimeout": 120000
});
