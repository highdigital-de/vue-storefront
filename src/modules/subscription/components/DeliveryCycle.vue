<template>
  <div>
    <h2>{{ $t('Choose your delivery cycle') }}</h2>
    <div class="placeholder">
      Wähle, wie oft du deine gewählte Menge Kakao erhalten willst:<br>
      Jeden Monat? Alle zwei Monate oder doch quartalsweise?
    </div>
    <select>
      <option v-for="(dv) in deliveryCycles" :key="dv.id">
        {{ dv.name }}
      </option>
    </select>
    <a class="button">{{ $t('Into Cart') }}</a>
    <a class="button" @click="$router.go(-1)">{{ $t('Back') }}</a>
  </div>
</template>

<script>

export default {
  name: 'DeliveryCycle',
  computed: {
    deliveryCycles () {
      return this.$store.state.subscription.deliveryCycles
    }
  },
  methods: {
  }
}
</script>
