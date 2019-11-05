<template>
  <IconButton
    icon="hamburger"
    @click="openSidebarMenu"
    :aria-label="$t('Open menu')"
    data-testid="menuButton"
    :dark="dark"
  />
</template>

<script>
import HamburgerIcon from '@vue-storefront/core/compatibility/components/blocks/Header/HamburgerIcon'
import IconButton from 'hui/src/components/molecules/IconButton'

export default {
  mixins: [HamburgerIcon],
  components: {
    IconButton
  },
  props: {
    dark: {
      type: Boolean,
      default: false
    }
  }
}
</script>
