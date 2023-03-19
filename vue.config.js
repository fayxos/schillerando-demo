const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  outputDir: './docs',
  publicPath: process.env.NODE_ENV === "production" ? "/schillerando/" : "/",
};
