<template>
  <div>
    <h2>{{ $t('Invoice address') }}</h2>
    <div class="placeholder">
      Address Form
    </div>
    <div class="placeholder">
      Zahlungsart
    </div>
    <div class="placeholder">
      Bestellübersicht
    </div>
    <select>
      <option v-for="(dv) in deliveryCycles" :key="dv.id">
        {{ dv.name }}
      </option>
    </select>
    <a class="button">{{ $t('Buy now') }}</a>
  </div>
</template>

<script>

export default {
  name: 'MyDeliveryCycle',
  computed: {
    deliveryCycles () {
      return this.$store.state.subscription.deliveryCycles
    }
  },
  methods: {
  }
}
</script>
