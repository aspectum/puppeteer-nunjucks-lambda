require("esbuild").build({
  entryPoints: ["./index.ts"],
  bundle: true,
  platform: "node",
  outfile: "dist/index.js",
  target: "node18",
  minify: true,
  external: ["@sparticuz/chromium"],
});
