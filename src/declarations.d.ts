import { ActionContext, Mutation } from 'vuex'

export type Dictionary<T> = { [key: string]: T }

export interface PluginOptions {
  parentModulePath?: string[]
}

interface LocalActionContext<S, R> extends ActionContext<S, R> {
  rootGetters: any
}

type LocalGetter<S, R> = (state: S, getters: any, rootState: R, rootGetters: any) => any
type LocalAction<S, R> = (ctx: LocalActionContext<S, R>, payload: any) => any

export interface LocalModule {
  name: string
  state: Dictionary<any>
  getters?: Dictionary<LocalGetter<any, any>>
  actions?: Dictionary<LocalAction<any, any>>
  mutations?: Dictionary<Mutation<any>>
}

export interface VuePrivate {
  _localModulePath: string[]
}
