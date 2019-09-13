<template>
  <div>
    <h1>Schoko Abo</h1>
    <p>Jederzeit anpassbar</p>
    <p>Jederzeit kündbar</p>
    <p>...weitere Vorteilsangebote</p>
    <router-link to="/subscription/products" class="button">{{ $t("Order Cacao Subscription") }}</router-link>
    <router-link to="/subscription/my-subscription" class="button">{{ $t("My Cacao Subscription") }}</router-link>
    <div class="placeholder">
      Paket 1
    </div>
    <div class="placeholder">
      Paket 2
    </div>
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
