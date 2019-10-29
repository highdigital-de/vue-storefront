Installation Instructions for Payone-Module:

//Hashing not in frontend.

1. Hashing Function:
   A: md5 lib: npm i js-md5 --save
   B SHA-384 lib: npm install ??

2. Add following Script for Payone-CreditCard-IFrame to index.basic.template.html:

    <head> 
    	<script src="https://secure.pay1.de/client-api/js/v1/payone_hosted.js"></script>
    ..
    </head>

   OR:

   Add following to src/themes/head.js
   script: [
   ...
   ,
   {
   src: 'https://secure.pay1.de/client-api/js/v1/payone_hosted_min.js',
   async: true,
   defer: true //Use this command if you script loads html from somewhere else, against crossplattform errors in production build
   }
   ]

3)       modified:   src/themes/default/components/core/blocks/Checkout/Payment.vue
         add to:
             <template>
             <div class="payment pt20">
                 <div id="Payone1" />  <-- injection point for Payone Script
                 ...
             <div v-for="(method, index) in paymentMethods" :key="index" class="col-md-6">
             ...
             <div name="payone-test-container" :id="method.code"></div>
                 <!-- injection point for Payment-module components via id -->
                 <!-- reset point on 'checkout-payment-method-changed' in payment.ts -->

             </div>

4)


    modified:   core/modules/checkout/components/Payment.ts
    add to method:    changePaymentMethod() {
        ....
      let payoneContainers = document.getElementsByName(
        'payone-test-container'
      );
      for (let i = 0; i < payoneContainers.length; i++) {
        //delete innerHtml block of  all occurence's of "payone-test-container"
        payoneContainers[i].innerHTML = ''; // reset
      }

        //before $bus.emit(event)
      }

3. Check for working production build
   - yarn build
   - yarn start
