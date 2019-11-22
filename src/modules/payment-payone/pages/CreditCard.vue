<template>
  <div
    name="payone-test-container"
    id="payonecreditcard"
  >
    <form
      ref="form"
      name="paymentform"
      action="#"
      method="onSave();return false;"
    >
      <fieldset>
        <input
          type="hidden"
          name="pseudocardpan"
          id="pseudocardpan"
        >
        <input
          type="hidden"
          name="truncatedcardpan"
          id="truncatedcardpan"
        >
        <label for="cardtypeInput">Card type</label>
        <select
          id="cardtype"
          @change="onSelectChange($event)"
        >
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
        <span
          class="inputIframe"
          id="cardpan"
        />
        <br>
        <label for="cvcInput">CVC:</label>
        <span
          id="cardcvc2"
          class="inputIframe"
        />
        <br>
        <label for="expireInput">Expire Date:</label>
        <span
          id="expireInput"
          class="inputIframe"
        >
          <span id="cardexpiremonth" />
          <span id="cardexpireyear" />
        </span>
        <br>
        <label for="firstname1">Firstname:</label>
        <input
          id="firstname1"
          type="text"
          value
          v-model.trim="firstname"
        >
        <br>
        <label for="lastname1">Lastname:</label>
        <input
          id="lastname1"
          type="text"
          value
          v-model.trim="lastname"
        >
        <br>
        <div id="errorOutput" />
        <input
          class="submit"
          type="submit"
          value="submit"
          @click.stop.prevent="check"
        >
      </fieldset>
    </form>
    <div id="paymentform" />
  </div>
</template>

<script src="https://secure.pay1.de/client-api/js/v1/payone_hosted_min.js" />
<script lang="ts">
//import * as jmd5 from 'js-md5' // TODO move to backend

declare var Payone: any; // fix for ERROR in TS2304: Cannot find name

export default {
  name: 'PaymentPayOneCreditCard',
  data: function () {
    return {
      iframe: '',
      firstname: '',
      lastname: '',
      paymentDetails1: '',
      respone: '',
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
        language: Payone.ClientApi.Language.de // Language to display error-messages: default: Language.en
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
    onSelectChange: function (event) {
      this.iframe.setCardType(event.target.value)
    }
  },
  mounted () {
    // TODO: HASH
    var key = '9oSAMVTwh1hdUr6f'
    var message =
      this.request.aid +
      this.request.api_version +
      this.request.encoding +
      this.request.mid +
      this.request.mode +
      this.request.portalid +
      this.request.request +
      this.request.responsetype +
      this.request.storecarddata +
      key
    //var h = <(message)
    //this.request.hash = h;
    //this.iframe = new Payone.ClientApi.HostedIFrames(this.config, this.request);
    window['iFramePayone'] = new Payone.ClientApi.HostedIFrames(this.config, this.request);
    window['iFramePayone'].setCardType('V')
    // Call-by-share is javascript
    // MEANS Internals are happy to be shared and changed. direct changes of the Parameter won't take any effect.
    this.iframe = window['iFramePayone']
    // console.log(Payone)
    // console.log(window['iFramePayone'])
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
body {
  background: #fff;
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
input,
select {
  font-size: 1em;
  border: 1px solid #000;
  padding: 0.1em;
}
select {
  margin-right: 10px;
}

input,
.inputIframe,
select {
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
