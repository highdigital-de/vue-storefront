<template>
  <div>
    <h2>{{ $t('Change Delivery Cycle') }}</h2>
    <div>
      Aktueller Lieferzyklus: alle 6 Wochen<br>
    </div>
    <select>
      <option v-for="(dv) in deliveryCycles" :key="dv.id">
        {{ dv.name }}
      </option>
    </select>
    <p>Wenn Sie den Lieferzyklus sofort ändern, wird eine Bestellung ausgelöst.</p>
    <router-link to="my-delivery" class="button">{{ $t('Safe and deliver now') }}</router-link>
    <p>Der Lieferzyklus wird nach der nächsten Bestellung <b>19.9.19</b> automatisch angepasst.</p>
    <router-link to="my-delivery" class="button">{{ $t('Save') }}</router-link>
    <p>Wenn Abo-Bestellung ausgelöst, dann gibt es 3 Varianten...</p>
    <a class="button" @click="$router.go(-1)">{{ $t('Back') }}</a>
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
