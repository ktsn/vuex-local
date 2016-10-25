import * as Vue from 'vue'
import { Mutation } from 'vuex'
import { Dictionary, LocalModule, LocalGetter, LocalAction } from './declarations'

import { localKey } from './utils'

export function mapLocalModule (
  vm: Vue,
  modulePath: string[],
  module: LocalModule
): void {
  mapState(vm, module.state, modulePath)

  const moduleName = modulePath[modulePath.length - 1]

  if (module.getters) {
    mapGetters(vm, module.getters, moduleName)
  }

  if (module.actions) {
    mapActions(vm, module.actions, moduleName)
  }

  if (module.mutations) {
    mapMutations(vm, module.mutations, moduleName)
  }
}

function getSubState (state: any, path: string[]) {
  return path.reduce((sub, key) => sub[key], state)
}

function mapState (
  vm: Vue,
  state: Dictionary<any>,
  path: string[]
): void {
  Object.keys(state).forEach(key => {
    Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: true,
      get: () => getSubState(vm.$store.state, path)[key]
    })
  })
}

function mapGetters (
  vm: Vue,
  getters: Dictionary<LocalGetter<any, any>>,
  moduleName: string
): void {
  Object.keys(getters).forEach(key => {
    Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: true,
      get: () => vm.$store.getters[localKey(key, moduleName)]
    })
  })
}

function mapActions (
  vm: Vue,
  actions: Dictionary<LocalAction<any, any>>,
  moduleName: string
): void {
  Object.keys(actions).forEach(key => {
    (vm as any)[key] = (payload: any) => {
      return vm.$store.dispatch(localKey(key, moduleName), payload)
    }
  })
}

function mapMutations (
  vm: Vue,
  mutations: Dictionary<Mutation<any>>,
  moduleName: string
): void {
  Object.keys(mutations).forEach(key => {
    (vm as any)[key] = (payload: any) => {
      vm.$store.commit(localKey(key, moduleName), payload)
    }
  })
}
