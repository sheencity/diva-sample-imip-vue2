module.exports = {
  lintOnSave: false,
  configureWebpack: {
      resolve: {
          alias: {
              'assets': '@/assets',
              'components': '@/components',
              'config': '@/config',
              'services': '@/services',
              'styles': '@/styles',
              'views': '@/views',
          }
      }
  },
}