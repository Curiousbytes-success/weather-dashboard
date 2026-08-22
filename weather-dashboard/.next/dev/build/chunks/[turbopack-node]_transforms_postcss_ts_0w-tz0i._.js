module.exports = [
"[turbopack-node]/transforms/postcss.ts?config=[project]/weather-dashboard/postcss.config.mjs { CONFIG => \"[project]/weather-dashboard/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "chunks/1v8r_1323gnc._.js",
  "chunks/[root-of-the-server]__1kw4_-5._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts?config=[project]/weather-dashboard/postcss.config.mjs { CONFIG => \"[project]/weather-dashboard/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];