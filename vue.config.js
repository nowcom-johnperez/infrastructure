const config = require('@rancher/shell/vue.config');

module.exports = config(__dirname, {
  excludes: [],
  // excludes: ['fleet', 'example']
});

module.exports.devServer = {
  host: '0.0.0.0', // Allow access from any IP
  port: 8005,      // Ensure this matches your development server port
  allowedHosts: [
    'trident.hankeyinvestments.com'
  ],
};