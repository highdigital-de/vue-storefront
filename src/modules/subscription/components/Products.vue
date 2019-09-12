<template>
  <div>
    <h2>Products</h2>
    <product-listing :products="products" />
  </div>
</template>

<script>
import ProductListing from '../../../themes/default/components/core/ProductListing'

export default {
  name: 'Products',
  components: {
    ProductListing
  },
  computed: {
    products () {
      return this.$store.state.product.list.items
    }
  },
  methods: {
  }
}
</script>
