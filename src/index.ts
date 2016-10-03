import * as _Vue from 'vue'
import { PluginOptions } from './declarations'
import { applyMixin } from './mixin'
import { warn } from './utils'

let Vue: typeof _Vue

export function install (API: typeof _Vue, options: PluginOptions = {}) {
  if (Vue) {
    warn('already installed')
    return
  }
  Vue = API
  applyMixin(Vue, options)
}
