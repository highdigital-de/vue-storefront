import Vue from 'vue'
import { ActionTree } from 'vuex'
import config from 'config'
import * as types from './mutation-types'
import rootStore from '@vue-storefront/core/store'
import RootState from '@vue-storefront/core/types/RootState'
import Subscription from '../types/SubscriptionState'
import { Logger } from '@vue-storefront/core/lib/logger'
import { TaskQueue } from '@vue-storefront/core/lib/sync'
import Task from '@vue-storefront/core/lib/sync/types/Task'

const actions: ActionTree<Subscription, RootState> = {
  getSubscription (context) {
    console.log('action get subscription')
    return TaskQueue.execute({ url: config.subscription.overview_endpoint,
      payload: {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
      },
    }).then((task: Task) => {
      Logger.debug('got task ' + task)()
      context.commit(types.SUBSCRIPTION_ADD, {subscription: task.result})
      return task
    })
  },
  getMeta (context) {
    console.log('action API1 get meta')
    return TaskQueue.execute({ url: config.subscription.meta_endpoint,
      payload: {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
      },
    }).then((task: Task) => {
      Logger.debug('got task meta' + task)()
      context.commit(types.SUBSCRIPTION_PRODUCTS_ADD, {products: task.result.products})
      context.commit(types.SUBSCRIPTION_COUPONS_ADD, {coupons: task.result.coupons})
      context.commit(types.SUBSCRIPTION_DELIVERY_CYCLES_ADD, {deliveryCycles: task.result.delivery_cycles})
      return task
    })
  },
  postCartDelivery (context, body) {
    console.log('action API1 post cart delivery')
    return TaskQueue.execute({ url: config.subscription.cart_delivery_endpoint,
      payload: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify(body)
      },
    }).then((task: Task) => {
      Logger.debug('got task cart delivery' + task)()
      // TODO: Do something with new delivery cycle
      return task
    })
  },
}

export default actions
