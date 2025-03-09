const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
});

module.exports = {
  outputDir: './docs',
  configureWebpack: {
    resolve: {
      fallback: {
        fs: require.resolve('browserify-fs'),
        path: require.resolve('path-browserify'),
        stream: require.resolve('stream-browserify'),
        crypto: require.resolve("crypto-browserify")
      }
    }
  }
};
