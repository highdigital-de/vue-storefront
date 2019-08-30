import { Module } from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import SubscriptionState from '../types/SubscriptionState'

export const module: Module<SubscriptionState, any> = {
  namespaced: true,
  state: {
    subscription: null,
    products: [],
    coupons: []
  },
  getters,
  actions,
  mutations,
}

