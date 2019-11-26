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
      preauthApi: config.api.url+'/api/payone/preauthorization',
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
          this.handelCC(paymentDetails);
          break;
        case 'payonesepa':
          this.handelSepa(paymentDetails);
          break;
        case 'payonepaypal':
          this.handelWlt(paymentDetails, 'PPE')
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
        // THANK YOU PAGE. onAfterPlaceOrder... 
      }
    },
    handelWlt(paymentDetails, wallettype) {
      let body=this.helperExtractRequestBody(paymentDetails);
      console.log(wallettype)
      body={
        ...body,
        clearingtype: 'wlt',
        wallettype: wallettype,
        successurl: config.payone.successurl,
        errorurl: config.payone.errorurl,
        backurl: config.payone.backurl
      }
      //Preauth via SF-API
      this.callApi(this.preauthApi, body).then(
        (res) => {
          console.log(res)
          res=this.helperParseResponse(res.result.answer)
          console.log('THB: handelCC', res)
          if (res.status==='APPROVED') {
            this.placeOrderEmitEvent({
              ...paymentDetails.paymentMethodAdditional,
              ...res
            })
          }
          //TODO Link To Successurl.. AND MANGE the link back
        },
        (err) => {
          console.log('THB: handelWlt', err)

        })
    },
    handelCC(paymentDetails) {
      //preapare Body for Preauth Creditcard
      let body=this.helperExtractRequestBody(paymentDetails);
      let pMA=paymentDetails.paymentMethodAdditional;
      body={
        ...body,
        clearingtype: 'cc',
        cardtype: pMA.cardtype,
        cardexpiredate: pMA.cardexpiredate,
        pseudocardpan: pMA.pseudocardpan
      }
      //Preauth via SF-API
      this.callApi(this.preauthApi, body).then((res) => {
        res=this.helperParseResponse(res.result.answer)
        console.log('THB: handelCC', res)
        if (res.status==='APPROVED') {
          this.placeOrderEmitEvent({
            ...paymentDetails.paymentMethodAdditional,
            ...res
          })
        } else {
          return 0
        }

      },
        (err) => {
          console.log('THB: handelCC', err)
        })
    },
    handelSepa(paymentDetails) {
      if (!paymentDetails||!paymentDetails.paymentMethodAdditional) throw new Error('PaymentDetails undefined')

      let body=this.helperExtractRequestBody(paymentDetails);
      let pMA=paymentDetails.paymentMethodAdditional;
      body={
        ...body,
        clearingtype: 'elv',
        bankcountry: pMA.bankcountry,
        iban: pMA.iban,
        bic: pMA.bic
      }
      //this.callApiPreauthorization(paymentDetails).then(
      this.callApi(this.preauthApi, body).then((res) => {
        res=this.helperParseResponse(res.result.answer)
        console.log('THB: handelSepa', res)
        if (res.status==='APPROVED') {

          //this.$store.dispatch('checkout/savePaymentDetails', paymentDetails)
          this.placeOrderEmitEvent({
            ...paymentDetails.paymentMethodAdditional,
            ...res
          })
        } else {
          return 0
        }
      },
        (err) => {
          console.log('THB:', err)
        }
      )
    },
    /*
      Expected input:
      SPEA && CC:'status=APPROVED\ntxid=373760396\nuserid=188092189\n'
      REDIRECT: 'status=REDIRECT\nadd_paydata[token]=EC-2CY37259EY975342E\nredirecturl=https://www.sandbox.paypal.com/webscr?useraction=commit&cmd=_express-checkout&token=EC-2CY37259EY975342E\ntxid=375301441\nuserid=189099559'
      ERR: 'status=ERROR\nerrorcode=1095\nerrormessage=Parameter {wallettype} faulty or missing\ncustomermessage=Invalid Wallet provider. Please verify your data.'
     */
    helperParseResponse(test) {

      let data=test.toString().split(RegExp("\\n"))
      console.log(data)
      let obj={}
      data.forEach(item => {
        //console.log(item)
        let splitAt=item.indexOf("=");
        if (splitAt===-1) { return item } else {
          let p1=item.slice(0, splitAt)
          let p2=item.slice(splitAt+1, item.length)
          obj[p1]=p2;
          //console.log('p1p2:', p1,'  ', p2)
        }
      })
      return obj
    },
    helperExtractRequestBody(paymentDetails) {
      return {
        country: paymentDetails.country, // TODO: Compare Storefront and Payone Countrylist
        lastname: paymentDetails.lastName,
        currency: 'EUR',
        amount: (paymentDetails.paymentMethodAdditional.amount>=0)? paymentDetails.paymentMethodAdditional.amount:1,
      }
    },

    callApi(url, body) {
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
            //let response=result.result;
            resolve(result)
          })
        }).catch(err => {
          console.log('THB: callApi: url:', url, '\nerr', err)
          reject(err)
        })
      })
    },
    callApiPreauthorizationCC(paymentDetails): Promise<Response> {
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

            clearingtype: 'cc',
            cardtype: paymentDetails.paymentMethodAdditional.cardtype,
            cardexpiredate: paymentDetails.paymentMethodAdditional.cardexpiredate,
            pseudocardpan: paymentDetails.paymentMethodAdditional.pseudocardpan


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
            // PAYONE API: parameter amount < 0 = faulty
            amount: (paymentDetails.paymentMethodAdditional.amount>=0)? paymentDetails.paymentMethodAdditional.amount:1,
            bankcountry: paymentDetails.paymentMethodAdditional.bankcountry,
            iban: paymentDetails.paymentMethodAdditional.iban,
            bic: paymentDetails.paymentMethodAdditional.bic

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
