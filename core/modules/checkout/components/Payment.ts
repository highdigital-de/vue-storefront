import { mapState, mapGetters } from 'vuex';
import request from 'request';
import RootState from '@vue-storefront/core/types/RootState';
import toString from 'lodash-es/toString';
import { TaskQueue } from '@vue-storefront/core/lib/sync';
//import { Task } from '@vue-storefront/core/lib/sync/types/Task';
import config from 'config'

import { Logger } from '@vue-storefront/core/lib/logger';

const Countries=require('@vue-storefront/i18n/resource/countries.json');

export const Payment={
  name: 'Payment',
  props: {
    isActive: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      isFilled: false,
      countries: Countries,
      payment: this.$store.state.checkout.paymentDetails,
      generateInvoice: false,
      sendToShippingAddress: false,
      sendToBillingAddress: false
    };
  },
  computed: {
    ...mapState({
      currentUser: (state: RootState) => state.user.current,
      shippingDetails: (state: RootState) => state.checkout.shippingDetails
    }),
    ...mapGetters({
      paymentMethods: 'payment/paymentMethods',
      isVirtualCart: 'cart/isVirtualCart'
    })
  },
  created() {
    if (
      !this.payment.paymentMethod||
      this.notInMethods(this.payment.paymentMethod)
    ) {
      this.payment.paymentMethod=
        this.paymentMethods.length>0
          ? this.paymentMethods[0].code
          :'cashondelivery';
    }
  },
  mounted() {
    if (this.payment.firstName) {
      this.initializeBillingAddress();
    } else {
      if (this.payment.company) {
        this.generateInvoice=true;
      }
    }
    this.changePaymentMethod();
    //PAYONE PAYMENT MODUL CALLBACK FUNCTION
    var self=this;
    window['checkCallback']=function (response) {
      self.checkCallback(response);
    };
  },
  watch: {
    shippingDetails: {
      handler() {
        if (this.sendToShippingAddress) {
          this.copyShippingToBillingAddress();
        }
      },
      deep: true
    },
    sendToShippingAddress: {
      handler() {
        this.useShippingAddress();
      }
    },
    sendToBillingAddress: {
      handler() {
        this.useBillingAddress();
      }
    },
    generateInvoice: {
      handler() {
        this.useGenerateInvoice();
      }
    }
  },
  methods: {
    checkCallback(response) {
      console.log('Debug: checkCallback Payone:', response);
      if (response.status==='VALID') {
        let paymentMethodAdditional={
          cardexpiredate: response.cardexpiredate,
          cardtype: response.cardtype,
          errorCode: response.errorCode,
          errorMessage: response.errorMessage,
          pseudocardpan: response.pseudocardpan,
          status: response.status,
          truncatedcardpan: response.truncatedcardpan
        };
        this.payment.paymentMethodAdditional=paymentMethodAdditional;
        console.log(this.payment);
        console.log('sendDataToCheckout - cc successful');

        this.sendDataToCheckout1();
      } else {
        console.log('sendDataToCheckout - cc failed');
        alert(
          'Die Kreditkartenprüfung ist fehlgeschlagen. Sind die Eingabedaten korrekt?\n Nachricht: '+
          response.errorMessage+
          '\n Fehlercode: '+
          response.errorCode
        );
      }
    },
    confirmSepaMandate(res) {
      if (confirm('SPEA LASTSCHRIFT MANDAT'+decodeURIComponent(res))) {
        console.log('OK')
        // AT PLACE ORDER DO preauthorization (server side)
        return true;
      } else {
        console.log('BACK TO PAYMENT')
        // User did 
        return false;
      }
    },
    sendDataToCheckout() {
      let iframe=window['iFramePayone'];
      console.log(this.payment.paymentMethod);
      switch (this.payment.paymentMethod) {
        case 'payonecreditcard':
          if (iframe.isComplete()) {
            iframe.creditCardCheck('checkCallback');
            console.log('sendDataToCheckout - cc complete');
          } else {
            console.log('sendDataToCheckout - cc not complete');
            alert('Die Kreditkartendaten sind nicht vollständig.');
          }
          break;
        case 'payonesepa':
          let sepaData=window['checkSepaComplete']();
          let that=this;
          if (sepaData.complete===true) {
            console.log('THB: ', sepaData)
            this.callApiManagemandate(sepaData)
              .then(function (res) {
                //console.log('THB:callApiManagemandate res:', res)
                let userApproval=false;
                //TODO: Update Confirm to SFUI Modal and Insert the callApiManagemandate returned HTML-Code in there. 
                //      Bring the User Answer (approve / denied) back in this logic as userAproval.
                if (confirm('SPEA LASTSCHRIFT MANDAT'+decodeURIComponent(res))) {
                  //console.log('OK')
                  userApproval=true;                   // PLACE-ORDER-Button does the preauthorization 
                } else {
                  //console.log('BACK TO PAYMENT')
                }
                //Analyse User Answer..
                if (userApproval===true) {
                  sepaData.approvedMangedMan=true;
                  that.payment.paymentMethodAdditional=sepaData; // that = this in surrounding scope
                  that.sendDataToCheckoutEmitEvent();
                } else {
                  alert('Readjust your Payment ')
                }
              }, function (err) {
                console.log(err);
                alert('Something went wrong wihle transfering your Payment-Data. Try it again.'+err.errorMessage);
              });
            console.log(this.payment)
          } else {
            alert('Eingabe unzulänglich.');
          }
          break;
        case 'payonepaypal':
          break;
        case 'payonesofort':
          break;
      }
    },
    sendDataToCheckoutEmitEvent() {
      this.$bus.$emit('checkout-after-paymentDetails', this.payment, this.$v);
      this.isFilled=true;
    },
    callApiManagemandate(sepaData): Promise<Response> {
      return new Promise((resolve, reject) => {
        let url=config.api.url+'/api/payone/managemandate';
        fetch(url, {
          method: 'POST',
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:8081",
            "Access-Control-Expose-Headers": "http://localhost:3000",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
            'Content-Type': 'application/json',
            'withCredentials': 'true'
          },
          mode: 'cors',
          body: JSON.stringify({
            /*mid: '16780',
            portalid: '2012587',
            key: '3e94def85fc95e50086db07c48538170',
            api_version: '3.11',
            mode: 'test',
            request: 'managemandate',
            encoding: 'UTF-8',
            aid: '17076',
            clearingtype: 'elv',*/

            currency: sepaData.currency,
            country: this.payment.country, //TODO: Compare Storefront and Payone Countrylist
            bankcountry: sepaData.bankcountry,
            bankaccount: sepaData.iban,
            bankcode: sepaData.bic,
            city: this.payment.city,
            lastname: this.payment.lastName
          })
        }).then(res => {
          //console.log('THB: payment callApiManagemandate res', res)
          res.json().then(result => {
            // TODO: Handle empty objects 
            let res=JSON.parse(result.result).answer
            //console.log(' res.json()2', decodeURIComponent(res))
            //this.$bus.$emit('modal-show', 'modal-signup')
            resolve(res)
          })
        }).catch(err => {
          console.log('THB: payment testfetch err', err)
          reject(err)
        })
      })
    },

    handelSepa() {
      let url=config.api.url+'/api/payone/post';
      return TaskQueue.execute({
        url: url,
        payload: {
          method: 'POST',
          mode: 'cors',
          headers: {
            //"Access-Control-Allow-Origin": "http://localhost:8081",
            //"Access-Control-Expose-Headers": "http://localhost:3000",
            //"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
            'Content-Type': 'application/json',
            'withCredentials': 'true'
          },
          body: JSON.stringify({
            "aid": "17076",
            "api_version": "3.11",
            "bankaccount": "2599100004",
            "bankcode": "12345678",
            "bankcountry": "DE",
            "clearingtype": "elv",
            "country": "DE",
            "currency": "EUR",
            "encoding": "UTF-8",
            "hash": "00000000000000000000000000000000000000",
            "iban": "DE00123456782599100003",
            "lastname": "Baier",
            "mid": "16780",
            "mode": "test",
            "portalid": "2012587",
            "request": "managemandate",
            "responsetype": "JSON",
            "city": "Berlin"
          })
        }
      }).then(task => {
        //wird nicht erreicht
        Logger.debug('THB:'+task)();
        return task;
      });


    },
    edit() {
      if (this.isFilled) {
        this.$bus.$emit('checkout-before-edit', 'payment');
      }
    },
    hasBillingData() {
      if (this.currentUser) {
        if (this.currentUser.hasOwnProperty('default_billing')) {
          return true;
        }
      }
      return false;
    },
    initializeBillingAddress() {
      let initialized=false;
      if (this.currentUser) {
        if (this.currentUser.hasOwnProperty('default_billing')) {
          let id=this.currentUser.default_billing;
          let addresses=this.currentUser.addresses;
          for (let i=0; i<addresses.length; i++) {
            if (toString(addresses[i].id)===toString(id)) {
              this.payment={
                firstName: addresses[i].firstname,
                lastName: addresses[i].lastname,
                company: addresses[i].company,
                country: addresses[i].country_id,
                state: addresses[i].region.region
                  ? addresses[i].region.region
                  :'',
                city: addresses[i].city,
                streetAddress: addresses[i].street[0],
                apartmentNumber: addresses[i].street[1],
                zipCode: addresses[i].postcode,
                taxId: addresses[i].vat_id,
                phoneNumber: addresses[i].telephone,
                paymentMethod: this.paymentMethods[0].code
              };
              this.generateInvoice=true;
              this.sendToBillingAddress=true;
              initialized=true;
            }
          }
        }
      }
      if (!initialized) {
        this.payment={
          firstName: '',
          lastName: '',
          company: '',
          country: '',
          state: '',
          city: '',
          streetAddress: '',
          apartmentNumber: '',
          postcode: '',
          zipCode: '',
          phoneNumber: '',
          taxId: '',
          paymentMethod:
            this.paymentMethods.length>0? this.paymentMethods[0].code:''
        };
      }
    },
    useShippingAddress() {
      if (this.sendToShippingAddress) {
        this.copyShippingToBillingAddress();
        this.sendToBillingAddress=false;
      }

      if (!this.sendToBillingAddress&&!this.sendToShippingAddress) {
        this.payment=this.$store.state.checkout.paymentDetails;
      }
    },
    copyShippingToBillingAddress() {
      this.payment={
        firstName: this.shippingDetails.firstName,
        lastName: this.shippingDetails.lastName,
        country: this.shippingDetails.country,
        state: this.shippingDetails.state,
        city: this.shippingDetails.city,
        streetAddress: this.shippingDetails.streetAddress,
        apartmentNumber: this.shippingDetails.apartmentNumber,
        zipCode: this.shippingDetails.zipCode,
        phoneNumber: this.shippingDetails.phoneNumber,
        paymentMethod:
          this.paymentMethods.length>0? this.paymentMethods[0].code:''
      };
    },
    useBillingAddress() {
      if (this.sendToBillingAddress) {
        let id=this.currentUser.default_billing;
        let addresses=this.currentUser.addresses;
        for (let i=0; i<addresses.length; i++) {
          if (toString(addresses[i].id)===toString(id)) {
            this.payment={
              firstName: addresses[i].firstname,
              lastName: addresses[i].lastname,
              company: addresses[i].company,
              country: addresses[i].country_id,
              state: addresses[i].region.region
                ? addresses[i].region.region
                :'',
              city: addresses[i].city,
              streetAddress: addresses[i].street[0],
              apartmentNumber: addresses[i].street[1],
              zipCode: addresses[i].postcode,
              taxId: addresses[i].vat_id,
              phoneNumber: addresses[i].telephone,
              paymentMethod:
                this.paymentMethods.length>0
                  ? this.paymentMethods[0].code
                  :''
            };
            this.generateInvoice=true;
          }
        }
        this.sendToShippingAddress=false;
      }

      if (!this.sendToBillingAddress&&!this.sendToShippingAddress) {
        this.payment=this.$store.state.checkout.paymentDetails;
        this.generateInvoice=false;
      }
    },
    useGenerateInvoice() {
      if (!this.generateInvoice) {
        this.payment.company='';
        this.payment.taxId='';
      }
    },
    getCountryName() {
      for (let i=0; i<this.countries.length; i++) {
        if (this.countries[i].code===this.payment.country) {
          return this.countries[i].name;
        }
      }
      return '';
    },
    getPaymentMethod() {
      for (let i=0; i<this.paymentMethods.length; i++) {
        if (this.paymentMethods[i].code===this.payment.paymentMethod) {
          return {
            title: this.paymentMethods[i].title
              ? this.paymentMethods[i].title
              :this.paymentMethods[i].name
          };
        }
      }
      return {
        name: ''
      };
    },
    notInMethods(method) {
      let availableMethods=this.paymentMethods;
      if (availableMethods.find(item => item.code===method)) {
        return false;
      }
      return true;
    },
    changePaymentMethod() {
      // reset the additional payment method component container if exists.
      if (
        document.getElementById('checkout-order-review-additional-container')
      ) {
        document.getElementById(
          'checkout-order-review-additional-container'
        ).innerHTML='<div id="checkout-order-review-additional">&nbsp;</div>'; // reset
      }

      let payoneContainers=document.getElementsByName(
        'payone-test-container'
      );
      for (let i=0; i<payoneContainers.length; i++) {
        // delete innerHtml block of  all occurence's of "payone-test-container"
        payoneContainers[i].innerHTML=''; // reset
      }

      // Let anyone listening know that we've changed payment method, usually a payment extension.
      this.$bus.$emit(
        'checkout-payment-method-changed',
        this.payment.paymentMethod
      );
    }
  }
};
