import { defineConfig } from "cypress";
import pluginConfig from "./cypress/plugins/index";

export default defineConfig({
  projectId: "td92co",

  e2e: {
    setupNodeEvents(on, config) {
      return pluginConfig(on, config);
    },
    baseUrl: "http://localhost:3123",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
