import * as Vue from 'vue'
import 'vuex'
import { LocalModule } from './declarations'

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    local?: LocalModule
  }
}

declare module 'vuex/types/index' {
  interface ActionContext<S, R> {
    rootGetters: any
  }
}
