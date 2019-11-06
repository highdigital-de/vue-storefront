const path = require('path');
const rootPath = path.resolve(__dirname, '../')
const vsPath = path.resolve(__dirname, '../../../../node_modules/@vue-storefront')
const cssPath = path.resolve(__dirname, '../css')

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need
  config.module.rules.push(
    {
      test: /\.scss$/,
      use: [
        'vue-style-loader',
        'css-loader',
        'sass-loader'
      ],
    },
    {
      test: /\.ts$/,
      loader: 'ts-loader',
      options: {
        appendTsSuffixTo: [/\.vue$/]
      },
      exclude: /node_modules/
    },
  );

  config.resolve.alias['theme/css'] = cssPath
  config.resolve.alias['@vue-storefront'] = path.resolve(__dirname, '../vue-storefront-mock')
  console.log(config.resolve.alias)
  return config;
};