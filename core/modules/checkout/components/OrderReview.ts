import { mapGetters } from 'vuex'
import i18n from '@vue-storefront/i18n'
import { Logger } from '@vue-storefront/core/lib/logger'
import config from 'config'
export const OrderReview = {
  name: 'OrderReview',
  props: {
    isActive: {
      type: Boolean,
      required: true
    }
  },
  data () {
    console.log('config.payone:',
      config.payone.paymentMethodId.paypal,
      config.payone.paymentMethodId.cc,
      config.payone.paymentMethodId.sepa,
      config.payone.paymentMethodId.sofor)
    return {
      preauthApi: config.api.url + '/api/payone/preauthorization',
      pmiPaypal: config.payone.paymentMethodId.paypal,
      pmiCC: config.payone.paymentMethodId.cc,
      pmiSepa: config.payone.paymentMethodId.sepa,
      pmiSofort: config.payone.paymentMethodId.sofort,
      isFilled: false,
      orderReview: {
        terms: false
      }
    }
  },
  computed: {
    ...mapGetters({
      isVirtualCart: 'cart/isVirtualCart',
      currentCartHash: 'cart/getCartToken'
    })
  },
  methods: {
    placeOrder () {
      const paymentDetails = this.$store.state.checkout.paymentDetails;
      console.log('THB: paymentMethod', paymentDetails.paymentMethod);
      switch (paymentDetails.paymentMethod) {
        case 'payone_creditcard':
          this.executeCC(paymentDetails);
          break;
        case 'payone_debit_payment':
          this.executeSepa(paymentDetails);
          break;
        case 'payone_wallet_paypal_express':
          this.executeWlt(paymentDetails, 'PPE') // walletType
          break;
        case 'payone_online_bank_transfer_sofortueberweisung':
          this.executeSb(paymentDetails, 'PNT') // onlinebanktransfertype
          break;
      }
    },
    executeSb (paymentDetails, sbType) {
      console.log(sbType)
      const body = {
        ...this.helperExtractRequestBody(paymentDetails),
        ...paymentDetails.paymentMethodAdditional,
        clearingtype: 'sb',
        payone_config_payment_method_id: this.pmiSofort,
        onlinebanktransfertype: sbType,
        ...this.addLinks()
      }
      this.callPreauthApi(body, 'onlineBanking: ' + sbType, paymentDetails)
    },
    executeWlt (paymentDetails, wallettype) {
      console.log(wallettype)
      let body = {
        ...this.helperExtractRequestBody(paymentDetails),
        ...paymentDetails.paymentMethodAdditional,
        clearingtype: 'wlt',
        payone_config_payment_method_id: this.pmiPaypal,
        wallettype: wallettype,
        ...this.addLinks()
      }
      this.callPreauthApi(body, 'eWallet: ' + wallettype, paymentDetails)
    },
    executeCC (paymentDetails) {
      const pMA = paymentDetails.paymentMethodAdditional;
      let body = {
        ...this.helperExtractRequestBody(paymentDetails),
        ...pMA,
        clearingtype: 'cc',
        payone_config_payment_method_id: this.pmiCC
        //        cardtype: pMA.cardtype,
        //        cardexpiredate: pMA.cardexpiredate,
        //       pseudocardpan: pMA.pseudocardpan
      }
      this.callPreauthApi(body, 'CreditCard', paymentDetails)
    },
    executeSepa (paymentDetails) {
      if (!paymentDetails || !paymentDetails.paymentMethodAdditional) throw new Error('PaymentDetails undefined')

      const pMA = paymentDetails.paymentMethodAdditional;
      let body = {
        ...this.helperExtractRequestBody(paymentDetails),
        ...pMA,
        clearingtype: 'elv',
        payone_config_payment_method_id: this.pmiSepa
        //        bankcountry: pMA.bankcountry,
        //        iban: pMA.iban,
        //        bic: pMA.bic
      }
      this.callPreauthApi(body, 'SEPA', paymentDetails)
    },
    callPreauthApi (body, paymentMethod, paymentDetails) {
      this.callApi(this.preauthApi, body).then((res) => {
        res = this.helperParseResponse(res.result.answer)
        console.log('THB: exectuing ', paymentMethod, 'Result: ', res)

        if (res.status === 'APPROVED') {
          this.placeOrderEmitEvent({
            ...res,
            ...body
          })
        } else if (res.status === 'REDIRECT') {
          paymentDetails.paymentMethodAdditional = {
            ...paymentDetails.paymentMethodAdditional,
            ...body,
            ...res
          }
          this.$store.dispatch('checkout/savePaymentDetails', paymentDetails)
          // console.log(this.$store.state.checkout.paymentDetails)
          alert('Sie werden an den Zahlungsdienstleister weitergeleitet.')
          window.location.replace(res.redirecturl);
        } else {
          return 0
        }
      },
      (err) => {
        console.log('THB: exectuing ', paymentMethod, 'Error: ', err)
      })
    },
    addLinks () {
      Logger.debug('THB: currentCartHash', this.currentCartHash)()
      return {
        successurl: config.payone.hostUrlForRedirectBack + '?h=' + this.currentCartHash + '&a=1',
        errorurl: config.payone.hostUrlForRedirectBack + '?h=' + this.currentCartHash + '&a=2',
        backurl: config.payone.hostUrlForRedirectBack + '?h=' + this.currentCartHash + '&a=3'
      }
    },

    placeOrderEmitEvent (paymentMethodAdditional) {
      if (this.$store.state.checkout.personalDetails.createAccount) {
        this.register()
      } else {
        this.$bus.$emit('checkout-do-placeOrder', paymentMethodAdditional)
        // THANK YOU PAGE. onAfterPlaceOrder...
      }
    },
    /*
      Expected input:
      SPEA && CC:'status=APPROVED\ntxid=373760396\nuserid=188092189\n'
      REDIRECT: 'status=REDIRECT\nadd_paydata[token]=EC-2CY37259EY975342E\nredirecturl=https://www.sandbox.paypal.com/webscr?useraction=commit&cmd=_express-checkout&token=EC-2CY37259EY975342E\ntxid=375301441\nuserid=189099559'
      ERR: 'status=ERROR\nerrorcode=1095\nerrormessage=Parameter {wallettype} faulty or missing\ncustomermessage=Invalid Wallet provider. Please verify your data.'
     */
    helperParseResponse (test) {
      const data = test.toString().split(RegExp('\\n'))
      console.log(data)
      const obj = {}
      data.forEach(item => {
        // console.log(item)
        const splitAt = item.indexOf('=');
        if (splitAt === -1) { return item } else {
          const p1 = item.slice(0, splitAt)
          const p2 = item.slice(splitAt + 1, item.length)
          obj[p1] = p2;
          // console.log('p1p2:', p1,'  ', p2)
        }
      })
      return obj
    },
    helperExtractRequestBody (paymentDetails) {
      return {
        country: paymentDetails.country, // TODO: Compare Storefront and Payone Countrylist
        lastname: paymentDetails.lastName
      }
    },

    callApi (url, body) {
      return new Promise((resolve, reject) => {
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

          body: JSON.stringify(body)
        }).then(res => {
          console.log('THB: callApi: url:', url, '\nres', res)
          res.json().then(result => {
            // TODO: Handle empty objects
            // let response=result.result;
            resolve(result)
          })
        }).catch(err => {
          console.log('THB: callApi: url:', url, '\nerr', err)
          reject(err)
        })
      })
    },
    async register () {
      this.$bus.$emit('notification-progress-start', i18n.t('Registering the account ...'))
      this.$store.dispatch('user/register', {
        email: this.$store.state.checkout.personalDetails.emailAddress,
        password: this.$store.state.checkout.personalDetails.password,
        firstname: this.$store.state.checkout.personalDetails.firstName,
        lastname: this.$store.state.checkout.personalDetails.lastName
      }).then(async (result) => {
        this.$bus.$emit('notification-progress-stop')
        if (result.code !== 200) {
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
