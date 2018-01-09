const replace = require('rollup-plugin-replace')
const meta = require('../package.json')

const banner = `/*!
 * ${meta.name} v${meta.version}
 * ${meta.homepage}
 *
 * @license
 * Copyright (c) 2016-present ${meta.author}
 * Released under the MIT license
 * ${meta.homepage}/blob/master/LICENSE
 */`

const config = {
  input: 'lib/index.js',
  output: {
    name: 'VuexLocal',
    globals: {
      vue: 'Vue',
      vuex: 'Vuex'
    },
    banner
  },
  plugins: [],
  external: ['vue', 'vuex']
}

const output = config.output
switch (process.env.BUILD) {
  case 'commonjs':
    output.file = `dist/${meta.name}.cjs.js`
    output.format = 'cjs'
    break
  case 'development':
    output.file = `dist/${meta.name}.js`
    output.format = 'umd'
    config.plugins.push(
      replace({
        'process.env.NODE_ENV': JSON.stringify('development')
      })
    )
    break
  case 'production':
    output.format = 'umd'
    config.plugins.push(
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    )
    break
  default:
    throw new Error('Unknown build environment')
}

module.exports = config
