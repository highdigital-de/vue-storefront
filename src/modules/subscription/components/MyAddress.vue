<template>
  <div>
    <h2>{{ $t('Invoice address') }}</h2>
    <div class="placeholder">
      Address Form
    </div>
    <h2>{{ $t('Delivery address') }}</h2>
    <div class="placeholder">
      Lieferungsadresse
    </div>
    <a class="button">{{ $t('Weiter') }}</a>
  </div>
</template>

<script>

export default {
  name: 'MyDeliveryCycle',
  computed: {
  },
  methods: {
  }
}
</script>
