import Vue from 'vue'
import { LocalModule } from './declarations'

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    local?: (this: V) => LocalModule
  }
}
