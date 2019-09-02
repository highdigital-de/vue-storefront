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
  getProducts (context) {
    console.log('action API1 get products')
    return TaskQueue.execute({ url: config.subscription.products_endpoint,
      payload: {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
      },
    }).then((task: Task) => {
      Logger.debug('got task products' + task)()
      context.commit(types.SUBSCRIPTION_PRODUCTS_ADD, {products: task.result})
      return task
    })
  },
  getCoupons (context) {
    console.log('action API2 get coupons')
    return TaskQueue.execute({ url: config.subscription.coupons_endpoint,
      payload: {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
      },
    }).then((task: Task) => {
      Logger.debug('got task coupon' + task)()
      context.commit(types.SUBSCRIPTION_COUPONS_ADD, {coupons: task.result.coupons})
      return task
    })
  },
  getDelivery (context) {
    console.log('action API2 get delivery')
    return TaskQueue.execute({ url: config.subscription.delivery_endpoint,
      payload: {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
      },
    }).then((task: Task) => {
      Logger.debug('got task coupon' + task)()
      context.commit(types.SUBSCRIPTION_DELIVERY_CYCLES_ADD, {delivery: task.result.delivery_cycles})
      return task
    })
  }
}

export default actions
