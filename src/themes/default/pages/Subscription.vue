<template>
  <div id="page_not_found">
    <section class="bg-cl-secondary py35 px20">
      <div class="container">
        <h2>{{ $t("Subscription") }}</h2>
      </div>
    </section>
    <section class="bg-cl-primary py35 px20">
      <div class="container">
        <div class="lh16 h5 weight-400">
          <p>{{ $t("Subscription page.") }}</p>
        </div>
        <section class="container">
          <header class="col-md-12 pt40">
            <h3 class="align-center">{{ $t('See our api calls') }}</h3>
          </header>
          <div class="row center-xs">
            <div v-for="call in apiCalls" :key="call" class="col-md-3">{{ call }}</div>
          </div>
          <div class="row center-xs">
            <button @click="clickGetSubscription">Get Subscription</button>
          </div>
          <div class="row center-xs">
            <button @click="clickGetMeta">Get Meta</button>
          </div>
        </section>
        <section class="container" v-if="hasSubscription">
          <h2>Subscription loaded:</h2>
          <div class="subscription">
            {{ subscription }}
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script>
import Subscription from '../../../../core/pages/Subscription'

export default {
  name: 'Subscription',
  computed: {
    apiCalls () {
      return this.$store.state.homepage.apiCalls
    }
  },
  components: {
  },
  methods: {
    toggleSearchpanel () {
      this.$store.commit('ui/setSearchpanel', true)
    }
  },
  mixins: [Subscription]
}
</script>

<style scoped>
a {
  text-decoration: underline;
}
</style>
