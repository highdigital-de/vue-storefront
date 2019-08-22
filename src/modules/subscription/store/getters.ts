import { GetterTree } from 'vuex'
import sumBy from 'lodash-es/sumBy'
import i18n from '@vue-storefront/i18n'
import CartState from '../types/SubscriptionState'
import RootState from '@vue-storefront/core/types/RootState'
import { onlineHelper } from '@vue-storefront/core/helpers'

const getters: GetterTree<CartState, RootState> = {
}

export default getters