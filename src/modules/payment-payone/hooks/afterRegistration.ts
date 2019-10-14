import { Logger } from "@vue-storefront/core/lib/logger";
import CreditCardComponent from "../components/CreditCard.vue";
import rootStore from "@vue-storefront/core/store";

// This function will be fired both on server and client side context after registering other parts of the module
export function afterRegistration({ Vue, config, store, isServer }) {
  if (isServer) Logger.info("Payment-Payone: Module Registert");

  // Place the order. Payload is empty as we don't have any specific info to add for this payment method '{}'
  let correctPaymentMethod = false;
  const placeOrder = () => {
    if (correctPaymentMethod) {
      Vue.prototype.$bus.$emit("checkout-do-placeOrder", {});
    }
  };
  // Update the methods
  let paymentMethodConfig1 = {
    title: "Cash on delivery",
    code: "cashondelivery",
    cost: 0,
    costInclTax: 0,
    default: true,
    offline: true,
    is_server_method: false
  };
  let paymentMethodConfig = {
    title: "PayOne - CreditCard",
    code: "payonecreditcard",
    cost: 0,
    costInclTax: 0, //where do i get the costs from?
    default: true,
    offline: true,
    is_server_method: false
  };

  rootStore.dispatch("payment/addMethod", paymentMethodConfig);
  if (!isServer) {
    Vue.prototype.$bus.$on("checkout-before-placeOrder", placeOrder);

    // Mount the info component when required.
    Vue.prototype.$bus.$on(
      "checkout-payment-method-changed",
      paymentMethodCode => {
        let methods = store.state["payment-backend-methods"].methods;
        if (methods) {
          let method = methods.find(item => item.code === paymentMethodCode);
          if (
            paymentMethodCode === "payonecreditcard" &&
            ((typeof method !== "undefined" && !method.is_server_method) ||
              typeof method ===
                "undefined") /* otherwise it could be a `payment-backend-methods` module */
          ) {
            correctPaymentMethod = true;

            // Dynamically inject a component into the order review section (optional)
            const Component = Vue.extend(CreditCardComponent);
            const componentInstance = new Component();
            componentInstance.$mount("#checkout-order-review-additional");
          } else {
            correctPaymentMethod = false;
          }
        }
      }
    );
  }
}
