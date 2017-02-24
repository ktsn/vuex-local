# vuex-local

[![npm version](https://badge.fury.io/js/vuex-local.svg)](https://badge.fury.io/js/vuex-local)
[![Build Status](https://travis-ci.org/ktsn/vuex-local.svg?branch=master)](https://travis-ci.org/ktsn/vuex-local)

Local state management within Vuex

## Why?

Global state management is one of the problems on huge application development. Developers address the problem by using *Flux* pattern and *Single Source of Truth* store like [Redux](https://github.com/reactjs/redux) and [Vuex](https://github.com/vuejs/vuex). They simplify and make trackable application data flow.

However, we sometimes have to manage component local state. Because it is too complicated to manage component specific state on a global store. For addressing local state, we cannot embrace the global store advantage - trackable data flow and time-travel debugging.

vuex-local achieves simple and trackable local state management. We can define a local Vuex module in each component and it will be registered on a Vuex store. This let us use features of [dev tools](https://github.com/vuejs/vue-devtools) such as time-travel debugging for local state. In addition we can use a local module on a component in natural way.

## Example

First, you have to install vuex-local for Vue.js. vuex-local can receive `parentModulePath` option to specify where to register all local modules.

```js
// store.js
import Vue from 'vue'
import Vuex from 'vuex'
import * as VuexLocal from 'vuex-local'

Vue.use(Vuex)
Vue.use(VuexLocal, {
  // local modules will be registered under `locals` module
  parentModulePath: ['locals']
})

// generate `locals` module automatically
export default new Vuex.Store({})
```

Then, you can define a local module on each component. The component option will have `local` property that is a function returning a local module object.

The local module object is same as normal Vuex module except to have `name` option. The `name` option specify the local module path and the prefix for getters, actions and mutations.

In local module getters and actions, `getters`, `dispatch` and `commit` is namespaced implicitly. In other words, we do not have to care about effects for other global modules. If you want to use root level getters, you can use them from 4th argument of each getter function or `rootGetters` property of the action context.

To dispatch actions or commit mutations in the global namespace, pass `{ root: true }` as the 3rd argument to `dispatch` and `commit`.

```html
<script>
// Counter.vue
let uid = 0

export default {
  local () {
    uid += 1

    return {
      name: 'counter' + uid,
      state: {
        count: 10
      },
      getters: {
        half: state => state.count / 2
      },
      actions: {
        asyncIncrement ({ commit }) {
          setTimeout(() => {
            commit('increment') // this commit can only affect local mutation
          }, 1000)
        }
      },
      mutations: {
        increment (state) {
          state.count += 1
        }
      }
    }
  }
}
</script>
```

The local modules' state, getters, actions and mutations are bound to component instance automatically. You can use them in the template or other component methods easily.

```js
import store from './store.js'
import Counter from './Counter.vue'

const vm = new Vue({
  store,
  ...Counter
})

vm.count // 10
vm.half // 5
vm.asyncIncrement() // increment after 1000ms
vm.increment() // increment immediately
```

## Testing with vuex-local

Testing vuex-local module can be as easy as ordinary vuex module. Just getting the module by Component.local().

```js
// Use `call` method to inject a mock component
const module = App.local.call({ name: 'counterApp' })
const { state, getters, actions, mutations } = module
```

A full example here:

```js
import App from '../App.vue'

describe('App Local Module', () => {
  // Use `call` method to inject a mock component
  const module = App.local.call({ name: 'counterApp' })
  const { state, getters, actions, mutations } = module

  it('counter to be 0 initially', () => {
    expect(state.count).to.be.equal(0)

    const anotherModule = App.local.call({ name: 'counterApp' })
    expect(anotherModule.state.count).to.be.equal(0)
  })

  it('return half', () => {
    expect(getters.half({ count: 0 })).to.be.equal(0)
    expect(getters.half({ count: -1 })).to.be.equal(-0.5)
    expect(getters.half({ count: 1 })).to.be.equal(0.5)
  })

  it('increment the counter in state', () => {
    const state = { count: 0 }

    mutations.increment(state)
    expect(state.count).to.be.equal(1)

    mutations.increment(state)
    expect(state.count).to.be.equal(2)
  })

  it('increment after 1 second', done => {
    this.timeout(1100)
    const begin = Date.now()

    const commit = mutationName => {
      expect(mutationName).to.be.equal('increment')
      expect(Date.now() - begin).to.be.above(900)
      expect(Date.now() - begin).to.be.below(1100)
      done()
    }

    actions.asyncIncrement({ commit })
  })
})
```

## License

MIT
