<template>
  <div>
    <h2>{{ $t('Change Delivery') }}</h2>
    <div class="placeholder">
      Aktuelle Lieferadresse:<br>
      Max Mustermann<br>
      Musterstrasse 1<br>
      12345 Musterstadt<br>
      <br>
      <a>ändern</a><br>
      <br>
      aktueller Lieferzyklus: alle 4 Wochen<br>
      <a>ändern</a><br>
      <br>
      Nächste Lieferung: 12.09.19
    </div>
    <a class="button">{{ $t('Defer Delivery') }}</a>
    <a class="button">{{ $t('Deliver now') }}</a>
    <a class="button" @click="$router.go(-1)">{{ $t('Back') }}</a>
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
