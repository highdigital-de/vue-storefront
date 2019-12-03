<template>
  <div
    name="payone-test-container"
    id="payone_creditcard"
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
        <!---input
          class="submit"
          type="submit"
          value="submit"
          @click.stop.prevent="check"
        -->
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
        aid: '',
        api_version: '', // your AID
        encoding: '', // desired encoding
        mid: '', // your MID
        mode: '', // desired mode
        portalid: '', // your PortalId
        request: '', // fixed value
        responsetype: 'JSON', // fixed value
        storecarddata: 'yes', // fixed value
        hash: '' // see Chapter 3.1.5.3
      }
    }
  },
  methods: {
    onSelectChange: function (event) {
      this.iframe.setCardType(event.target.value)
    },
    callApiCcCheck(): Promise<Response> {
      return new Promise((resolve, reject) => {
        var config = require("config");
        let url=config.api.url+'/api/payone/creditcardcheck';
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

          //body: JSON.stringify({
         // })
        }).then(res => {
          res.json().then(result => {
            resolve(JSON.parse(result.result))
          })
        }).catch(err => {
          console.log('THB: payment err', err)
          reject(err)
        })
      })
    }
  },
  mounted () {
    this.callApiCcCheck().then((res) => {
      console.log('THB: aid, hash',res.aid, res.hash)
      this.request.aid = res.aid;
      this.request.api_version = res.api_version;
      this.request.encoding = res.encoding;
      this.request.mid = res.mid;
      this.request.mode = res.mode;
      this.request.portalid = res.portalid;
      this.request.hash = res.hash;
      this.request.aid = res.aid;
      this.request.request = res.request;
      this.request.storecarddata = res.storecarddata;
      console.log('THB: request data:',res, this.request);

      window['iFramePayone'] = new Payone.ClientApi.HostedIFrames(this.config, this.request);
      window['iFramePayone'].setCardType('V')
      this.iframe = window['iFramePayone']
          }, err => {
      console.log(err)
    })
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
