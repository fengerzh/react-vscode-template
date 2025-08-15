import { defineConfig } from "cypress";
import pluginConfig from "./cypress/plugins/index";

export default defineConfig({
  projectId: "td92co",

  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
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
