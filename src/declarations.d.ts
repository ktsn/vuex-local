import * as Vue from 'vue'
import { Getter, Action, Mutation } from 'vuex'

export type Dictionary<T> = { [key: string]: T }

export interface PluginOptions {
  namespace?: string[]
}

export interface LocalModule {
  name: string | ((this: Vue) => string)
  state: Dictionary<any>
  getters?: Dictionary<Getter<any, any>>
  actions?: Dictionary<Action<any, any>>
  mutations?: Dictionary<Mutation<any>>
}

export interface VuePrivate {
  _localModulePath: string[]
}
