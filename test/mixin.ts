import * as assert from 'power-assert'
import * as Vue from 'vue'
import * as Vuex from 'vuex'
import { applyMixin } from '../src/mixin'

Vue.use(Vuex)

describe('Global Mixin', () => {
  let store: Vuex.Store<any>

  applyMixin(Vue, {
    parentModulePath: ['local']
  })

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        local: {}
      }
    })
  })

  it('binds local module', () => {
    const vm: any = new Vue({
      store,
      local: () => ({
        name: 'test',
        state: { value: 0 },
        getters: {
          plus10: (state: any) => state.value + 10
        },
        actions: {
          foo ({ commit }: any, amount: number) {
            commit('bar', amount)
          }
        },
        mutations: {
          bar (state: any, amount: number) {
            state.value += amount
          }
        }
      })
    })

    assert(store.state.local.test.value === 0)

    assert(vm.value === 0)
    assert(vm.plus10 === 10)

    vm.foo(1)
    assert(vm.value === 1)

    vm.bar(2)
    assert(vm.value === 3)
  })

  it('remove local module when component is destroyed', () => {
    const vm: any = new Vue({
      store,
      local: () => ({
        name: 'test',
        state: { value: 0 }
      })
    })

    assert(store.state.local.test.value === 0)

    vm.$destroy()

    assert(store.state.local.test === undefined)
  })
})
