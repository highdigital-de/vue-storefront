import { CartExtensionSubscriptionState } from '../types/CartExtensionSubscriptionState'
import { ActionTree } from 'vuex';
import * as types from './mutation-types'

// it's a good practice for all actions to return Promises with effect of their execution
export const actions: ActionTree<CartExtensionSubscriptionState, any> = {
  setSubscriptionFlag ({ state }) {
    console.log('set subscription flag:')
  }
}