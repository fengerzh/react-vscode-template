import { defineConfig } from "cypress";

type SetupNodeEvents = Parameters<typeof defineConfig>[0]["e2e"]["setupNodeEvents"];

/**
 * @type {Cypress.PluginConfig}
 */
export default ((on, config) => config) satisfies SetupNodeEvents;
