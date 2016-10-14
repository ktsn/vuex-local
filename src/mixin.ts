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

      const localModule = this.$options.local.call(this)

      let name = localModule.name
      assert(typeof name === 'string', 'local module name must be string')
      assert(name !== '', 'local module name cannot be empty')
      assert(isObject(localModule.state), 'state must be object')

      const modulePath = this._localModulePath = namespace.concat(name)

      registerLocalModule(this.$store, modulePath, localModule)

      // map the local module to this vm
      applyLocalModule(this.$options, modulePath, localModule)
    },

    beforeDestroy () {
      if (!this.$options.local) return

      unregisterLocalModule(this.$store, this._localModulePath)
    }
  } as ComponentOptions<_Vue & VuePrivate>)
}
