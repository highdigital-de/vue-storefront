<template>
  <div id="page_not_found">
    <section class="bg-cl-secondary py35 px20">
      <div class="container">
        <h2>{{ $t("Subscription") }}</h2>
      </div>
    </section>
    <section class="bg-cl-primary py35 px20">
      <div class="container">
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
import MySubscription from '../../../modules/subscription/components/MySubscription'
import DeliveryCycle from '../../../modules/subscription/components/DeliveryCycle'
import MyDelivery from '../../../modules/subscription/components/MyDelivery'
import MyDeliveryCycle from '../../../modules/subscription/components/MyDeliveryCycle'
import Checkout from '../../../modules/subscription/components/Checkout'

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
    Products,
    MySubscription,
    DeliveryCycle,
    MyDelivery,
    MyDeliveryCycle,
    Checkout
  },
  methods: {
    toggleSearchpanel () {
      this.$store.commit('ui/setSearchpanel', true)
    }
  },
  mixins: [Subscription]
}
</script>

<style>
a {
  text-decoration: underline;
}
.button {
  padding: 10px 30px;
  background-color: #ccc;
  display: block;
  margin: 20px;
}
.button:hover {
  background-color: #bbb
}
.placeholder {
  padding: 100px;
  background-color: #eee;
}
</style>
