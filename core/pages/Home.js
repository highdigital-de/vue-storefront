import { mapGetters } from 'vuex'

import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import i18n from '@vue-storefront/i18n'

import Composite from '@vue-storefront/core/mixins/composite'
import { Logger } from '@vue-storefront/core/lib/logger'

export default {
  name: 'Home',
  mixins: [Composite],
  data () {
    return {
      a: '',
      h: ''
    }
  },
  computed: {
    ...mapGetters({
      personalDetails: 'checkout/getPersonalDetails',
      paymentDetails: 'checkout/getPaymentDetails',
      shippingDetails: 'checkout/getShippingDetails',
      currentCartHash: 'cart/getCurrentCartHash'}),
    ...mapGetters('category', ['getCategories']),
    rootCategories () {
      return this.getCategories
    }
  },
  watch: {
    personalDetails () {
      this.onAllDetails()
    },
    paymentDetails () {
      this.onAllDetails()
    },
    shippingDetails () {
      this.onAllDetails()
    },
    currentCartHash () {
      this.onAllDetails()
    }

  },
  methods: {
    onAllDetails () {
      if (
        this.paymentDetails.emailAddress !== '' &&
        this.shippingDetails.city !== '' &&
        this.personalDetails.city !== '' &&
        this.a !== ''
      ) {
        if (this.h === this.currentCartHash) {
          if (this.a === '1') {
            this.$router.push(this.localizedRoute('/checkout/?h=' + this.h + '&a=' + this.a))
          } else if (this.a === '2') {
            this.$router.push(this.localizedRoute('/checkout/?h=' + this.h + '&a=' + this.a))
            alert('Something went Wrong! \nPlease repeat the payment process')
          } else if (this.a === '3') {
            this.$router.push(this.localizedRoute('/checkout/?h=' + this.h + '&a=' + this.a))
            this.$store.commit('ui/setMicrocart', false)
          }
        } else {
          alert('carthash is not matching, try again.\n' + this.h + ' !== ' + this.currentCartHash)
        }
      }
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
    this.a = url.searchParams.get('a')
    this.h = url.searchParams.get('h')
    this.onAllDetails()
  }
}
