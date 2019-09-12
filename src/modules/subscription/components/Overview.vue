<template>
  <div>
    <h2>Subscription loaded:</h2>
    <div class="subscription" v-if="subscription">{{ subscription }}</div>
    <router-link to="/subscription/products">{{ $t("Order Cacao Subscription") }}</router-link>
    <router-link to="/subscription/products">{{ $t("My Subscription") }}</router-link>
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
