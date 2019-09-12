<template>
  <div>
    <h2>Subscription loaded:</h2>
    <div class="subscription" v-if="subscription">{{ subscription }}</div>
  </div>
</template>

<script>
export default {
  name: 'Overview',
  computed: {
    subscription () {
      return this.$store.state.subscription.subscription
    }
  },
  methods: {
  }
}
</script>
