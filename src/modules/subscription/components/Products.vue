<template>
  <div>
    <h2>Products</h2>
    <a id="products" />
    <product-listing :products="products" columns="2" />
    <div class="placeholder">
      pur bio. purer genuss.<br>
      schmeckt super<br>
      enthält koffein<br>
      lowcarb<br>
      Plus Minus
    </div>
    <a class="button">{{ $t('Add to subscription') }}</a>
    <div class="placeholder">
      Deine Auswahl<br>
      Kakao 1<br>
      Kakao 2<br>
    </div>
    <a class="button" href="#products">{{ $t('+ Add another cacao') }}</a>
    <div class="placeholder">
      Abo Vorteilsrabatt: <br>
      Gesamtsumme inkl. USt.<br>
      Nur noch 10,04€ und wir schenken dir einen Rabatt.
    </div>
    <router-link to="/subscription/delivery-cycle" class="button">{{ $t('Save') }} / {{ $t('Choose Delivery Cycle') }}</router-link>
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
