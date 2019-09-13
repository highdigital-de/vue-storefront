<template>
  <div>
    <h2>{{ $t('Change Delivery') }}</h2>
    <div class="placeholder">
      Aktuelle Lieferadresse:<br>
      Max Mustermann<br>
      Musterstrasse 1<br>
      12345 Musterstadt<br>
      <br>
      <router-link to="/subscription/my-address">ändern</router-link><br>
      <br>
      aktueller Lieferzyklus: alle 4 Wochen<br>
      <br>
      <router-link to="/subscription/my-delivery-cycle">ändern</router-link><br>
      <br>
      Nächste Lieferung: 12.09.19
    </div>
    <router-link to="my-delivery" class="button">{{ $t('Defer Delivery') }}</router-link>
    <router-link to="my-delivery" class="button">{{ $t('Deliver now') }}</router-link>
    <router-link to="my-subscription" class="button">{{ $t('Back to my Subscription') }}</router-link>
  </div>
</template>

<script>

export default {
  name: 'MyDelivery',
  computed: {
    deliveryCycles () {
      return this.$store.state.subscription.deliveryCycles
    }
  },
  methods: {
  }
}
</script>
