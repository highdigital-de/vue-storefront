import { AccountButton } from '@vue-storefront/core/modules/user/components/AccountButton'

export default {
  name: 'AccountIcon',
  data () {
    return {
      showMenu: false,
      navigation: [
        { title: this.$t('My profile'), link: '/my-account' },
        { title: this.$t('My shipping details'), link: '/my-account/shipping-details' },
        { title: this.$t('My newsletter'), link: '/my-account/newsletter' },
        { title: this.$t('My orders'), link: '/my-account/orders' },
        { title: this.$t('My loyalty card'), link: '#' },
        { title: this.$t('My product reviews'), link: '#' },
        { title: this.$t('My Recently viewed products'), link: '/my-account/recently-viewed' }
      ],
      currentUser: false,
      isLoggedIn: false,
      user: {}
    }
  },
  methods: {
    notify (title) {
      console.log('notify', title)
    },
    goToAccount () {
      console.log('goToAccount')
    },
    logout () {
      console.log('logout')
    },
    localizedRoute (route) {
      return route
    }
  },
  mixins: [AccountButton]
}
