import * as assert from 'power-assert'
import * as Vue from 'vue'
import * as Vuex from 'vuex'
import { registerLocalModule } from '../src/register'

Vue.use(Vuex)

describe('Register Local Module', () => {
  let store: Vuex.Store<any>

  beforeEach(() => {
    store = new Vuex.Store({
      getters: {
        rootGetter: () => 'root'
      }
    })
  })

  it('accepts local module registration', () => {
    const localModule = {
      name: 'test',
      state: {
        count: 0
      },
      getters: {
        count: (state: any) => state.count
      },
      actions: {
        foo ({ commit }: any, amount: any) {
          commit('bar', amount)
        }
      },
      mutations: {
        bar (state: any, amount: any) {
          state.count += amount
        }
      }
    }

    registerLocalModule(store, ['test'], localModule)

    const name = localModule.name
    assert(store.state.test.count === 0)
    assert(store.getters['local/' + name + '/count'] === 0)

    store.dispatch('local/' + name + '/foo', 1)
    assert(store.state.test.count === 1)

    store.commit('local/' + name + '/bar', 2)
    assert(store.state.test.count === 3)
  })

  it('passes local getters in local module actions', done => {
    const localModule = {
      name: 'test',
      state: {
        count: 0
      },
      getters: {
        count: (state: any) => state.count + 1
      },
      actions: {
        foo ({ getters }: any) {
          assert(getters.count === 1)
          done()
        }
      }
    }

    registerLocalModule(store, ['test'], localModule)

    const name = localModule.name
    store.dispatch('local/' + name + '/foo')
  })

  it('passes root getters in local module actions', done => {
    const localModule = {
      name: 'test',
      state: {
        count: 0
      },
      actions: {
        foo ({ rootGetters }: any) {
          assert(rootGetters.rootGetter === 'root')
          done()
        }
      }
    }

    registerLocalModule(store, ['test'], localModule)

    const name = localModule.name
    store.dispatch('local/' + name + '/foo')
  })

  it('should not evaluate getters until referred in actions', () => {
    const localModule = {
      name: 'test',
      state: {
        count: 0
      },
      getters: {
        count: (state: any) => state.count,
        never: () => assert(false)
      },
      actions: {
        foo ({ getters }: any) {
          assert(getters.count === 0)
        }
      }
    }

    registerLocalModule(store, ['test'], localModule)

    store.dispatch('local/' + localModule.name + '/foo')
  })
})
