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
let uid = 0

export default {
  local () {
    uid += 1

    return {
      name: 'counter' + uid,
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
