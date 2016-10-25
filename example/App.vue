<template>
  <div>
    <p>
      count:
      <output>{{ count }}</output>
    </p>
    <p>
      half:
      <output>{{ half }}</output>
    </p>
    <button type="button" @click="increment">Increment</button>
    <button type="button" @click="asyncIncrement">Async Increment</button>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  },

  local () {
    return {
      name: this.name,
      state: {
        count: 0
      },
      getters: {
        half: state => state.count / 2
      },
      actions: {
        asyncIncrement ({ commit }) {
          setTimeout(() => {
            commit('increment')
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
