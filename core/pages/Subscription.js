import { prepareQuery } from '@vue-storefront/core/modules/catalog/queries/common'

import i18n from '@vue-storefront/i18n'
import Composite from '@vue-storefront/core/mixins/composite'
import { Logger } from '@vue-storefront/core/lib/logger'

export default {
  name: 'Subscription',
  mixins: [Composite],
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
    clickGetSubscription () {
      console.log('click get sub')
      return this.$store.dispatch('subscription/getSubscription')
    }
  },
  metaInfo () {
    return {
      title: this.$route.meta.title || i18n.t('Subscription'),
      meta: this.$route.meta.description ? [{ vmid: 'description', description: this.$route.meta.description }] : []
    }
  }
}
