import { mapGetters } from 'vuex'

import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import i18n from '@vue-storefront/i18n'

import Composite from '@vue-storefront/core/mixins/composite'
import { Logger } from '@vue-storefront/core/lib/logger'

export default {
  name: 'Home',
  mixins: [Composite],
  computed: {
    ...mapGetters('category', ['getCategories']),
    rootCategories () {
      return this.getCategories
    }
  },
  async asyncData ({ store, route, context }) { // this is for SSR purposes to prefetch data
    if (context) context.output.cacheTags.add(`home`)
    Logger.info('Calling asyncData in Home Page (core)')()
    try {
      await EventBus.$emitFilter('home-after-load', { store: store, route: route })
    } catch (e) {
      Logger.error(e)()
      throw e
    }
  },
  beforeMount () {
    this.$store.dispatch('category/reset')
  },
  metaInfo () {
    return {
      title: this.$route.meta.title || i18n.t('Home Page'),
      meta: this.$route.meta.description ? [{ vmid: 'description', name: 'description', content: this.$route.meta.description }] : []
    }
  },
  mounted () {
    var url_string = window.location.href
    var url = new URL(url_string)
    var a = url.searchParams.get('a')
    console.log('THB:', a)
    console.log(JSON.stringify(this.$store.state.checkout))
    if (a === '1') { // Success
      alert('success')
      this.$bus.$emit('checkout-do-placeOrder', '')
      // PLACE ORDER ACTION
      this.$store.dispatch('checkout/setThankYouPage', true)
      this.$store.commit('ui/setMicrocart', false)
      this.$router.push(this.localizedRoute('/checkout'))
      this.$store.dispatch('cart/clear', { recreateAndSyncCart: true }, { root: true })
    } else if (a === '2') {
      // ERROR
      this.$store.commit('ui/setMicrocart', false)
      this.$router.push(this.localizedRoute('/checkout'))
      alert('Please redo the payment process')
    } else if (a === '3') {
      // back
      this.$store.commit('ui/setMicrocart', false)
      this.$router.push(this.localizedRoute('/checkout'))
      alert('back')
    }
  }
  // this.$store.dispatch('checkout/setThankYouPage', true)
  // this.$store.dispatch('cart/clear', { recreateAndSyncCart: true }, {root: true})
  // this.$router.push(this.localizedRoute('/checkout'))
  // this.$bus.$emit('checkout-before-edit', 'payment')
}
