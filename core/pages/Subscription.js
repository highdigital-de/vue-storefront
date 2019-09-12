import { prepareQuery } from '@vue-storefront/core/modules/catalog/queries/common'

import i18n from '@vue-storefront/i18n'
import Composite from '@vue-storefront/core/mixins/composite'
import { Logger } from '@vue-storefront/core/lib/logger'

export default {
  name: 'Subscription',
  mixins: [Composite],
  props: {
    activeBlock: {
      type: String,
      default: 'SubscriptionOverview'
    }
  },
  async asyncData ({ store, routlo, context }) { // this is for SSR purposes to prefetch data
    Logger.log('Entering asyncData for Subscription ' + new Date())()
    if (context) context.output.cacheTags.add(`subscription`)
    let ourBestsellersQuery = prepareQuery({ queryConfig: 'bestSellers' })
    const response = await store.dispatch('product/list', {
      query: ourBestsellersQuery,
      size: 8,
      sort: 'created_at:desc'
    })
    if (response) {
      store.state.homepage.bestsellers = response.items
    }
    store.state.homepage.apiCalls = [
      'getOverview',
      'changeDelivery',
      'cancelSubscription'
    ]
  },
  computed: {
    subscription () {
      return this.$store.state.subscription.subscription
    },
    hasSubscription () {
      console.log('state.subscription', this.$store.state.subscription)
      return !!this.$store.state.subscription.subscription
    }
  },
  methods: {
    clickPostGetSubscription () {
      console.log('click post get sub')
      return this.$store.dispatch('subscription/postGetSubscription')
    },
    clickGetMeta () {
      console.log('click get meta')
      return this.$store.dispatch('subscription/getMeta')
    },
    clickPostCartDelivery () {
      let body = {
        delivery_cycle: {
          id: 2
        }
      }
      console.log('click post cart delivery, body:', body)
      return this.$store.dispatch('subscription/postCartDelivery', body)
    },
    clickPostPaymentmethodUpdate () {
      let body = {
        paymentmethod: {
          id: 2
        }
      }
      console.log('click post cart delivery, body:', body)
      return this.$store.dispatch('subscription/postPaymentmethodUpdate', body)
    },
    clickPostDelete () {
      let body = {
        subscription: {
          id: 2
        }
      }
      console.log('click post cart delivery, body:', body)
      return this.$store.dispatch('subscription/postDelete', body)
    },
    clickPostDelivery () {
      let body = {
        delivery: {
          id: 2
        }
      }
      console.log('click post cart delivery, body:', body)
      return this.$store.dispatch('subscription/postDelivery', body)
    },
    clickPostUpdate () {
      let body = {
        delivery_cycle: {
          id: 2
        },
        products: [
          'sku123',
          'sku789'
        ]
      }
      console.log('click post cart delivery, body:', body)
      return this.$store.dispatch('subscription/postUpdate', body)
    },
    clickSetSubscriptionFlag () {
      console.log('clicked clickSetSubscriptionFlag, current value: ', this.$store.state.cart.isSubscriptionFlag)
      this.$store.commit('cart/cartExtensionSubscription/SET_SUBSCRIPTION_FLAG', !this.$store.state.cart.isSubscriptionFlag)
    }
  },
  metaInfo () {
    return {
      title: this.$route.meta.title || i18n.t('Subscription'),
      meta: this.$route.meta.description ? [{ vmid: 'description', description: this.$route.meta.description }] : []
    }
  }
}
