const originalConfig = require('./.shell/pkg/vue.config')(__dirname);

module.exports = {
  ...originalConfig,
  configureWebpack: config => {
    config.module.rules.push({
      test: /\.md$/,
      use: [
        {
          loader: 'raw-loader'
        }
      ]
    });

    if (typeof originalConfig.configureWebpack === 'function') {
      originalConfig.configureWebpack(config)
    }
  }
}
