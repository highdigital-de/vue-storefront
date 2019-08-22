import Vue from 'vue'
import { MutationTree } from 'vuex'
import rootStore from '@vue-storefront/core/store'
import * as types from './mutation-types'
import CartState from '../types/SubscriptionState'

const mutations: MutationTree<CartState> = {
  /**
   * Add product to cart
   * @param {Object} product data format for products is described in /doc/ElasticSearch data formats.md
   */
  [types.SUBSCRIPTION_ADD](state, { subscription }) {
    Vue.prototype.$bus.$emit('subscription-before-add', { subscription: subscription })
    state.subscription = subscription
  },
  [types.SUBSCRIPTION_PRODUCTS_ADD](state, { products }) {
    console.log('commit add products', products)
    Vue.prototype.$bus.$emit('subscription-befores-product-add', { products: products })
    state.products = products
  },
}

export default mutations
