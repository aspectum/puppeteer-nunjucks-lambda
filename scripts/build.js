require("esbuild").build({
  entryPoints: [`${__dirname}/../src/index.ts`],
  bundle: true,
  platform: "node",
  outfile: "dist/index.js",
  target: "node18",
  minify: true,
  external: ["@sparticuz/chromium"],
});
