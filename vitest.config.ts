import { defineConfig, type Plugin } from "vitest/config";

const IMAGE_EXT = /\.(jpg|jpeg|png)$/;

function stubImageRequires(): Plugin {
  return {
    name: "stub-image-requires",
    enforce: "pre",
    transform(code, id) {
      if (id.includes("node_modules") || !IMAGE_EXT.test(code) && !code.includes(".jpg")) return null;
      const next = code.replace(/require\((["'])([^"']+\.(?:jpg|jpeg|png))\1\)/g, "({ testUri: 'bundled-cover' })");
      return next === code ? null : { code: next, map: null };
    },
  };
}

export default defineConfig({
  plugins: [stubImageRequires()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
