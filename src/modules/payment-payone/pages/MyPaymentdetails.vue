<template>
  <div class="mb35">
    <!-- My shipping details header -->
    <div class="row mb15">
      <div class="col-xs-12 col-sm-6" :class="{ 'cl-accent' : !isEdited }">
        <h3 class="m0 mb5" style="marigin-top=0px">
          My payment details
        </h3>
      </div>
      <div class="col-xs-12 col-sm-6" />
    </div>

    <!-- My payment details body (edit mode) -->
    <template>
      <div class="" v-if="isEdited">
        <div class="mb35">
          <div class="row" v-if="isEditSepa">
            <div class="col-xs-12 col-sm-6 mb10">
              <h3>Sepa-Mandat</h3>
            </div>
            <div class="col-xs-12 col-sm-6 mb10">
              <p />
            </div>
            <br>
            <base-input
              class="col-xs-12 col-sm-6 mb10"
              type="text"
              name="iban"
              :placeholder="`${'Iban'} *`"
              v-model.trim="paymentdetails.sepa.iban"
              @blur="$v.paymentdetails.sepa.iban.$touch()"
              @change="$v.paymentdetails.sepa.iban.$touch();"
              :validations="[
                {
                  condition: $v.paymentdetails.sepa.iban.$error && !$v.paymentdetails.sepa.iban.required,
                  text: 'Field is required'
                },
                {
                  condition: !$v.paymentdetails.sepa.iban.minLength,
                  text:'Iban must have at least 10 letters.'
                },
                {
                  condition: !$v.paymentdetails.sepa.iban.maxLength,
                  text:'Iban can have maximum 34 letters.'
                }
              ]"
            />
            <base-input
              class="col-xs-12 col-sm-6 mb10"
              type="text"
              name="bic"
              :placeholder="`${'Bic'} *`"
              v-model.trim="paymentdetails.sepa.bic"
              @blur="$v.paymentdetails.sepa.bic.$touch()"
              @change="$v.paymentdetails.sepa.bic.$touch();"

              :validations="[
                {
                  condition: $v.paymentdetails.sepa.bic.$error && !$v.paymentdetails.sepa.bic.required,
                  text: 'Field is required'
                },
                {
                  condition: !$v.paymentdetails.sepa.bic.minLength,
                  text: 'Bic must have at least 8 letters.'
                },
                {
                  condition: !$v.paymentdetails.sepa.bic.maxLength,
                  text:'Bic can have maximum 11 letters.'
                }
              ]"
            />
            <base-select
              class="col-xs-12 col-sm-6 mb10"
              name="countries"
              :options="countryOptions"
              :selected="paymentdetails.sepa.bankcountry"
              :placeholder="`${'Bankcountry'} *`"
              v-model="paymentdetails.sepa.bankcountry"
              autocomplete="country-name"
            />
            <base-select
              class="col-xs-12 col-sm-6 mb10"
              name="countries"
              :options="countryOptions"
              :selected="paymentdetails.sepa.country"
              :placeholder="`${'Country'} *`"
              v-model="paymentdetails.sepa.country"
              autocomplete="country-name"
            />
            <base-input
              class="col-xs-12 col-sm-6 mb10"
              type="text"
              name="lastname"
              :placeholder="`${'lastname'} *`"
              v-model.trim="paymentdetails.sepa.lastname"
              @blur="$v.paymentdetails.sepa.lastname.$touch()"
              @change="$v.paymentdetails.sepa.lastname.$touch();"
              :validations="[
                {
                  condition: $v.paymentdetails.sepa.lastname.$error && !$v.paymentdetails.sepa.lastname.required,
                  text: 'Field is required'
                }
              ]"
            />
            <base-input
              class="col-xs-12 col-sm-6 mb10"
              type="text"
              name="city"
              :placeholder="`${'City'} *`"
              v-model.trim="paymentdetails.sepa.city"
              @blur="$v.paymentdetails.sepa.city.$touch()"
              @change="$v.paymentdetails.sepa.city.$touch();"
              :validations="[
                {
                  condition: $v.paymentdetails.sepa.city.$error && !$v.paymentdetails.sepa.city.required,
                  text: 'Field is required'
                }
              ]"
            />
          </div>
          <div class="row" v-if="!isEditSepa">
            <div class="col-xs-12 col-sm-6 mb10">
              <h3>Kreditkarten Daten</h3>
              <CreditCard />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-6">
            <button-full
              @click.native="addPaymentMethod"
              :disabled="isEditSepa && $v.paymentdetails.sepa.$invalid"
            >
              {{ 'Update my payment details' }}
            </button-full>
          </div>
          <div class="col-xs-12 col-sm-6 flex middle-xs py10">
            <a href="#" @click="exitSection" class="h4 cl-accent">
              {{ $t('Cancel') }}
            </a>
          </div>
        </div>
      </div>
    </template>
    <!-- My shipping details summary -->
    <div class="" v-if="!isEdited">
      <div class="row mb35">
        <div class="col-xs-12 col-sm-6 h4">
          <div class="weight-700">
            Sepa-Mandate
          </div>
          <div class="fs16" v-if="isSepa">
            <p>IBAN: {{ paymentdetails.sepa.iban }}</p>  <p>BIC: {{ paymentdetails.sepa.bic }}</p>
            <p>Bankcountry: {{ paymentdetails.sepa.bankcountry }}</p>
          </div>
          <div v-else>
            <p>Keine Sepa-Kartendaten hinterlegt</p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-6">
          <div class="lh30 flex end-md">
            <a href="#" class="cl-tertiary flex" @click.prevent="editSepa">
              <span class="pr5">
                Add new debit card details
              </span>
              <i class="material-icons cl-tertiary">edit</i>
            </a>
          </div>
        </div>
      </div>

      <div class="row mb35">
        <div class="col-xs-12 col-sm-6 h4">
          <div class="weight-700">
            Kreditkarte
          </div>
          <div class="fs16" v-if="isCreditcard">
            <p>Cardtype: {{ paymentdetails.cc.cardtype }}</p>
            <p>Cardpan: {{ paymentdetails.cc.truncatedcardpan }}</p>
            <p>Expiredate: {{ paymentdetails.cc.cardexpiredate }}</p>
          </div>
          <div v-else>
            <p>Keine Kreditkartendaten hinterlegt</p>
          </div>
        </div>
        <div class="col-xs-12 col-sm-6">
          <div class="lh30 flex end-md">
            <a href="#" class="cl-tertiary flex" @click="editCC">
              <span class="pr5">
                Add new credit card details
              </span>
              <i class="material-icons cl-tertiary">edit</i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <modal name="modal-sepa">
      <p slot="header">
        Sepa Mandate
      </p>
      <div slot="content" style="width:100%">
        <span v-html="confirmSepaMandateText" />
        <div class="">
          <button-full
            @click.native="approveSepa"
          >
            Approve Mandate
          </button-full>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import CreditCard from '../pages/CreditCard.vue';
