require("esbuild").build({
  entryPoints: [`${__dirname}/../src/index.ts`],
  bundle: true,
  platform: "node",
  outfile: "dist/index.js",
  target: "node20",
  minify: true,
  external: ["@sparticuz/chromium"],
});
