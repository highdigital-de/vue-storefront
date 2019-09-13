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
    <router-link to="my-delivery" class="button">{{ $t('Save') }}</router-link>
  </div>
</template>

<script>

export default {
  name: 'MyAddress',
  computed: {
  },
  methods: {
  }
}
</script>
