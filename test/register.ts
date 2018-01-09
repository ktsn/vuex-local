import * as assert from 'power-assert'
import Vue from 'vue'
import * as Vuex from 'vuex'
import { registerLocalModule } from '../src/register'

Vue.use(Vuex)

describe('Register Local Module', () => {
  let store: Vuex.Store<any>

  beforeEach(() => {
    store = new Vuex.Store({
      state: {
        property: null
      },
      getters: {
        rootGetter: () => 'root',
        propertyGetter: (state: any) => state.property
      },
      mutations: {
        baz (state: any, value: any) {
          state.property = value
        }
      },
      actions: {
        rootAction ({ commit }: any, value: any) {
          return new Promise(resolve => {
            commit('baz', value)
            resolve()
          })
        }
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

  it('passes local getters in getter function', () => {
    const localModule = {
      name: 'test',
      state: {},
      getters: {
        ten: () => 10,
        test: (state: any, getters: any) => getters.ten + 5
      }
    }

    registerLocalModule(store, ['test'], localModule)

    const name = localModule.name
    assert(store.getters['local/' + name + '/test'] === 15)
  })

  it('passes root getters in getter function', () => {
    const localModule = {
      name: 'test',
      state: {},
      getters: {
        root: (state: any, getters: any, rootState: any, rootGetters: any) => {
          return rootGetters.rootGetter
        }
      }
    }

    registerLocalModule(store, ['test'], localModule)

    const name = localModule.name
    assert(store.getters['local/' + name + '/root'] === 'root')
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

  it('should commit to the global store when root option enabled.', done => {
    const localModule = {
      name: 'test',
      state: {
        count: 0
      },
      actions: {
        foo ({ commit, rootGetters }: any) {
          commit('baz', 'qux', { root: true })
          assert(rootGetters.propertyGetter === 'qux')
          done()
        }
      }
    }

    registerLocalModule(store, ['test'], localModule)

    store.dispatch('local/' + localModule.name + '/foo')
  })

  it('should dispatch to the global store when root option enabled.', done => {
    const localModule = {
      name: 'test',
      state: {
        count: 0
      },
      actions: {
        foo ({ dispatch, rootGetters }: any) {
          dispatch('rootAction', 'bar', { root: true }).then(() => {
            assert(rootGetters.propertyGetter === 'bar')
            done()
          })
        }
      }
    }

    registerLocalModule(store, ['test'], localModule)

    store.dispatch('local/' + localModule.name + '/foo')
  })
})
