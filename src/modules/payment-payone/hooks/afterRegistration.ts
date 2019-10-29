import { Logger } from '@vue-storefront/core/lib/logger';
import CreditCardComponent from '../pages/CreditCard.vue';
import PayPalComponent from '../pages/PayPal.vue';
import SepaComponent from '../pages/Sepa.vue';
import SofortComponent from '../pages/Sofort.vue';

import rootStore from '@vue-storefront/core/store';

// This function will be fired both on server and client side context after registering other parts of the module
export function afterRegistration({ Vue, config, store, isServer }) {
  if (isServer) Logger.info('Payment-Payone: Module Registert');

  // Place the order. Payload is empty as we don't have any specific info to add for this payment method '{}'
  let correctPaymentMethod = false;
  const placeOrder = () => {
    if (correctPaymentMethod) {
      Vue.prototype.$bus.$emit('checkout-do-placeOrder', {});
    }
  };
  // Update the methods
  let paymentMethodConfig1 = {
    title: 'Cash on delivery',
    code: 'cashondelivery',
    cost: 0,
    costInclTax: 0,
    default: true,
    offline: true,
    is_server_method: false
  };

  // PaymentMethodConfig can be injected by the magento backend.
  // Just make sure to adjust the PaymentMethod Code and it can be set in the backend which payment-methods are available
  let paymentMethodConfigCC = {
    title: 'PayOne - CreditCard',
    code: 'payonecreditcard',
    cost: 0,
    costInclTax: 0, // where do i get the costs from?
    default: true,
    offline: true,
    is_server_method: false
  };
  let paymentMethodConfigSepa = {
    title: 'PayOne - Sepa-Lastschrift',
    code: 'payonesepa',
    cost: 0,
    costInclTax: 0, // where do i get the costs from?
    default: true,
    offline: true,
    is_server_method: false
  };
  let paymentMethodConfigPayPal = {
    title: 'PayOne - PayPal',
    code: 'payonepaypal',
    cost: 0,
    costInclTax: 0, // where do i get the costs from?
    default: true,
    offline: true,
    is_server_method: false
  };
  let paymentMethodConfigSofort = {
    title: 'PayOne - Sofort',
    code: 'payonesofort',
    cost: 0,
    costInclTax: 0, // where do i get the costs from?
    default: true,
    offline: true,
    is_server_method: false
  };

  rootStore.dispatch('payment/addMethod', paymentMethodConfigCC);
  rootStore.dispatch('payment/addMethod', paymentMethodConfigSepa);
  rootStore.dispatch('payment/addMethod', paymentMethodConfigPayPal);
  rootStore.dispatch('payment/addMethod', paymentMethodConfigSofort);

  if (!isServer) {
    Vue.prototype.$bus.$on('checkout-after-shipingDetails', placeOrder);
    let Payone1 = document.createElement('script');
    Payone1.setAttribute(
      'src',
      'https://secure.pay1.de/client-api/js/v1/payone_hosted_min.js'
    );
    document.head.appendChild(Payone1);
    // Mount the info component when required.
    Vue.prototype.$bus.$on(
      'checkout-payment-method-changed',
      paymentMethodCode => {
        let methods = store.state['payment-backend-methods'].methods;
        if (methods) {
          let method = methods.find(item => item.code === paymentMethodCode);
          if (
            // paymentMethodCode === "payonecreditcard" &&
            (typeof method !== 'undefined' && !method.is_server_method) ||
            typeof method ===
              'undefined' /* otherwise it could be a `payment-backend-methods` module */
          ) {
            let Component;
            let componentInstance;
            // Dynamically inject a component into the order review section (optional)
            switch (paymentMethodCode) {
              case 'payonecreditcard':
                correctPaymentMethod = true;
                Component = Vue.extend(CreditCardComponent);
                break;
              case 'payonesepa':
                correctPaymentMethod = true;
                Component = Vue.extend(SepaComponent);
                break;
              case 'payonepaypal':
                correctPaymentMethod = true;
                Component = Vue.extend(PayPalComponent);

                break;
              case 'payonesofort':
                correctPaymentMethod = true;
                Component = Vue.extend(SofortComponent);
                break;
            }
            if (correctPaymentMethod === true) {
              componentInstance = new Component();
              let id = '#' + paymentMethodCode;
              console.log('afterRegistration: ' + id);
              console.log(componentInstance);
              // mounts component by  paymentMethodCode in payment.vue  --> <div name="payone-test-container" :id="method.code"></div>
              componentInstance.$mount(id);
            }
          } else {
            correctPaymentMethod = false;
          }
        }
      }
    );
  }
}
