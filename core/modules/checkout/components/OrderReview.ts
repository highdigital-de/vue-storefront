import { mapGetters } from 'vuex'
import i18n from '@vue-storefront/i18n'
import { Logger } from '@vue-storefront/core/lib/logger'
import config from 'config'

export const OrderReview={
  name: 'OrderReview',
  props: {
    isActive: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      isFilled: false,
      orderReview: {
        terms: false
      }
    }
  },
  computed: {
    ...mapGetters({
      isVirtualCart: 'cart/isVirtualCart'
    })
  },
  methods: {
    placeOrder() {
      let paymentDetails=this.$store.state.checkout.paymentDetails;
      console.log('THB: paymentMethod', paymentDetails.paymentMethod);
      switch (paymentDetails.paymentMethod) {
        case 'payonecreditcard':
          break;
        case 'payonesepa':
          this.handleSepa(paymentDetails);
          break;
        case 'payonepaypal':
          break;
        case 'payonesofort':
          break;
      }
    },
    placeOrderEmitEvent(paymentMethodAdditional) {
      if (this.$store.state.checkout.personalDetails.createAccount) {
        this.register()
      } else {
        console.log('emit checkout-before-placeOrder')
        this.$bus.$emit('checkout-before-placeOrder')
        this.$bus.$emit('checkout-do-placeOrder', paymentMethodAdditional)
      }
    },
    handleSepa(paymentDetails) {
      let that=this;
      this.callApiPreauthorization(paymentDetails).then((res) => {
        console.log('THB: handleSepa', res)
        if (res.answer.includes('APPROVED')) {
          let data=res.answer.split(RegExp("\\n|=")); //EXPECTED CASE: status=APPROVED\ntxid=373760396\nuserid=188092189\n
          console.log(data)
          let preauthorizationData={ reference: res.reference, checkoutTime: res.time, status: data[1], txid: data[3], userid: data[5] }
          let paymentDetails=this.$store.state.checkout.paymentDetails;
          if (!paymentDetails||!paymentDetails.paymentMethodAdditional) throw new Error('PaymentDetails undefined')
          paymentDetails.paymentMethodAdditional.approvedpreauth=true;
          paymentDetails.paymentMethodAdditional={
            ...paymentDetails.paymentMethodAdditional,
            preauthorizationData
          }
          this.$store.dispatch('checkout/savePaymentDetails', paymentDetails)
          console.log('THB: handleSepa: dispatch paymentDetails\n', this.$store.state)

          this.placeOrderEmitEvent(paymentDetails.paymentMethodAdditional)
        } else {
          return false;
          // Not approved.. alert error
        }
      },
        (err) => {

        }
      )
    },
    callApiPreauthorization(paymentDetails): Promise<Response> {
      return new Promise((resolve, reject) => {
        let url=config.api.url+'/api/payone/preauthorization';
        fetch(url, {
          method: 'POST',
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:8081',
            'Access-Control-Expose-Headers': 'http://localhost:3000',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            'Content-Type': 'application/json',
            'withCredentials': 'true'
          },
          mode: 'cors',

          body: JSON.stringify({
            country: paymentDetails.country, // TODO: Compare Storefront and Payone Countrylist
            city: paymentDetails.city,
            lastname: paymentDetails.lastName,
            currency: paymentDetails.paymentMethodAdditional.currency,
            bankcountry: paymentDetails.paymentMethodAdditional.bankcountry,
            bankaccount: paymentDetails.paymentMethodAdditional.iban,
            bankcode: paymentDetails.paymentMethodAdditional.bic,
            // PAYONE API: parameter amount < 0 = faulty
            amount: (paymentDetails.paymentMethodAdditional.amount>=0)? paymentDetails.paymentMethodAdditional.amount:1,
            reference: paymentDetails.paymentMethodAdditional.reference
          })
        }).then(res => {
          // console.log('THB: payment callApiManagemandate res', res)
          res.json().then(result => {
            // TODO: Handle empty objects
            let response=result.result;
            resolve(result.result)
          })
        }).catch(err => {
          console.log('THB: payment err', err)
          reject(err)
        })
      })
    },
    async register() {
      this.$bus.$emit('notification-progress-start', i18n.t('Registering the account ...'))
      this.$store.dispatch('user/register', {
        email: this.$store.state.checkout.personalDetails.emailAddress,
        password: this.$store.state.checkout.personalDetails.password,
        firstname: this.$store.state.checkout.personalDetails.firstName,
        lastname: this.$store.state.checkout.personalDetails.lastName
      }).then(async (result) => {
        this.$bus.$emit('notification-progress-stop')
        if (result.code!==200) {
          this.onFailure(result)
          // If error includes a word 'password', emit event that eventually focuses on a corresponding field
          if (result.result.includes(i18n.t('password'))) {
            this.$bus.$emit('checkout-after-validationError', 'password')
          }
          // If error includes a word 'mail', emit event that eventually focuses on a corresponding field
          if (result.result.includes(i18n.t('email'))) {
            this.$bus.$emit('checkout-after-validationError', 'email-address')
          }
        } else {
          this.$bus.$emit('modal-hide', 'modal-signup')
          await this.$store.dispatch('user/setCurrentUser', result.result) // set current user data to process it with the current order
          this.$bus.$emit('checkout-before-placeOrder', result.result.id)
          this.onSuccess()
        }
      }).catch(err => {
        this.$bus.$emit('notification-progress-stop')
        Logger.error(err, 'checkout')()
      })
    }
  }
}
