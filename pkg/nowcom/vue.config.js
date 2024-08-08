// const originalConfig = require('./.shell/pkg/vue.config')(__dirname);

// module.exports = {
//   ...originalConfig,
//   configureWebpack: config => {

//     config.module.rule('md').uses.clear();

//     config.module.rule('md')
//     .test(/\.md$/)
//     .use('raw-loader')
//     .loader('raw-loader')
//     .end()

//     // config.module.rules.push({
//     //   test: /\.md$/,
//     //   use: [
//     //     {
//     //       loader: 'raw-loader'
//     //     }
//     //   ]
//     // });

//     if (typeof originalConfig.configureWebpack === 'function') {
//       originalConfig.configureWebpack(config)
//     }

//     console.log('Final webpack config:', JSON.stringify(config.module.rules, null, 2));
//   }
// }
module.exports = require('./.shell/pkg/vue.config')(__dirname);