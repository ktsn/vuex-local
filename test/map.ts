import * as assert from 'power-assert'
import Vue from 'vue'
import * as Vuex from 'vuex'
import { mapLocalModule } from '../src/map'

Vue.use(Vuex)

describe('Map Local Module', () => {
  let store: Vuex.Store<any>

  const localModule = {
    name: 'test',
    state: {
      count: 0
    },
    getters: {
      plus10: (state: any) => state.count + 10
    },
    actions: {
      foo (_: any, fn: Function) {
        fn()
      }
    },
    mutations: {
      bar (state: any, amount: any) {
        state.count += amount
      }
    }
  }

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        test: {
          state: localModule.state,
          getters: {
            'local/test/plus10': localModule.getters.plus10
          },
          actions: {
            'local/test/foo': localModule.actions.foo
          },
          mutations: {
            'local/test/bar': localModule.mutations.bar
          }
        }
      }
    })
  })

  it('maps local module', done => {
    const vm: any = new Vue({
      store,
      beforeCreate () {
        mapLocalModule(this, ['test'], localModule)
      }
    })

    assert(vm.count === 0)
    assert(vm.plus10 === 10)

    vm.bar(3)
    assert(vm.count === 3)

    vm.foo(done)
  })
})
