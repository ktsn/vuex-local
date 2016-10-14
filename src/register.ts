import { Store, Getter, Action, ActionContext, Payload } from 'vuex'
import { Dictionary, LocalModule } from './declarations'

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
    getters: mapLocalKeys(getters, name),
    actions: mapLocalActions(mapLocalKeys(actions, name), getters, name),
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

function mapLocalActions (
  actions: Dictionary<Action<any, any>>,
  getters: Dictionary<Getter<any, any>>,
  moduleName: string
): Dictionary<Action<any, any>> {
  return mapValues(actions, action => {
    return function localAction (context: ActionContext<any, any>, payload: any) {
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
    }
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
