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
      shippingDetails: 'checkout/getShippingDetails'}),
    ...mapGetters('category', ['getCategories']),
    rootCategories () {
      return this.getCategories
    }
  },
  watch: {
    personalDetails () {
      console.log('1')
      this.onAllDetails()
    },
    paymentDetails () {
      console.log('2')
      this.onAllDetails()
    },
    shippingDetails () {
      console.log('3')
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
        console.log('onAllDetails a ' + this.a)
        if (this.a === '1') {
          console.log('Path a=1 push')

          this.$router.push(this.localizedRoute('/checkout/?h=' + this.h + '&a=' + this.a))
        } else if (this.a === '2') {
          this.$router.push(this.localizedRoute('/checkout/?h=' + this.h + '&a=' + this.a))
          this.a = ''
          alert('Something went Wrong! \nPlease repeat the payment process')
        } else if (this.a === '3') {
          this.$router.push(this.localizedRoute('/checkout/?h=' + this.h + '&a=' + this.a))
          this.$store.commit('ui/setMicrocart', false)
          this.a = ''
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
    console.log('h:', this.h, 'c:', this.a)
    this.onAllDetails()
  }
}
