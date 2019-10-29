<template>
  <div name="payone-test-container" id="payonecreditcard">
    <form ref="form" name="paymentform" action="#" method="">
      <fieldset>
        <input type="hidden" name="pseudocardpan" id="pseudocardpan">
        <input type="hidden" name="truncatedcardpan" id="truncatedcardpan">

        <!-- configure your cardtype-selection here -->
        <label for="cardtypeInput">Card type</label>
        <select id="cardtype" v-model="cardTypeSelect" @change="onSelectChange($event)">
          <option value="V">
            VISA
          </option>
          <option value="M">
            Mastercard
          </option>
          <option value="A">
            Amex
          </option>
        </select>
        <br>

        <label for="cardpanInput">Cardpan:</label>
        <span class="inputIframe" id="cardpan" />
        <br>
        <label for="cvcInput">CVC:</label>
        <span id="cardcvc2" class="inputIframe" />
        <br>
        <label for="expireInput">Expire Date:</label>
        <span id="expireInput" class="inputIframe">
          <span id="cardexpiremonth" />
          <span id="cardexpireyear" />
        </span>
        <br>
        <label for="firstname">Firstname:</label>
        <input id="firstname" type="text" name="firstname" value="">
        <br>
        <label for="lastname">Lastname:</label>
        <input id="lastname" type="text" name="lastname" value="">

        <div id="errorOutput" />
        <button @click="check">
          Check
        </button>
      </fieldset>
    </form>
    <div id="paymentform" />
  </div>
</template>

<!--script src="https://secure.pay1.de/client-api/js/v1/payone_hosted_min.js" /-->
<script>
import * as jmd5 from 'js-md5';
export default {
  name: 'PaymentPayOneCreditCard',
  data: function () {
    return {
      cardTypeSelect: '',
      iframe: '',
      config: {
        fields: {
          cardpan: {
            selector: 'cardpan', // put name of your div-container here
            type: 'text', // text (default), password, tel
            style: 'font-size: 1em; border: 1px solid #000;'
          },
          cardcvc2: {
            selector: 'cardcvc2', // put name of your div-container here
            type: 'password', // select(default), text, password, tel
            style: 'font-size: 1em; border: 1px solid #000;',
            size: '4',
            maxlength: '4'
          },
          cardexpiremonth: {
            selector: 'cardexpiremonth', // put name of your div-container here
            type: 'select', // select(default), text, password, tel
            size: '2',
            maxlength: '2',
            iframe: {
              width: '50px'
            }
          },
          cardexpireyear: {
            selector: 'cardexpireyear', // put name of your div-container here
            type: 'select', // select(default), text, password, tel
            iframe: {
              width: '80px'
            }
          }
        },
        defaultStyle: {
          input: 'font-size: 1em; border: 1px solid #000; width: 175px;',
          select: 'font-size: 1em; border: 1px solid #000;',
          iframe: {
            height: '33px',
            width: '250px'
          }
        },
        error: 'errorOutput', // area to display error-messages (optional)
        language: Payone.ClientApi.Language.de // Language to display error-messages
        // (default: Payone.ClientApi.Language.en)
      },
      request: {
        aid: '17076',
        api_version: '3.11', // your AID
        encoding: 'UTF-8', // desired encoding
        mid: '16780', // your MID
        mode: 'test', // desired mode
        portalid: '2012587', // your PortalId
        request: 'creditcardcheck', // fixed value
        responsetype: 'JSON', // fixed value
        storecarddata: 'yes', // fixed value
        hash: '' // see Chapter 3.1.5.3
      }
    }
  },
  methods: {
    // method properties are not cached and always exectued
    onSelectChange (event) {
      this.iframe.setCardType(event.target.value);
    },
    check: function () {
      if (this.iframe.isComplete()) {
        console.log('Creditcard Form complete')
        this.iframe.creditCardCheck('checkCallback');
      } else {
        console.log('Creditcard Form not complete')
      }
    },
    submit: function () {
      this.$refs.form.submit()
    }
  },
  created () {
    console.log('creditCard.vue - mounted is executed');
    let Payone1 = document.createElement('script')
    Payone1.onload = () => {
      console.log(23);
      window['checkCallback'] = function (response) {
        console.log('callback:', response);
        if (respone.status === 'VALID') {
            console.log("debug: pseudo: "+ response.pseudocardpan+ '  tuncated' +response.truncatedcardpan)
          document.getElementById('pseudocardpan').value = response.pseudocardpan;
          document.getElementById('truncatedcardpan').value = response.truncatedcardpan;
          // TODO: SUBMIT
          // FORWARD RESPONSE TO VUE-STOREFRONT API
        }
      };
      // TODO: DECIDE WHERE TO STORE HASH and KEY..
      // WHERE ARE WE CONFIGURING MID, AID, so on?

      console.log('mounted: iframe:', this.iframe);
    };
  },
  mounted () {
    // window['Payone'] = Payone;
    window['checkCallback'] = function (response) {
      console.log('callback:', response);
      if (respone.status === 'VALID') {
        document.getElementById('pseudocardpan').value = response.pseudocardpan;
        document.getElementById('truncatedcardpan').value = response.truncatedcardpan;
        // TODO: SUBMIT
        // FORWARD RESPONSE TO VUE-STOREFRONT API
      }
    };
    // TODO: DECIDE WHERE TO STORE HASH and KEY..
    // WHERE ARE WE CONFIGURING MID, AID, so on?
    var key = '9oSAMVTwh1hdUr6f'
    var message = this.request.aid + this.request.api_version + this.request.encoding + this.request.mid + this.request.mode + this.request.portalid + this.request.request + this.request.responsetype + this.request.storecarddata + key;
    var h = jmd5(message);
    this.request.hash = h;

    console.log('message: ' + message)
    console.log('hash: ' + this.request.hash);

    this.iframe = new Payone.ClientApi.HostedIFrames(this.config, this.request);
    this.iframe.setCardType('V');

    console.log(Payone)
    console.log(this.iframe)
  }

}
</script>

<style scoped>
 * {
            margin: 0;
            padding: 0;
        }
        body {
            background: #FFF;
            color: #000;
            font: 0.9em "Helvetica";
        }
        fieldset {
            padding: 1em;
            border: 1px solid #000;
            width: 300px;
            margin: 10px;
        }
        label {
            margin-right: 10px;
            float: left;
            width: 80px;
            padding-top: 0.3em;
            text-align: right;
        }
        input, select{
            font-size: 1em;
            border: 1px solid #000;
            padding: 0.1em;
        }
        select {
            margin-right: 10px;
        }

        input, .inputIframe, select {
            display: block;
            margin-bottom: 10px;
        }

        input {
            width: 175px;
        }

        #paymentsubmit {
            float: right;
            width: auto;
            padding: 5px;
            margin-bottom: 0px;
            margin-right: 10px;
        }
        #errorOutput {

            text-align: center;
            color: #ff0000;
            display: block;
        }
</style>
