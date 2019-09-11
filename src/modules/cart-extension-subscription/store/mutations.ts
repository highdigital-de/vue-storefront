import { MutationTree } from 'vuex'
import * as types from './mutation-types'

export const mutations: MutationTree<any> = {
  [types.SET_SUBSCRIPTION_FLAG] (state, payload: boolean) {
    state.isSubscriptionFlag = payload
  }
}