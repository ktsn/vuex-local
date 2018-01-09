import * as assert from 'power-assert'
import Vue from 'vue'
import * as Vuex from 'vuex'
import { applyMixin } from '../src/mixin'

Vue.use(Vuex)

describe('Global Mixin', () => {
  applyMixin(Vue, {
    parentModulePath: ['local']
  })

  it('auto declare parent module', () => {
    const store: Vuex.Store<any> = new Vuex.Store({})

    new Vue({
      store,
      local: () => ({
        name: 'test',
        state: { value: 0 }
      })
    })

    assert(typeof store.state.local === 'object')
  })

  it('does not touch existing parent module', () => {
    const store: Vuex.Store<any> = new Vuex.Store({
      modules: {
        local: {
          modules: {
            foo: {
              state: {
                value: 'foo'
              }
            }
          }
        }
      }
    })

    new Vue({
      store,
      local: () => ({
        name: 'test',
        state: { value: 'test' }
      })
    })

    assert(store.state.local.foo.value === 'foo')
    assert(store.state.local.test.value === 'test')
  })

  it('binds local module', () => {
    const store: Vuex.Store<any> = new Vuex.Store({})

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
    const store: Vuex.Store<any> = new Vuex.Store({})

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

  it('acquires props in generator function', () => {
    const store: Vuex.Store<any> = new Vuex.Store({})

    const vm: any = new Vue({
      store,
      props: ['foo'],
      propsData: {
        foo: 'test'
      },
      local (this: Vue & { foo: string }) {
        return {
          name: 'test',
          state: {
            value: this.foo
          }
        }
      }
    })

    assert(store.state.local.test.value === 'test')
    assert(vm.value === 'test')
  })
})
