const path = require('path')

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: true,
        inlineRequires: true,
      },
    }),
  },
  watchFolders: [path.resolve(__dirname, './node_modules/@dappface/ethereum-provider')],
}
