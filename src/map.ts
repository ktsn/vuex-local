import * as _Vue from 'vue'
import { ComponentOptions } from 'vue'
import { Mutation } from 'vuex'
import { Dictionary, LocalModule, LocalGetter, LocalAction } from './declarations'

import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { assign, mapValues, localKey } from './utils'

export function applyLocalModule (
  options: ComponentOptions<_Vue>,
  modulePath: string[],
  module: LocalModule
): void {
  applyState(options, module.state, modulePath)

  const moduleName = modulePath[modulePath.length - 1]

  if (module.getters) {
    applyGetters(options, module.getters, moduleName)
  }

  if (module.actions) {
    applyActions(options, module.actions, moduleName)
  }

  if (module.mutations) {
    applyMutations(options, module.mutations, moduleName)
  }
}

function getSubState (state: any, path: string[]) {
  return path.reduce((sub, key) => sub[key], state)
}

function mapGlobal (options: Dictionary<any>, moduleName: string): Dictionary<string> {
  return mapValues(options, (_, key) => localKey(key, moduleName))
}

function applyState (
  options: ComponentOptions<_Vue>,
  state: Dictionary<any>,
  path: string[]
): void {
  if (typeof options.computed === 'undefined') {
    options.computed = {}
  }

  assign(
    options.computed,
    mapState(mapValues(state, (_, key) => {
      return (state: any) => getSubState(state, path)[key]
    }))
  )
}

function applyGetters (
  options: ComponentOptions<_Vue>,
  getters: Dictionary<LocalGetter<any, any>>,
  moduleName: string
): void {
  if (typeof options.computed === 'undefined') {
    options.computed = {}
  }

  assign(
    options.computed,
    mapGetters(mapGlobal(getters, moduleName))
  )
}

function applyActions (
  options: ComponentOptions<_Vue>,
  actions: Dictionary<LocalAction<any, any>>,
  moduleName: string
): void {
  if (typeof options.methods === 'undefined') {
    options.methods = {}
  }

  assign(
    options.methods,
    mapActions(mapGlobal(actions, moduleName))
  )
}

function applyMutations (
  options: ComponentOptions<_Vue>,
  mutations: Dictionary<Mutation<any>>,
  moduleName: string
): void {
  if (typeof options.methods === 'undefined') {
    options.methods = {}
  }

  assign(
    options.methods,
    mapMutations(mapGlobal(mutations, moduleName))
  )
}
