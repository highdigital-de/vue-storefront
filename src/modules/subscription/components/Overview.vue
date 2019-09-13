<template>
  <div>
    <h1>Schoko Abo</h1>
    <p>Jederzeit anpassbar</p>
    <p>Jederzeit kündbar</p>
    <p>...weitere Vorteilsangebote</p>
    <router-link to="/subscription/products" class="button">{{ $t("Order Cacao Subscription") }}</router-link>
    <router-link to="/subscription/products" class="button">{{ $t("My Cacao Subscription") }}</router-link>
    <div class="paket">
      Paket 1
    </div>
    <div class="paket">
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

<style scoped>
.paket {
  padding: 100px;
  background-color: #eee;
}
.button {
  padding: 10px 30px;
  background-color: grey;
  display: block;
  margin: 20px;
}
</style>
