const path = require('path')

module.exports = {
  publicRuntimeConfig: {
    BACKEND_URL: process.env.BACKEND_URL,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
  reactStrictMode: false,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: '@import "colors.scss";',
  },
  eslint: {
    dirs: ['pages', 'components', 'ducks', 'redux'],
  },
}
