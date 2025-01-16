import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
    esbuild: {
        jsxFactory: "flactElement",
        jsxInject: `import { flactElement } from 'flact'`,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