import Vue from 'vue';
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import ButtonFull from 'theme/components/theme/ButtonFull'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'
import config from 'config'
import Modal from 'theme/components/core/Modal'

export default {
  name: 'MyPaymentdetails',
  components: {
    ButtonFull,
    BaseInput,
    BaseSelect,
    CreditCard,
    Modal
  },
  validations () {
    if (this.isEditSepa) {
      return {
        paymentdetails: {
          sepa: {
            iban: {
              required,
              minLength: minLength(10),
              maxLength: maxLength(34)
            },
            bic: {
              required,
              minLength: minLength(8),
              maxLength: maxLength(11)
            },
            lastname: {
              required
            },
            city: {
              required
            },
            bankcountry: {
              required
            },
            country: {
              required
            }
          }
        }
      }
    }
  },
  data: function () {
    return {
      api: 'http://localhost:18083', // this.config.api.url
      payone_user_id: this.$store.state.user.current.payone_user_id,
      confirmSepaMandateText: 'test',
      countryOptions: [ {value: 'DE', label: 'Germany'}, {value: 'AT', label: 'Austria'} ],
      cardtypOptions: [ {value: 'V', label: 'Visa'}, {value: 'M', label: 'Mastercard'}, {value: 'A', label: 'Amex'} ],
      currentUser: Object.assign({}, this.$store.state.user.current),
      isEdited: false,
      isEditSepa: false,
      remainInEditMode: false,
      paymentdetails:
        {
          sepa: {
            bankcountry: 'DE',
            iban: 'DE00123456782599100003',
            bic: 'TESTTEST',
            currency: 'EUR',
            country: 'DE', // try to init
            city: 'Mainz',
            lastname: 'Mueller'
          },
          cc: {
            cardtype: '',
            truncatedcardpan: '',
            pseudocardpan: '',
            cardexpiredate: ''
          },
          saveThis: '' // TODO: THIS FIELD WILL BE FILLED after SEPA complete or CC-Complete, save it to DB
        }

    }
  },
  computed: {
    // show section sepa if iban is in place
    isSepa () {
      return (this.paymentdetails.sepa.iban !== '');
    },
    // show section cc if truncatedcardpan is in place
    isCreditcard () {
      return (this.paymentdetails.cc.truncatedcardpan !== '');
    }
  },
  mounted () {
    const Payone1 = document.createElement('script');
    Payone1.setAttribute(
      'src',
      'https://secure.pay1.de/client-api/js/v1/payone_hosted.js'
    );
    document.head.appendChild(Payone1);

    const self = this;
    window['checkCcCallback'] = function (response) {
      self.checkCcCallback(response);
    };
    console.log('payone_user_id', this.payone_user_id)
  },
  methods: {
    exitSection () {
      if (!this.remainInEditMode) {
        this.isEdited = false
      }
    },
    editSepa () {
      this.isEditSepa = true;
      this.isEdited = true;
    },
    editCC () {
      this.isEditSepa = false;
      this.isEdited = true;
    },
    callApiManagemandate (sepaData) {
      return new Promise((resolve, reject) => {
        const url = this.api + '/api/payone/managemandate';
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
            currency: sepaData.currency,
            country: sepaData.country, // TODO: Compare Storefront and Payone Countrylist
            bankcountry: sepaData.bankcountry,
            iban: sepaData.iban,
            bic: sepaData.bic,
            city: sepaData.city,
            lastname: sepaData.lastname
          })
        }).then(res => {
          res.json().then(result => {
            console.log('THB: payment managemandate res', result.result.answer)
            resolve(result.result.answer)
          })
        }).catch(err => {
          console.log('THB: payment managemandate err', err)
          reject(err)
        })
      })
    },
    helperParseResponse (test) {
      const data = test.toString().split(RegExp('\\n'))
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
    confirmSepaMandate (res) {
      var obj1 = this.helperParseResponse(res)
      console.log('confirmSepaMandate', obj1)
      res = decodeURIComponent(obj1.mandate_text).replace(/\+/gm, ' ')
      if (res === '') {
        res = 'Für die angegebene Iban existiert bereits ein SEPA-Mandat. Möchten Sie die Kontodaten aktualisieren?'
        // IF RES === '' dann kein neues mandate anfordern sondern
        // 1. Userid
        // 2. UpdateUser schicken an Payone
      }
      this.confirmSepaMandateText = res
      this.$bus.$emit('modal-toggle', 'modal-sepa')
    },
    checkCcCallback (response) {
      console.log('Debug: checkCcCallback Payone:', response);
      if (response.status === 'VALID') {
        this.callUpdateUser(response).then((res) => {
          res = this.helperParseResponse(res.answer)
          console.log('THB: checkCcCallback: ', res)
          if (res.status === 'ERROR') {
            alert('\nErrorcode:', res.errorcode, '\nErrormessage', res.errormessage, '\nCustomermessage', res.customermessage)
          } else if (res.status === 'OK') {
            this.paymentdetails.cc.truncatedcardpan = response.truncatedcardpan
            this.paymentdetails.cc.cardexpiredate = response.cardexpiredate
            this.paymentdetails.cc.cardtype = response.cardtype
            this.paymentdetails.cc.pseudocardpan = response.pseudocardpan
            this.isEdited = false;
            // TODO: Save Status Successful UpdateUser ;)
          }
        })
      }
    },
    maybe (i) {
      // eslint-disable-next-line no-unneeded-ternary
      return (i) ? i : ''
    },
    callUpdateUser (paymentData) {
      return new Promise((resolve, reject) => {
        var config = require('config');
        let url = this.api + '/api/payone/updateuser';
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
            userid: this.payone_user_id,

            // UPDATE SEPA DATA

            bankcountry: this.maybe(paymentData.bankcountry),
            IBAN: this.maybe(paymentData.iban),
            BIC: this.maybe(paymentData.bic),

            // UPDATE CC DATA
            pseudocardpan: this.maybe(paymentData.pseudocardpan),
            cardtype: this.maybe(paymentData.cardtype),
            cardexpiredate: this.maybe(paymentData.cardexpiredate)
          })}
        ).then(res => {
          res.json().then(result => {
            console.log('updateuser res', result)
            resolve(result.result)
          })
        }).catch(err => {
          console.log('updateuser err', err)
          reject(err)
        })
      })
    },
    approveSepa () {
      this.$bus.$emit('modal-hide', 'modal-sepa')
      // TODO Update User
      console.log(this.paymentdetails.saveThis)
      this.callUpdateUser(this.paymentdetails.saveThis).then((res) => {
        res = this.helperParseResponse(res.answer)
        console.log('THB: approveSepa: ', res)
        if (res.status === 'ERROR') {
          alert('\nErrorcode:', res.errorcode, '\nErrormessage', res.errormessage, '\nCustomermessage', res.customermessage)
        } else if (res.status === 'OK') { // STATUS 'OK'
          this.paymentdetails.sepa.iban = this.paymentdetails.saveThis.iban
          this.paymentdetails.sepa.bic = this.paymentdetails.saveThis.bic
          this.paymentdetails.sepa.bankcountry = this.paymentdetails.saveThis.bankcountry
          this.isEdited = false;
          // TODO: Save Status Successful UpdateUser ;)
        }
      })
    },
    handleAddSepa () {
      // TODO: Add SEPA MANDATE
      let pd = {
        userid: this.payone_user_id,
        ...this.paymentdetails.sepa
      }
      console.log('THB: pd', pd)
      this.callApiManagemandate(pd).then((res) => {
        // TODO: Handle empty or errors in mandate
        this.confirmSepaMandate(res)
        // handle if user clicks cancel
        this.paymentdetails.saveThis = pd // => apporoveSepa ()
      }, (err) => {
        console.log(err);
        alert('Something went wrong wihle transfering your Payment-Data. Try it again.' + err.errorMessage);
      });
    },
    handleAddCc () {
      // Update CC details
      const iframe = window['iFramePayone'];
      console.log('THB iframe:', iframe)
      if (iframe.isComplete()) {
        iframe.creditCardCheck('checkCcCallback'); // => checkCcCallback ()
        console.log('sendDataToCheckout - cc complete');
      } else {
        console.log('sendDataToCheckout - cc not complete');
        alert('Die Kreditkartendaten sind nicht vollständig.');
      }
    },
    // TODO: Validators for the Button
    addPaymentMethod: function () {
      if (typeof this.payone_user_id === 'number') {
        if (this.isEditSepa === true) {
          this.handleAddSepa()
        } else {
          this.handleAddCc()
        }
      } else {
        console.log('payone_user_id not a number but needed in updateUser:', this.payone_user_id)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
