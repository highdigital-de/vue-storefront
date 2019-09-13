<template>
  <div>
    <h2>{{ $t('My Cacao Subscription') }}</h2>
    <div class="placeholder">
      Cart
    </div>
    <router-link to="/subscription" class="button">{{ $t('add another cacao') }}</router-link>
    <div class="placeholder">
      Abo Vorteilsrabatt <br>
      Gesamtsumme inkl. USt. <br>
      <br>
      Nächste Lieferung: 04.10.19<br>
    </div>
    <div class="placeholder">
      Cart
    </div>
    <router-link to="/subscription" class="button">{{ $t('Change Payment Method') }}</router-link>
    <router-link to="/subscription" class="button">{{ $t('Change Delivery Cycle') }}</router-link>
    <div>
      Das Abo lässt sich jederzeit <router-link to="/subscription">kündigen</router-link>.
    </div>
  </div>
</template>

<script>

export default {
  name: 'MySubscription',
  computed: {
  },
  methods: {
  }
}
</script>
