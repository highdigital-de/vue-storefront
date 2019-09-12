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
            <button @click="clickGetMeta">Get Meta</button>
          </div>
          <div class="row center-xs">
            <button @click="clickPostCartDelivery">Post Cart Delivery</button>
          </div>
          <div class="row center-xs">
            <button @click="clickPostPaymentmethodUpdate">Post Paymentmethod Update</button>
          </div>
          <div class="row center-xs">
            <button @click="clickPostGetSubscription">Post Get Subscription</button>
          </div>
          <div class="row center-xs">
            <button @click="clickPostDelete">Post Delete</button>
          </div>
          <div class="row center-xs">
            <button @click="clickPostDelivery">Post  Delivery</button>
          </div>
          <div class="row center-xs">
            <button @click="clickPostUpdate">Post Update</button>
          </div>
          <div class="row center-xs">
            <button @click="clickSetSubscriptionFlag">Set Subscription Flag</button>
          </div>
        </section>
        <section>
          <no-ssr>
            <component :is="this.$props.activeBlock" />
          </no-ssr>
        </section>
      </div>
    </section>
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr'
import Subscription from '../../../../core/pages/Subscription'
import Overview from '../../../modules/subscription/components/Overview'
import Products from '../../../modules/subscription/components/Products'

export default {
  name: 'Subscription',
  computed: {
    apiCalls () {
      return this.$store.state.homepage.apiCalls
    }
  },
  components: {
    'no-ssr': NoSSR,
    Overview,
    Products
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
