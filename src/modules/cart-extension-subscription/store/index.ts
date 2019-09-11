import { Module } from 'vuex'
import { CartExtensionSubscriptionState } from '../types/CartExtensionSubscriptionState'
import { mutations } from './mutations'
import { getters } from './getters'
import { actions } from './actions'
import { state } from './state'

export const module: Module<CartExtensionSubscriptionState, any> = {
  namespaced: true,
  mutations,
  actions,
  getters,
  state
}