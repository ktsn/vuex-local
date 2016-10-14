import { Store, Getter, Action, Payload } from 'vuex'
import { Dictionary, LocalModule, LocalGetter, LocalAction } from './declarations'

import { localKey, mapValues, mapKeys } from './utils'

export function registerLocalModule (
  store: Store<any>,
  modulePath: string[],
  module: LocalModule
): void {
  const {
    state,
    getters = {},
    actions = {},
    mutations = {}
  } = module

  const name = modulePath[modulePath.length - 1]

  store.registerModule(modulePath, {
    state,
    getters: mapLocalKeys(mapLocalGetters(getters, name), name),
    actions: mapLocalKeys(mapLocalActions(actions, getters, name), name),
    mutations: mapLocalKeys(mutations, name)
  })
}

export function unregisterLocalModule (
  store: Store<any>,
  modulePath: string[]
): void {
  store.unregisterModule(modulePath)
}

export function mapLocalKeys (obj: Dictionary<any>, moduleName: string): Dictionary<any> {
  return mapKeys(obj, (_, key) => localKey(key, moduleName))
}

function mapLocalGetters (
  getters: Dictionary<LocalGetter<any, any>>,
  moduleName: string
): Dictionary<Getter<any, any>> {
  return mapValues(getters, getter => {
    return function wrappedGetter (state, rootGetters, rootState) {
      const localGetters = makeLocalGetters(Object.keys(getters), rootGetters, moduleName)
      return getter(state, localGetters, rootState, rootGetters)
    } as Getter<any, any>
  })
}

function mapLocalActions (
  actions: Dictionary<LocalAction<any, any>>,
  getters: Dictionary<LocalGetter<any, any>>,
  moduleName: string
): Dictionary<Action<any, any>> {
  return mapValues(actions, action => {
    return function wrappedAction (context, payload) {
      // overwrite commit and dispatch to convert
      // action and mutation type to prefixed format
      const { commit, dispatch } = context
      context.commit = function localCommit (type: string | Payload, payload?: any, options?: any) {
        if (typeof type === 'object') {
          options = payload
          type = type.type
          payload = type
        }
        return commit(localKey(type, moduleName), payload, options)
      }
      context.dispatch = function localDispatch (type: string | Payload, payload?: any) {
        if (typeof type === 'object') {
          type = type.type
          payload = type
        }
        return dispatch(localKey(type, moduleName), payload)
      }

      // expose real getters object as rootGetters
      const rootGetters = context.getters
      context.rootGetters = rootGetters
      context.getters = makeLocalGetters(Object.keys(getters), rootGetters, moduleName)

      // execute original action
      action(context, payload)
    } as LocalAction<any, any>
  })
}

function makeLocalGetters (getterKeys: string[], getters: Dictionary<any>, moduleName: string): Dictionary<any> {
  const localGetters = {}
  getterKeys.forEach(key => {
    Object.defineProperty(localGetters, key, {
      get () {
        return getters[localKey(key, moduleName)]
      }
    })
  })
  return localGetters
}
