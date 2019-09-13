<template>
  <div>
    <h2>{{ $t('Payment Method') }}</h2>
    <div class="placeholder">
      Payment Method
    </div>
    <router-link to="my-subscription" class="button">{{ $t('Save') }}</router-link>
  </div>
</template>

<script>

export default {
  name: 'MyPaymentMethod',
  computed: {
  },
  methods: {
  }
}
</script>
