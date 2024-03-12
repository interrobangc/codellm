/** @type {import('@remix-run/dev').AppConfig} */
export default {
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
  browserNodeBuiltinsPolyfill: {
    modules: {
      fs: true,
      http: true,
      https: true,
      os: true,
      path: true,
      process: true,
      zlib: true,
    },
  },

  ignoredRouteFiles: ['**/*.css'],
};
