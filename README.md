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

export default new Vuex.Store({
  modules: {
    // make sure to define the module that is
    // specified by `parentModulePath` option
    locals: {}
  }
})
```

Then, you can define a local module on each component. The component option will have `local` property that is a function returning a local module object.

The local module object is same as normal Vuex module except to have `name` option. The `name` option specify the local module path and the prefix for getters, actions and mutations.

In local module getters and actions, `getters`, `dispatch` and `commit` is namespaced implicitly. In other words, we do not have to care about effects for other global modules. If you want to use root level getters, you can use them from 4th argument of each getter function or `rootGetters` property of the action context.

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

## License

MIT
