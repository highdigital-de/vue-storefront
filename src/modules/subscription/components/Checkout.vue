<template>
  <div>
    <h2>{{ $t('Checkout') }}</h2>
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
    <router-link to="confirmation" class="button">{{ $t('Buy now') }}</router-link>
  </div>
</template>

<script>

export default {
  name: 'Checkout',
  computed: {
    deliveryCycles () {
      return this.$store.state.subscription.deliveryCycles
    }
  },
  methods: {
  }
}
</script>
