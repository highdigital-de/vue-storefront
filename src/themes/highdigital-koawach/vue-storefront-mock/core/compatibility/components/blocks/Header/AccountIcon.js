import { AccountButton } from '@vue-storefront/core/modules/user/components/AccountButton'
import { action } from '@storybook/addon-actions'

export default {
  name: 'AccountIcon',
  data () {
    return {
      navigation: []
    }
  },
  computed: {
    currentUser () {
      // renamed to 'user'
      return this.user
    }
  },
  methods: {
    notify (title) {
      console.log('notify', title)
    },
    goToAccount () {
      this.$emit('goToAccount')
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
