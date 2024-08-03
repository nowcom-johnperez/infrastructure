const originalConfig = require('./.shell/pkg/vue.config')(__dirname);

module.exports = {
  ...originalConfig,
  configureWebpack: config => {
    // Ensure config.module.rules exists and is an array
    config.module.rules = config.module.rules || [];

    // Normalize use property for each rule
    config.module.rules.forEach(rule => {
      if (rule.use && !Array.isArray(rule.use)) {
        rule.use = [rule.use];
      }
    });

    // Add the raw-loader rule for .md files
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader'
    });

    // Call the original configureWebpack function if it exists
    if (typeof originalConfig.configureWebpack === 'function') {
      originalConfig.configureWebpack(config);
    }
  }
};
