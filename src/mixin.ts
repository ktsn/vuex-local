import * as _Vue from 'vue'
import { ComponentOptions } from 'vue'
import { Store } from 'vuex'
import { PluginOptions, VuePrivate } from './declarations'

import { registerLocalModule, unregisterLocalModule } from './register'
import { mapLocalModule } from './map'

import { isObject, assert } from './utils'

export function applyMixin (
  Vue: typeof _Vue,
  options: PluginOptions
): void {
  const {
    parentModulePath = []
  } = options

  Vue.mixin({
    created () {
      if (!this.$options.local) return

      assert(this.$store, 'store must be injected')

      ensureParent(this.$store, parentModulePath)

      const localModule = this.$options.local.call(this)

      let name = localModule.name
      assert(typeof name === 'string', 'local module name must be string')
      assert(name !== '', 'local module name cannot be empty')
      assert(isObject(localModule.state), 'state must be object')

      const modulePath = this._localModulePath = parentModulePath.concat(name)

      registerLocalModule(this.$store, modulePath, localModule)

      // map the local module to this vm
      mapLocalModule(this, modulePath, localModule)
    },

    beforeDestroy () {
      if (!this.$options.local) return

      unregisterLocalModule(this.$store, this._localModulePath)
    }
  } as ComponentOptions<_Vue & VuePrivate>)
}

function ensureParent (store: Store<any>, parentPath: string[]): void {
  let state = store.state
  const currentPath: string[] = []
  parentPath.forEach(key => {
    state = state[key]
    currentPath.push(key)

    if (typeof state === 'undefined') {
      store.registerModule(currentPath, {})
    }
  })
}
