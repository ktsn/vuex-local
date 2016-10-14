import * as _Vue from 'vue'
import { ComponentOptions } from 'vue'
import { PluginOptions, VuePrivate } from './declarations.d'

import { registerLocalModule, unregisterLocalModule } from './register'
import { applyLocalModule } from './map'

import { isObject, assert } from './utils'

export function applyMixin (
  Vue: typeof _Vue,
  options: PluginOptions
): void {
  const {
    namespace = []
  } = options

  Vue.mixin({
    beforeCreate () {
      if (!this.$options.local) return

      assert(this.$store, 'store must be injected')

      let name = this.$options.local.name
      if (typeof name === 'function') {
        name = name.call(this) as string
      }
      assert(typeof name === 'string', 'local module name must be string')
      assert(name !== '', 'local module name cannot be empty')
      assert(isObject(this.$options.local.state), 'state must be object')

      const modulePath = this._localModulePath = namespace.concat(name)

      registerLocalModule(this.$store, modulePath, this.$options.local)

      // map the local module to this vm
      applyLocalModule(this.$options, modulePath, this.$options.local)
    },

    beforeDestroy () {
      unregisterLocalModule(this.$store, this._localModulePath)
    }
  } as ComponentOptions<_Vue & VuePrivate>)
}
