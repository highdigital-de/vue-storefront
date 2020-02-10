import { Logger } from '@vue-storefront/core/lib/logger';
import CreditCardComponent from '../pages/CreditCard.vue';
import PayPalComponent from '../pages/PayPal.vue';
import SepaComponent from '../pages/Sepa.vue';
import SofortComponent from '../pages/Sofort.vue';

import rootStore from '@vue-storefront/core/store';

// This function will be fired both on server and client side context after registering other parts of the module
export function afterRegistration ({ Vue, config, store, isServer }) {
  if (isServer) Logger.info('Payment-Payone: Module Registert');

  // Place the order. Payload is empty as we don't have any specific info to add for this payment method '{}'
  let correctPaymentMethod = false;
  const placeOrder = () => {
    if (correctPaymentMethod) {
      Vue.prototype.$bus.$emit('checkout-do-placeOrder', {});
    }
  };
  // Update the methods
  const paymentMethodConfig1 = {
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
  const paymentMethodConfigCC = {
    title: 'PayOne - CreditCard',
    code: config.paymentMethods.cc.code,
    cost: 0,
    costInclTax: 0, // where do i get the costs from?
    default: true,
    offline: true,
    is_server_method: false
  };
  const paymentMethodConfigSepa = {
    title: 'PayOne - Sepa-Lastschrift',
    code: config.paymentMethods.sepa.code,
    cost: 0,
    costInclTax: 0, // where do i get the costs from?
    default: true,
    offline: true,
    is_server_method: false
  };
  const paymentMethodConfigPayPal = {
    title: 'PayOne - PayPal',
    code: config.paymentMethods.paypal.code,
    cost: 0,
    costInclTax: 0, // where do i get the costs from?
    default: true,
    offline: true,
    is_server_method: false
  };
  const paymentMethodConfigSofort = {
    title: 'PayOne - Sofort',
    code: config.paymentMethods.sofort.code,
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
    const Payone1 = document.createElement('script');
    Payone1.setAttribute(
      'src',
      'https://secure.pay1.de/client-api/js/v1/payone_hosted_min.js'
    );
    document.head.appendChild(Payone1);
    // Mount the info component when required.
    Vue.prototype.$bus.$on(
      'checkout-payment-method-changed',
      paymentMethodCode => {
        const methods = store.state['payment-backend-methods'].methods;
        if (methods) {
          const method = methods.find(item => item.code === paymentMethodCode);
          if (
            // paymentMethodCode === "payone_creditcard" &&
            (typeof method !== 'undefined' && !method.is_server_method) ||
            typeof method ===
            'undefined' /* otherwise it could be a `payment-backend-methods` module */
          ) {
            let Component;
            let componentInstance;
            // Dynamically inject a component into the order review section (optional)
            switch (paymentMethodCode) {
              case 'payone_creditcard':
                correctPaymentMethod = true;
                Component = Vue.extend(CreditCardComponent);
                break;
              case 'payone_debit_payment':
                correctPaymentMethod = true;
                Component = Vue.extend(SepaComponent);
                break;
              case 'payone_wallet_paypal_express':
                correctPaymentMethod = true;
                Component = Vue.extend(PayPalComponent);
                break;
              case 'payone_online_bank_transfer_sofortueberweisung':
                correctPaymentMethod = true;
                Component = Vue.extend(SofortComponent);
                break;
            }
            if (correctPaymentMethod === true) {
              componentInstance = new Component();
              // componentInstance.add(Vue);
              const id = '#' + paymentMethodCode;
              console.log('afterRegistration: ' + id);
              // console.log(componentInstance);
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
