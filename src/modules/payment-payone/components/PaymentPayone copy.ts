/* import { mapState, mapGetters } from 'vuex';
import RootState from '@vue-storefront/core/types/RootState';

export const PaymentPayone = {
  name: 'PaymentPayone',
  props: {
    isActive: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      paymentState: '',
      paymentMethodAdditional: {
        //cc-payment
        firstname: '',
        lastname: '',
        responseStatus: '',
        cardType: '',
        pseudocardpan: '',
        truncatedcardpan: '',
        cardexpiredate: ''
        //
      }
    };
  },
  computed: {
    ...mapState({
      paymentDetails: (state: RootState) => state.checkout.paymentDetails
    }),
    ...mapGetters({
      getPaymentDetails: 'checkout/getPaymentDetails'
    })
  },
  mounted() {
    console.log('PaymentPayone mounted');
    this.paymentState = this.getPaymentDetails();
    console.log(this.paymentState);
  },
  created() {
    console.log('PaymentPayone created');
  }
};
 */
